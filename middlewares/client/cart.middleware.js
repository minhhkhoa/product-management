const Cart = require("../../models/cart.model");
const mongoose = require('mongoose');

module.exports.cartId = async (req, res, next) => {
  if (!req.cookies.cartId) {
    // Tạo giỏ hàng mới
    const cart = new Cart();
    await cart.save(); // Lưu giỏ hàng mới vào DB

    const expiresCookie = 365 * 24 * 60 * 60 * 1000; // Thời gian hết hạn cookie

    res.cookie("cartId", cart.id, {
      expires: new Date(Date.now() + expiresCookie)
    });
  } else {
    const cartId = req.cookies.cartId;

    // Kiểm tra xem cartId có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      return res.status(400).send('Invalid Cart ID');
    }

    // Lấy giỏ hàng
    const cart = await Cart.findOne({ _id: cartId });

    if (!cart) {
      return res.status(404).send('Cart not found');
    }

    if (cart.products) { // Nếu có giỏ hàng nhưng chưa có sản phẩm
      cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
      res.locals.miniCart = cart; // Gán cart vào res.locals
    }
  }
  next();
};
