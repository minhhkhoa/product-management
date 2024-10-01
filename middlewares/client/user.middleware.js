const User = require("../../models/user.model")

module.exports.infoUser = async (req, res, next) => {
  if (req.cookies.tokenUser) { //neu da dang nhap
    const user = await User.findOne({
      tokenUser: req.cookies.tokenUser,
      deleted: false,
      status: "active"
    }).select("-password")

    if (user) { //-neu tim ra
      res.locals.user = user //- luu bien toan cuc
    }

  }

  next() //- cho next khi ho chua co dangnhap hoac dk
}