const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema(
  {
    // user_id: String,
    cart_id: String,
    userInfo: {
      fullName: String,
      phone: String,
      address: String
    },
    products: [ //-tai sao trong cart_id cos products roi ma o day van tao them
      //- se co th dat hang roi nhung sp tang hoac giam gia thi minh van phai
      //-lay ra dc gia ma khach da dat trc do
      {
        product_id: String,
        price: Number,
        discountPercentage: Number,
        quantity: Number,
      }
    ],

    deleted: {
      type: Boolean,
      //neu ko truyen du lieu thi nhan macdinh la false
      default: false
    },
    deletedAt: Date
  },
  //tham so thu 2
  {
    timestamps: true
  })

const Order = mongoose.model('Order', orderSchema, "orders")
//  varriable              ten bien model           ten doccument trong mongoo ko bawts buoc co
module.exports = Order