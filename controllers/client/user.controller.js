const User = require("../../models/user.model")
const ForgotPassword = require("../../models/forgot-password.model")
const Cart = require("../../models/cart.model")
const md5 = require("md5")
const generateHelper = require("../../helpers/generate")
const sendMailHelper = require("../../helpers/sendMail")

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

  //- lay ra cartId: muc dich la them user_Id cho cardId
  await Cart.updateOne({
    _id: req.cookies.cartId
  },{
    user_id: user.id
  })

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
    expireAt: Date.now()
  }

  const forgotPassword = new ForgotPassword(objectForgotPassword)
  await forgotPassword.save()

  //-neu ton tai email can doi passs ==> gui ma otp qua email dung tv nodemailer
  const subject = "Mã OTP xác minh lấy lại mật khẩu"
  const html = `
    Mã OTP để lấy lại mật khẩu là: <b>${otp}</b>. Thời hạn sử dụng là 3 phút.
  `
  sendMailHelper.sendMail(email, subject, html)

  //-chuyen huong
  res.redirect(`/user/password/otp?email=${email}`)
}

//[get] /user/password/otpPassword
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email

  res.render("client/pages/user/otp-password", {
    pageTitle: "Nhập mã OTP",
    email: email
  })
}

//[post] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {

  //-lay ra thong tin ng dung gui qua form
  const email = req.body.email
  const otp = req.body.otp

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp
  })

  if (!result) {
    req.flash("error", "Mã OTP không hợp lệ")
    res.redirect("back")
    return
  }

  //- chay toi day thi tuc la da nhap dung ma OTP roi
  const user = await User.findOne({
    email: email
  })

  res.cookie("tokenUser", user.tokenUser)
  // Mục đích chính: Cookie này có thể được sử dụng để XÁC THỰC NG DUNG NÀO CẦN ĐỔI MẬT KHẨU
  //dung o: //[post] /user/password/reset

  res.redirect("/user/password/reset")

}

//[get] /user/password/reset
module.exports.resetPassword = async (req, res) => {

  res.render("client/pages/user/reset-password", {
    pageTitle: "Đổi mật khẩu",
  })
}

//[post] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {

  //- lay ra thong tin ng dung nhap tu form
  const password = req.body.password
  //const confirmpassword = req.body.confirmpassword //- ko can lam vi validate r

  //- bay gio phai check ra dung tk tokenUser do
  const tokenUser = req.cookies.tokenUser


  await User.updateOne({
    tokenUser: tokenUser
  }, {
    //-doi pass
    password: md5(password)
  })

  //-ve trang chu
  res.redirect("/")

}

//[get] /user/info
module.exports.info = async (req, res) => {
  res.render("client/pages/user/info", {
    pageTitle: "Thông tin tài khoản",
  })
}
