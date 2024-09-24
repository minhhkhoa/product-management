const categoryMiddleware = require("../../middlewares/client/category.middleware")
const homeRouters = require("./home.route")
const productRouters = require("./product.route")

//- Nhungs file home
module.exports = (app) => {
  app.use(categoryMiddleware.category)

  app.use(
    '/', 
    homeRouters)

//- Nhungs file products
  app.use(
    '/products',
    productRouters)
  
}