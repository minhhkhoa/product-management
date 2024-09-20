//-start permissions
const tablePermissions = document.querySelector("[table-permissions]")
if (tablePermissions) {
  const buttonSubmit = document.querySelector("[button-submit]")
  buttonSubmit.addEventListener("click", (e) => {
    //arr save data
    let permissions = []
    //get rows
    const rows = tablePermissions.querySelectorAll("[data-name]")
    rows.forEach((row) => {
      //get name rows && inputs
      const name = row.getAttribute("data-name")
      const inputs = row.querySelectorAll("input")
      if (name == "id") { // if name row is "id"
        inputs.forEach((input) => {
          //get id
          const id = input.value
          permissions.push({
            id: id,
            permissions: []
          })
        })
      } else {
        inputs.forEach((input, index) => { //lap qua tung input trong row != id
          //index cua input sẽ giúp ta tìm được là đối tượng nào(cột nào)
          const checked = input.checked
          if (checked) { // neu dc pic thi them name
            permissions[index].permissions.push(name) //name cua row
          }
        })
      }
    })
    //muon gui mang data qua BE ta dung form
    if (permissions.length > 0) {
      const formChangePermissions = document.querySelector("#form-change-permissions")
      const inputPermissions = formChangePermissions.querySelector("input[name='permissions']")

      inputPermissions.value = JSON.stringify(permissions)
      formChangePermissions.submit()
    }
  })
}
//-end permissions

//-start permissions data default
const dataRecords = document.querySelector("[data-recors]")
if (dataRecords) {
  const records = JSON.parse(dataRecords.getAttribute("data-recors"))
  const tablePermissions = document.querySelector("[table-permissions]")

  records.forEach((record, index) => {
    const permissions = record.permissions

    permissions.forEach(permission => {
      const row = tablePermissions.querySelector(`[data-name="${permission}"]`)
      const input = row.querySelectorAll("input")[index]
      input.checked = true

    })
  })
}
//-end permissions data default