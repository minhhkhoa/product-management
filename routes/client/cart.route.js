const express = require('express')
const router = express.Router()
// dung router thay cho app

const controller = require("../../controllers/client/cart.controller")

router.get('/', controller.index)

router.post('/add/:productId', controller.addPost)

router.get('/delete/:productId', controller.delete)

module.exports = router