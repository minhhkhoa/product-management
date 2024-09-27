const ProductCategory = require("../models/product-category.model")

module.exports.getSubCategory = async (parentId) => {

  //-hàm trong hàm
  const getCategory = async (parentId) => {
    //-tim con dau tien 
    const subs = await ProductCategory.find({
      parent_id: parentId,
      status: "active",
      deleted: false
    })

    //-noi da luu
    let allSub = [...subs]

    for (const sub of subs) {
      //-tim con cap tiep theo
      const childs = await getCategory(sub.id)
      allSub = allSub.concat(childs)
    }

    return allSub
  }

  //-gọi hàm getCategory(): nó chạy dưới dòng này trc
  const result = await getCategory(parentId)

  return result
}