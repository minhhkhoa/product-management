const Account = require("../../models/account.model")
const Role = require("../../models/role.model")

const systemConfig = require("../../config/systems")

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.token) {//-ko có token
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
  } else {
    const user = await Account.findOne({ token: req.cookies.token }).select("-password")
    if (!user) {//-ko co user nao co token nhu vay vi cos th nos sua tkon khi f12
      res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
    } else {
      const role = await Role.findOne({
        _id: user.role_id
      }).select("title permissions")

      // App Locals Variables( bieens nay dung dc o dau cx dc ca file pug)
      res.locals.user = user // mooix 1 token se la 1 tk do
      res.locals.role = role 
      next()
    }
  }

}