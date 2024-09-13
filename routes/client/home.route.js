const express = require('express')
const router = express.Router()
// dung router thay cho app

const controller = require("../../controllers/client/home.controller")

router.get('/', controller.index)

module.exports = router