const mongoose = require("mongoose")

//- chi duy nhat co 1 ban ghi thoi
const settingGeneralSchema = new mongoose.Schema(
  {
   websiteName: String,
   logo: String,
   phone: String,
   email: String,
   address: String,
   copyright: String
  },
  //tham so thu 2
  {
    timestamps: true
  })

const SettingGeneral = mongoose.model('SettingGeneral', settingGeneralSchema, "settings-general")
//  varriable              ten bien model           ten obj trong mongoo ko bawts buoc co
module.exports = SettingGeneral