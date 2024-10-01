const Cart = require("../../models/cart.model")

module.exports.cartId = async (req, res, next) => {
  if (!req.cookies.cartId) {
    //-tao gio hang
    const cart = new Cart()
    await cart.save() //-tao gio hang moi trong db roi luu no vao cookies

    const expiresCookie = 365 * 24 * 60 * 60 * 1000 //- 1 giay

    res.cookie("cartId", cart.id, {
      expires: new Date(Date.now() + expiresCookie)
    })
  } else {
    //-lay ra gio hang thoi
    const cart = await Cart.findOne({
      _id: req.cookies.cartId
    })

    if (cart.products) { // co gio hang nhung chua co sp
      cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0)

      res.locals.miniCart = cart //miniCart = cart
    }
  }
  next()
}