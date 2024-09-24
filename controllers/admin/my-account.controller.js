var md5 = require('md5') //-mã hóa mật khẩu của account
const Account = require("../../models/account.model")



// [get] /admin/my-account
module.exports.index = async (req, res)=>{
  res.render("admin/pages/my-account/index",{
    pageTitle: "Thông tin cá nhân"
  })
}

// [get] /admin/my-account/edit
module.exports.edit = async (req, res)=>{
  res.render("admin/pages/my-account/edit",{
    pageTitle: "Chỉnh sửa thông tin cá nhân"
  })
}

// [patch] /admin/my-account/editPatch
module.exports.editPatch = async (req, res)=>{
  //-id thằng đang sửa
  const id = res.locals.user.id

  const emailExits = await Account.findOne({
    _id: { //- bỏ tìm đứa đang sửa đi
      $ne: id
      //-not equals
    },
    email: req.body.email,
    deleted: false
  })

  if (emailExits) {
    req.flash("error", "Email đã tồn tại")
  } else {
    if (req.body.password) {//-nếu sửa lại mk
      req.body.password = md5(req.body.password)
    } else {
      delete req.body.password //- xóa key password
    }
    await Account.updateOne({ _id: id }, req.body)
    req.flash("success", "Cập nhật thành công")
  }

  res.redirect("back")
}