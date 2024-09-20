const express = require('express')
const router = express.Router()
// dung router thay cho app

const controller = require("../../controllers/admin/role.controller.js")

router.get('/', controller.index)

router.get('/create', controller.create)

router.post('/create', controller.createPost)

module.exports = router