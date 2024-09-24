const express = require('express')
const router = express.Router()
// dung router thay cho app

const controller = require("../../controllers/admin/auth.controller")
const validate = require("../../validates/admin/auth.validate")
router.get('/login', controller.login)

router.post(
  '/login',
  validate.loginPost,
  controller.loginPost)

// router.get('/login', controller.login)

module.exports = router