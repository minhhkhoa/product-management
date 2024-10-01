const express = require('express')
const router = express.Router()
// dung router thay cho app

const controller = require("../../controllers/client/checkout.controller")

router.get('/', controller.index)

router.post('/order', controller.order)

router.get('/success/:orderId', controller.success)

module.exports = router