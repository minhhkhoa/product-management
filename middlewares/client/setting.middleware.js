const SettingGeneral = require("../../models/settings-general.model")

module.exports.settingGeneral = async (req, res, next) => {
  //-lay ra
  const settingGeneral = await SettingGeneral.findOne({})

  //- lam bien toan cuc
  res.locals.settingGeneral = settingGeneral

  next() //- cho next khi ho chua co dangnhap hoac dk
}