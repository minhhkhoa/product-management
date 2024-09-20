const Product = require("../../models/product.model")
const ProductCategory = require("../../models/product-category.model")
const filterStatusHelper = require("../../helpers/filterstatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
const createTreeHelper = require("../../helpers/createTree")


//[get]: /admin/products
module.exports.index = async (req, res) => {

  //loc
  const filterStatus = filterStatusHelper(req.query)

  let find = {
    deleted: false,
  }
  //-lọc ra các cái sp là active
  if (req.query.status) {
    find.status = req.query.status
  }

  const objSearch = searchHelper(req.query)
  if (objSearch.regex) {
    find.title = objSearch.regex
  }

  //start Phan trang
  const countProducts = await Product.countDocuments(find)

  let objPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4
    },
    req.query,
    countProducts
  )
  //end phan trang

  //-start sort 
  const sort = {}
  if (req.query.sortKey && req.query.sortValue) {
    //Truyền 1 string thì []
    sort[req.query.sortKey] = req.query.sortValue
  } else {
    sort.position = "desc"
  }
  //-end sort 
  
  //lay data
  const products = await Product.find(find)
    .sort(sort)
    .limit(objPagination.limitItems).skip(objPagination.skip)
    
  res.render("admin/pages/products/index", {
    pageTitle: 'Danh sách sản phẩm',
    products: products,
    filterStatus: filterStatus,
    keyword: objSearch.keyword,
    pagination: objPagination
  })
}

//[patch]:/admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status
  const id = req.params.id

  //update database
  await Product.updateOne({ _id: id }, { status: status })
  //                   -update by id  -content need update

  req.flash("success", "Cập nhật trạng thái thành công")

  res.redirect("back")
  // res.redirect("/admin/products")
  //nôm na là nó tự động chuyển hướng tới tham số bên trong hàm
  //- lên đọc doc của nó là rõ (expressJs: API refenrence (5.x))
}

//[patch]:/admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  //- caif theem thu vien body-parser de s/d req.body
  // console.log(req.body)
  const type = req.body.type
  const ids = req.body.ids.split(", ")

  //update many data to id
  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" })
      req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm`)

      break

    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" })
      req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm`)
      break

    case "delete-all":
      await Product.updateMany({ _id: { $in: ids } }, {
        deleted: true,
        deletedAt: new Date()
      })
      req.flash("success", `Xóa thành công ${ids.length} sản phẩm`)
      break

    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-")
        position = parseInt(position)
        await Product.updateOne({ _id: id }, {
          position: position
        })
      }
      req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm`)

      break

    default:
      break;
  }
  res.redirect("back")
}

//[DELETE]:/admin/products/delete/id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id

  //delete database

  //-xóa cứng
  // await Product.deleteOne({ _id: id })

  //-xóa mềm
  await Product.updateOne({ _id: id }, {
    deleted: true,
    //nhớ thêm deletedAt bên Model
    deletedAt: new Date()
  })
  req.flash("success", "Xóa sản phẩm thành công")
  res.redirect("back")

}

//[get]:/admin/products/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false
  }

  const category = await ProductCategory.find(find)

  const newCategory = createTreeHelper.tree(category)

  res.render("admin/pages/products/create", {
    pageTitle: 'Thêm mới sản phẩm',
    category: newCategory
  })
}

//[post]:/admin/products/create
module.exports.createPost = async (req, res) => {
  // console.log(req.file) //no tu co khi dung multer
  // console.log(req.body)
  req.body.price = parseInt(req.body.price)
  req.body.discountPercentage = parseInt(req.body.discountPercentage)
  req.body.stock = parseInt(req.body.stock)

  if (req.body.position == "") {
    const countProducts = await Product.countDocuments({})
    req.body.position = countProducts + 1
  } else {
    req.body.position = parseInt(req.body.position)
  }
  console.log(req.body)

  //add product
  const product = new Product(req.body)
  await product.save()
  res.redirect("/admin/products")
}

//[get]:/admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    // console.log(req.params.id)
    const find = {
      deleted: false,
      _id: req.params.id
    }
    const product = await Product.findOne(find)
    // console.log(product) //obj

    const category = await ProductCategory.find({
      deleted: false
    })

    const newCategory = createTreeHelper.tree(category)

    res.render("admin/pages/products/edit", {
      pageTitle: 'Chỉnh sửa sản phẩm',
      product: product,
      category: newCategory
    })
  } catch (error) {
    req.flash("error", "Không tồn tại sản phẩm")
    res.redirect("/admin/products")
  }
}

// [patch]:/admin/products/edit/:id
module.exports.editSuccess = async (req, res) => {
  const id = req.params.id
  req.body.price = parseInt(req.body.price)
  req.body.discountPercentage = parseInt(req.body.discountPercentage)
  req.body.stock = parseInt(req.body.stock)
  req.body.position = parseInt(req.body.position)

  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`
  }

  try {
    //update database
    await Product.updateOne({ _id: id }, req.body)
    //                   -update by id  -content need update
    req.flash("success", "Cập nhật trạng thái thành công")
  } catch (error) {
    req.flash("error", "Cập nhật trạng thái không thành công")
  }
  res.redirect("/admin/products")

}

//[get]:/admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    // console.log(req.params.id)
    const find = {
      deleted: false,
      _id: req.params.id
    }
    const product = await Product.findOne(find)

    res.render("admin/pages/products/detail", {
      pageTitle: product.title,
      product: product
    })
  } catch (error) {
    req.flash("error", "Không tồn tại sản phẩm")
    res.redirect("/admin/products")
  }
}







