const Role = require("../../models/role.model")
const systemConfig = require("../../config/systems")
const { json } = require("body-parser")
//[get]: /admin/roles
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  }

  const records = await Role.find(find)

  res.render("admin/pages/roles/index", {
    pageTitle: 'Nhóm quyền',
    records: records
  })
}

//[get]: /admin/roles/create
module.exports.create = async (req, res) => {

  res.render("admin/pages/roles/create", {
    pageTitle: 'Tạo mới nhóm quyền',
  })
}

//[post]: /admin/roles/createPost
module.exports.createPost = async (req, res) => {
  // console.log(req.body)

  const records = new Role(req.body)

  await records.save()

  res.redirect(`${systemConfig.prefixAdmin}/roles`)
}

//[get]: /admin/roles/edit/:id
module.exports.edit = async (req, res) => {

  try {
    const id = req.params.id

    let find = {
      _id: id,
      deleted: false
    }

    const data = await Role.findOne(find)

    res.render("admin/pages/roles/edit", {
      pageTitle: 'Sửa nhóm quyền',
      data: data
    })

  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`)
  }

}

//[patch]: /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {

  const id = req.params.id

  await Role.updateOne({_id: id},req.body)

  req.flash("success","Cập nhật nhóm quyền thành công")

  res.redirect("back")

}

//[get]: /admin/roles/permissions
module.exports.permissions = async (req, res) => {
  let find = {
    deleted: false
  }

  const records = await Role.find(find)

  res.render("admin/pages/roles/permissions", {
    pageTitle: 'Phân quyền',
    records: records
  })
}

//[patch]: /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
  //data gui qua form ==> BE lay tu body
  const permissions = JSON.parse(req.body.permissions)

  for (const item of permissions) {
    await Role.updateOne({ _id: item.id }, { permissions: item.permissions })
  }
  
  req.flash("success","Cập nhật phân quyền thành công")
  res.redirect("back")
}