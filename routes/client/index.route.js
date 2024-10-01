const categoryMiddleware = require("../../middlewares/client/category.middleware")
const cartMiddleware = require("../../middlewares/client/cart.middleware")
const homeRouters = require("./home.route")
const productRouters = require("./product.route")
const searchRouters = require("./search.route")
const cartRouters = require("./cart.route")
const checkRouters = require("./checkout.route")

//- Nhungs file home
module.exports = (app) => {
  //them nhu nay o duoi do phai them tung cai
  app.use(categoryMiddleware.category)
  app.use(cartMiddleware.cartId)

  app.use(
    '/', 
    homeRouters)

//- Nhungs file products
  app.use(
    '/products',
    productRouters)

  app.use(
    '/search',
    searchRouters)

  app.use(
    '/cart',
    cartRouters)

  app.use(
    '/checkout',
    checkRouters)
  
}