module.exports.priceNewProducts = (products) => {
  const newProduct = products.map(item => {
    item.priceNew = (item.price - item.price * item.discountPercentage / 100).toFixed(0)
    return item
  })

  return newProduct
}

//-tinh gia cho 1 sp
module.exports.priceNewProduct = (product) => {
  const priceNew = parseInt((product.price - product.price * product.discountPercentage / 100).toFixed(0))

  return priceNew
}