const homeRouters = require("./home.route")
const productRouters = require("./product.route")

//- Nhungs file home
module.exports = (app) => {
  app.use('/', homeRouters)

//- Nhungs file products
  app.use('/products', productRouters)
  
}