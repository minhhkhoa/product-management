const ProductCategory = require("../../models/product-category.model")

//[get]: /admin/dashboard
module.exports.dashboard = async (req, res) => {

  //-thong ke
  const statistic = {
    categoryProduct: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    product: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    account: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    user: {
      total: 0,
      active: 0,
      inactive: 0,
    },
  };

  //-update lai
  statistic.categoryProduct.total = await ProductCategory.countDocuments({
    deleted: false
  })
  statistic.categoryProduct.active = await ProductCategory.countDocuments({
    deleted: false,
    status: "active"
  })
  statistic.categoryProduct.inactive = await ProductCategory.countDocuments({
    deleted: false,
    status: "inactive"
  })

  //- tu lam tiep 3 tk con lai


  res.render("admin/pages/dashboard/index", {
    pageTitle: 'Trang tổng quan',
    statistic: statistic
  })
}