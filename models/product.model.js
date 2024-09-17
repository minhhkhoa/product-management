const mongoose = require("mongoose")
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug)

const productSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    slug: { 
      type: String,
      slug: "title",
      unique: true
    },
    deleted: {
      type: Boolean,
      //neu ko truyen du lieu thi nhan macdinh la false
      default:false
    },
    deletedAt: Date
  },
  //tham so thu 2
  {
    timestamps: true
  })

const Product = mongoose.model('Product', productSchema, "products")
//  varriable              ten bien model           ten obj trong mongoo ko bawts buoc co
module.exports = Product