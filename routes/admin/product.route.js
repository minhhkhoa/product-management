const express = require('express')
const router = express.Router()
const multer = require('multer')
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

const upload = multer()

// dung router thay cho app

const controller = require("../../controllers/admin/product.controller")
const validate = require("../../validates/admin/product.validate")

router.get('/', controller.index)

router.patch('/change-status/:status/:id', controller.changeStatus)
//                        ": status, :id" : là để nhận dữ liệu động

router.patch('/change-multi', controller.changeMulti)

//
router.delete('/delete/:id', controller.deleteItem) //id động
//Điều này cho phép server xóa một mục cụ thể dựa 
//trên giá trị id trong URL, và không cần phải 
//định nghĩa nhiều route riêng cho mỗi giá trị id khác nhau.

//
router.get('/create', controller.create)

router.post(
  '/create',
  upload.single('thumbnail'),
  //uploadfile to cloud
  //https://cloudinary.com/blog/node_js_file_upload_to_a_local_server_or_to_the_cloud
  uploadCloud.upload,
  //-Kiem tra validate
  validate.createPost,
  controller.createPost
)

router.get('/edit/:id', controller.edit)

router.patch(
  '/edit/:id',
  upload.single('thumbnail'),
  uploadCloud.upload,
  validate.createPost,
  controller.editSuccess)

router.get('/detail/:id', controller.detail)


module.exports = router