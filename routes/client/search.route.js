const express = require('express')
const router = express.Router()
// dung router thay cho app

const controller = require("../../controllers/client/search.controller")

router.get('/', controller.index)

module.exports = router