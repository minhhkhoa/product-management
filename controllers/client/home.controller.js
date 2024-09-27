const Product = require("../../models/product.model")
const productsHelper = require("../../helpers/product")

//[get]: /
module.exports.index = async(req, res) => {
  //-lay ra sp noi bat
  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active"
  }).limit(5)

  //-tinh lai gia moi
  const newProduct = productsHelper.priceNewProducts(productsFeatured)

  res.render("client/pages/home/index",{
    pageTitle: 'Trang chủ',
    productsFeatured: newProduct,
  })
}