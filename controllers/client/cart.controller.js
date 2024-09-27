const Cart = require("../../models/cart.model")

//[post]: /cart/add/:productId
module.exports.addPost = async (req, res) => {
//-them sp vao gio
  const productId = req.params.productId
  const quantity = parseInt(req.body.quantity)
  const cartId = req.cookies.cartId

  //-lay ra gio hang
  const cart = await Cart.findOne({
    _id: cartId
  })

  //-check xem trong gio đã co sp dang muon them hay ko
  const existProductInCart = cart.products.find(item => item.product_id == productId) //-tra ve obj neu thay no

  if(existProductInCart){ //- neu co thi update lai quantity obj
    const quantityNew = quantity + existProductInCart.quantity

    //-cap nhat lai quantity vao dung obj dang luu
    await Cart.updateOne({
      _id: cartId, //- day la id gio hang
      "products.product_id": productId //-products day la o trong cart.model choc vao product_id
    },{
      $set:{ //-set lai giatri quantity
        "products.$.quantity": quantityNew
      }
    })
  } else{ //- neu chua co thi moi them  sp moi
    const objectCart = {
      product_id: productId,
      quantity: quantity
    }
  
    await Cart.updateOne(
      {
        _id: cartId
      },
      {
        //- lưu vào field products trong cartModel coi cu phap
        $push: { products : objectCart}
      }
    )
  }

  req.flash("success","Đã thêm sản phẩm vào giỏ hàng")

  res.redirect("back")
}