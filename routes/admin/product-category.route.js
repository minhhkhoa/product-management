const express = require('express')
const multer = require('multer')
const router = express.Router()

const upload = multer()

const validate = require("../../validates/admin/product-category.validate")

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

const controller = require("../../controllers/admin/product-category.controller.js")

router.get('/', controller.index)

router.get('/create', controller.create)

router.post(
  '/create',
  upload.single('thumbnail'),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
)

router.get('/edit/:id', controller.edit)

router.patch(
  '/edit/:id',
  upload.single('thumbnail'),
  uploadCloud.upload,
  validate.createPost,
  controller.editPatch
)


module.exports = router