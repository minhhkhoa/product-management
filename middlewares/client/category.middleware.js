const ProductCategory = require("../../models/product-category.model")
const createTreeHelper = require("../../helpers/createTree")

module.exports.category = async (req, res, next) => {
  //lay data
  const productsCategory = await ProductCategory.find({
    deleted: false
  })

  const newProductsCategory = createTreeHelper.tree(productsCategory)

  res.locals.layoutProductsCategory = newProductsCategory
  
  next()
}