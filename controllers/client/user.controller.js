const User = require("../../models/user.model")
const ForgotPassword = require("../../models/forgot-password.model")
const md5 = require("md5")
const generateHelper = require("../../helpers/generate")


//[get] /user/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng ký tài khoản"
  })
}

//[post] /user/register
module.exports.registerPost = async (req, res) => {

  const existEmail = await User.findOne({
    email: req.body.email
  })

  //-neu co tk roi
  if (existEmail) {
    req.flash("error", "Email đã tồn tại")
    res.redirect("back")
    return
  }

  //-chay toi day tuc la chua co email ==> lua tk dk
  req.body.password = md5(req.body.password)
  const user = new User(req.body)
  await user.save()

  res.cookie("tokenUser", user.tokenUser)

  res.redirect("/")
}

//[get] /user/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle: "Đăng nhập tài khoản"
  })
}

//[post] /user/login
module.exports.postLogin = async (req, res) => {
  //-lay email,password
  const email = req.body.email
  const password = req.body.password

  const user = await User.findOne({
    email: email,
    deleted: false
  })

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

  if (user.status === "inactive") {
    req.flash("error", "Tài khoản đang bị khóa")
    res.redirect("back")
    return
  }

  res.cookie("tokenUser", user.tokenUser) //-muc dich la dung tokenUser moi cho login o middleware co viet

  res.redirect("/")
}

//[get] /user/logout
module.exports.logout = async (req, res) => {
  //-xoa cookie
  res.clearCookie("tokenUser")
  res.redirect("/")
}

//[get] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {

  res.render("client/pages/user/forgot-password", {
    pageTitle: "Lấy lại mật khẩu"
  })
}

//[post] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email

  const user = await User.findOne({
    email: email,
    deleted: false
  })

  //check
  if (!user) {
    req.flash("error", "Email không tồn tại")
    res.redirect("back")
    return
  }

  //- luu thong tin dua can doi pass vao db
  const otp = generateHelper.generateRandomNumber(8)
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expiresAt: Date.now()
  }

  const forgotPassword = new ForgotPassword(objectForgotPassword)
  await forgotPassword.save()

  //-neu ton tai email can doi passs ==> gui ma otp qua email


}
