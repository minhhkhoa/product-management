const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model")
const productsHelper = require("../../helpers/product")

//[get]: /cart
module.exports.index = async (req, res) => {

  //-do du lieu ra table
  const cartId = req.cookies.cartId

  const cart = await Cart.findOne({
    _id: cartId
  })

  if (cart.products.length > 0) {//- neu co sp
    for (const item of cart.products) { //-lap qua tung sp 
      const productId = item.product_id //-lay dc id
      const productInfo = await Product.findOne({ //- findOne --> object
        _id: productId
      }).select("title thumbnail slug price discountPercentage")

      //-tinh new price
      productInfo.priceNew = productsHelper.priceNewProduct(productInfo)

      //-tong tien sp
      item.totalPrice = productInfo.priceNew * item.quantity

      //- addkey cho mang cart.products."productInfo"
      item.productInfo = productInfo

    }
  }
  //-tong tien ca gio
  cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0)


  res.render("client/pages/cart/index", {
    pageTitle: "Giỏ hàng",
    cartDetail: cart
  })
}


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

  if (existProductInCart) { //- neu co thi update lai quantity obj
    const quantityNew = quantity + existProductInCart.quantity

    //-cap nhat lai quantity vao dung obj dang luu
    await Cart.updateOne({
      _id: cartId, //- day la id gio hang
      "products.product_id": productId //-products day la o trong cart.model choc vao product_id
    }, {
      $set: { //-set lai giatri quantity
        "products.$.quantity": quantityNew
      }
    })
  } else { //- neu chua co thi moi them  sp moi
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
        $push: { products: objectCart }
      }
    )
  }

  req.flash("success", "Đã thêm sản phẩm vào giỏ hàng")

  res.redirect("back")
}

//[get]: /cart/delete/:productId
module.exports.delete = async (req, res) => {

  //-lay ra gio hang can cap nhat lai sp
  const cartId = req.cookies.cartId

  //-lay ra id sp can xoa
  const productId = req.params.productId

  //cap nhat lai gio hang
  await Cart.updateOne(
    {
      _id: cartId
    },
    {
      //- cu phap xoa 
      $pull: { products: {product_id: productId} }
    }
  )  


  req.flash("success","Đã xóa sản phẩm khỏi giỏ hàng")
  res.redirect("back")
}