//- req và res được truyền sẵn rồi
module.exports.registerPost = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", "Vui lòng nhập họ tên")
    res.redirect("back")
    return
  }

  if (!req.body.email) {
    req.flash("error", "Vui lòng nhập email")
    res.redirect("back")
    return
  }

  if (!req.body.password) {
    req.flash("error", "Vui lòng nhập mật khẩu")
    res.redirect("back")
    return
  }

  next() //sang Bước kết tiếp là đi vào controller
}

module.exports.loginPost = (req, res, next) => {

  if (!req.body.email) {
    req.flash("error", "Vui lòng nhập email")
    res.redirect("back")
    return
  }

  if (!req.body.password) {
    req.flash("error", "Vui lòng nhập mật khẩu")
    res.redirect("back")
    return
  }

  next() //sang Bước kết tiếp là đi vào controller
}

module.exports.forgotPasswordPost = (req, res, next) => {

  if (!req.body.email) {
    req.flash("error", "Vui lòng nhập email")
    res.redirect("back")
    return
  }

  next() //sang Bước kết tiếp là đi vào controller
}

module.exports.resetPasswordPost = (req, res, next) => {

  if (!req.body.password) {
    req.flash("error", "Vui lòng nhập mật khẩu")
    res.redirect("back")
    return
  }

  if (!req.body.confirmpassword) {
    req.flash("error", "Vui lòng xác nhận mật khẩu")
    res.redirect("back")
    return
  }

  if (req.body.password != req.body.confirmpassword) {
    req.flash("error", "Mật khẩu không khớp")
    res.redirect("back")
    return
  }

  next() //sang Bước kết tiếp là đi vào controller
}

