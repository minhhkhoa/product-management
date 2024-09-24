const Account = require("../../models/account.model")
const Role = require("../../models/role.model")
var md5 = require('md5') //-mã hóa mật khẩu của account
const systemConfig = require("../../config/systems")
const { json } = require("body-parser")

//[get]: /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  }

  //-cái select kia là lựa chọn cái nào lấy ra: cú pháp -password token
  //  là lấy hết ngoại trừ 2 cái đó tránh lộ thông tin
  const records = await Account.find(find).select("-password -token")

  for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id,
      deleted: false
    })
    //-thêm key role cho obj
    record.role = role
  }

  res.render("admin/pages/accounts/index", {
    pageTitle: 'Danh sách tài khoản',
    records: records
  })
}

//[get]: /admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false
  })

  res.render("admin/pages/accounts/create", {
    pageTitle: 'Tạo mới tài khoản',
    roles: roles
  })
}

//[post]: /admin/accounts/createPost
module.exports.createPost = async (req, res) => {
  //-check xem da ton taij email do chua neu co roi se bao loi
  const emailExits = await Account.findOne({
    email: req.body.email,
    deleted: false
  })
  if (emailExits) {
    req.flash("error", "Email đã tồn tại")
    res.redirect("back")
  } else {
    //-mã hóa mật khẩu
    req.body.password = md5(req.body.password)
    const record = new Account(req.body);
    await record.save()

    res.redirect(`${systemConfig.prefixAdmin}/accounts`)
  }
}

//[get]: /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  let find = {
    _id: req.params.id,
    deleted: false
  }

  try {
    const data = await Account.findOne(find)

    const roles = await Role.find({
      deleted: false
    })

    res.render("admin/pages/accounts/edit", {
      pageTitle: "Chỉnh sửa tài khoản",
      data: data,
      roles: roles
    })
  } catch (err) {
    res.redirect(`${systemConfig.prefixAdmin}/accounts`)
  }
}

//[patch]: /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  //-id thằng đang sửa
  const id = req.params.id

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
