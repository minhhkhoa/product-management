const mongoose = require("mongoose")

//-gio hang
const cartSchema = new mongoose.Schema(
  {
   user_id: String,
   products: [
    {
      product_id: String,
      quantity: Number
    }
   ]
  },
  {
    timestamps: true
  }
)

const Cart = mongoose.model('Cart', cartSchema, "carts")
//  varriable              ten bien model           ten obj trong mongoo ko bawts buoc co
module.exports = Cart