const Product = require("../../models/product.model")
const ProductCategory = require("../../models/product-category.model")


const productsHelper = require("../../helpers/product")
const productsCategoryHelper = require("../../helpers/product-category")


//[get]: /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false
  }).sort({
    position: "desc" //-giamr daanf
    // position: "asc" //-tang dan
  })

  const newProduct = productsHelper.priceNewProducts(products)

  res.render("client/pages/products/index", {
    pageTitle: 'Danh sách sản phẩm',
    products: newProduct
  })
}

//[get]: /products/:slug
module.exports.detail = async (req, res) => {
  try {
    // console.log(req.params.id)
    const find = {
      deleted: false,
      slug: req.params.slugProduct,
      status: "active"
    }
    const product = await Product.findOne(find)

    //-ý là muốn lấy ra tên danh mục
    if(product.product_category_id){ // co id cha thi them category cho sp do
      const category = await ProductCategory.findOne({
        _id: product.product_category_id,
        status: 'active',
        deleted: false
      })

      product.category = category
    }

    //-tinh gia moi
    product.priceNew = productsHelper.priceNewProduct(product)

    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product
    })
  } catch (error) {
    req.flash("error", "Không tồn tại sản phẩm")
    res.redirect("/products")
  }
}

//[get]: /products/:slugCategory
module.exports.category = async (req, res) => {

  //-lay ra danh muc(muc dich de lay id cua danh muc do de truy cap vao product)
  const category = await ProductCategory.findOne({
    slug: req.params.slugCategory,
    status: "active",
    deleted: false
  })


  //vi ham getSubCategory dung async nen khi gon them await vao
  const listSubCategory = await productsCategoryHelper.getSubCategory(category.id)//cha

  //-lay ra id thoi
  const listSubCategoryId = listSubCategory.map((item) => item.id)

  const products = await Product.find({
    product_category_id: { $in: [category.id, ...listSubCategoryId]},
    //                             idCha          cacId con cua no
    deleted: false
  }).sort({ position: "desc" })

  const newProduct = productsHelper.priceNewProducts(products)


  res.render("client/pages/products/index", {
    pageTitle: category.title,
    products: newProduct
  })
}