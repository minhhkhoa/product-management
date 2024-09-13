//[get]: /products
const Product = require("../../models/product.model")
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false
  }).sort({
    position: "desc" //-giamr daanf
    // position: "asc" //-tang dan
  })

  const newProduct = products.map(item => {
    item.priceNew = (item.price - item.price * item.discountPercentage / 100).toFixed(0)
    return item
  })
  // console.log(products)

  res.render("client/pages/products/index", {
    pageTitle: 'Danh sách sản phẩm',
    products: newProduct
  })
}

//[get]: /products/:slug
module.exports.detail = async (req, res) => {
  const slug = req.params.slug
  try {
    // console.log(req.params.id)
    const find = {
      deleted: false,
      slug: slug,
      status: "active"
    }
    const product = await Product.findOne(find)

    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product
    })
  } catch (error) {
    req.flash("error", "Không tồn tại sản phẩm")
    res.redirect("/products")
  }
}