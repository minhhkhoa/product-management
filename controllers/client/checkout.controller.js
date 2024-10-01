const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model")
const Order = require("../../models/order.model")
const productsHelper = require("../../helpers/product")

//[get] /check/
module.exports.index = async (req, res) => {

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

  res.render("client/pages/checkout/index", {
    pageTitle: "Đặt hàng",
    cartDetail: cart

  })
}

//[post] /checkout/order
module.exports.order = async (req, res) => {
  
  const cartId = req.cookies.cartId
  //-console.log(req.body)
  const userInfo = req.body //- chinh la cai thong tin form gui len
  
  //-lay ra gio hang
  const cart = await Cart.findOne({
    _id: cartId
  })
  
  const products = []
  
  //-muc dich doan nay==> doc comment trong model cua order
  for (const product of cart.products) {
    const objectProduct = {//-lay ra tung sp
      product_id: product.product_id,
      price: 0,
      discountPercentage: 0,
      quantity: product.quantity,
    }
    
    const productInfo = await Product.findOne({//-sp khach da them vao gio
      _id: product.product_id
    }).select("price discountPercentage")
    
    objectProduct.price = productInfo.price
    objectProduct.discountPercentage = productInfo.discountPercentage
    
    //-muc dich la lay lai ra sp ma khach hang dat voi cai gia hay % giam ban dau
    //- vi so rang khach them vao gio song hom sau sp tang gia manh hon thi khach se ko bi thiet
    products.push(objectProduct)
  }
  
  //luu vao db
  const orderInfo = {
    cart_id: cartId,
    userInfo: userInfo,
    products: products
  }
  
  const order = new Order(orderInfo)
  order.save()
  
  //-sau khi dat hang thanh cong thi cac sp trong gio nen bi xoa di
  await Cart.updateOne({
    _id: cartId
  },{
    products: [] //- cho ve mang rong
  })
  
  res.redirect(`/checkout/success/${order.id}`)
}


//[post] /checkout/success/:orderId
module.exports.success = async (req, res) => {

  // req.params.orderId
  res.render("client/pages/checkout/success", {
    pageTitle: "Đặt hàng thành công"
  })
}