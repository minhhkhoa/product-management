const Product = require("../../models/product.model")
const productsHelper = require("../../helpers/product")

//[get]: /
module.exports.index = async (req, res) => {
  //-start lay ra sp noi bat
  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active"
  }).limit(6)

  //-tinh lai gia moi
  const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured)
  //-end lay ra sp noi bat


  // -start show new products 
  const productsNew = await Product.find({
    deleted: false,
    status: "active"
  }).sort({ position: "desc" }).limit(6)

  const newProductNew = productsHelper.priceNewProducts(productsNew)
  // -end show new products 

  res.render("client/pages/home/index", {
    pageTitle: 'Trang chủ',
    productsFeatured: newProductsFeatured,
    productsNew: newProductNew
  })
}