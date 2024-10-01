const User = require("../../models/user.model")

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.tokenUser) {//-ko có token
    res.redirect(`/user/login`)
  } else {
    const user = await User.findOne({ tokenUser: req.cookies.tokenUser }).select("-password")
    if (!user) {//-ko co user nao co token nhu vay vi cos th nos sua tkon khi f12
      res.redirect(`/user/login`)
    } else {
      // App Locals Variables( bieens nay dung dc o bất kỳ đâu kể cả pug)
      res.locals.user = user // mooix 1 token se la 1 tk do
      next()
    }
  }

}