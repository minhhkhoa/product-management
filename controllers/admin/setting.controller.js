const SettingGeneral = require("../../models/settings-general.model")

//[get] /admin/settings/general
module.exports.general = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({})
  res.render("admin/pages/settings/general",{
    pageTitle: "Cài đặt chung",
    settingGeneral: settingGeneral
  })
}

//[patch] /admin/settings/general
module.exports.generalPatch = async (req, res) => {

  //-check xem co chua vi lan dau tien se ch co ban ghi nao
  const settingGeneral = await SettingGeneral.findOne({})

  if (settingGeneral){ //-co roi ==> cap nhat lai
    await SettingGeneral.updateOne({
      _id: settingGeneral.id
    },req.body)
  } else{//- ch co
  const record = new SettingGeneral(req.body) 
  await record.save()
  }

  res.redirect("back")
}
