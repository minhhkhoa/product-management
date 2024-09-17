const ProductCategory = require("../../models/product-category.model")
const systemConfig = require("../../config/systems")
const createTreeHelper = require("../../helpers/createTree")

//[get]: /admin/products-category
module.exports.index = async (req, res) => {

  let find = {
    deleted: false,
  }

  //lay data
  const records = await ProductCategory.find(find)

  const newRecords = createTreeHelper.tree(records)

  res.render("admin/pages/products-category/index", {
    pageTitle: 'Danh mục sản phẩm',
    records: newRecords
  })
}

//[get]: /admin/products-category/create
module.exports.create = async (req, res) => {

  let find = {
    deleted: false
  }

  const records = await ProductCategory.find(find)

  const newRecords = createTreeHelper.tree(records)

  res.render("admin/pages/products-category/create", {
    pageTitle: 'Tạo danh mục sản phẩm',
    records: newRecords,
  })
}

//[post]:/admin/products-category/create
module.exports.createPost = async (req, res) => {
  if (req.body.position == "") {
    const count = await ProductCategory.countDocuments({})
    req.body.position = count + 1
  } else {
    req.body.position = parseInt(req.body.position)
  }

  const record = new ProductCategory(req.body)
  await record.save()
  res.redirect(`${systemConfig.prefixAdmin}/products-category`)

}