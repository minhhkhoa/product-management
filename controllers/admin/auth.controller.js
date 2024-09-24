const Account = require("../../models/account.model")
const Role = require("../../models/role.model")
var md5 = require('md5') //-mã hóa mật khẩu của account
const systemConfig = require("../../config/systems")
const { use } = require("../../routes/admin/dashboard.route")

//[get]: /admin/auth/login
module.exports.login = (req, res) => {
  res.render("admin/pages/auth/login", {
    pageTitle: 'Đăng nhập'
  })
}

//[post]: /admin/auth/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email
  const password = req.body.password
  
  const user = await Account.findOne({
    email: email,
    deleted: false
  })
  console.log(req.body)

  if (!user) {
    req.flash("error", "Email không tồn tại")
    res.redirect("back")
    return
  }
  
  if (md5(password) != user.password) {
    req.flash("error", "Mật khẩu không chính xác")
    res.redirect("back")
    return
  }
  
  if (user.status == "inactive") {
    req.flash("error", "Tài khoản này bị khóa")
    res.redirect("back")
    return
  }
  
  res.cookie("token", user.token)
  //-login success
  res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
  
  
}

//[get]: /admin/auth/logout
module.exports.logout = (req, res) => {
  //-xoa token trong cookie
  res.clearCookie("token")
  res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
}