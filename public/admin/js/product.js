//start change-status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]")
if (buttonChangeStatus.length > 0) {

  const formChangeStatus = document.querySelector("#form-change-status")
  const path = formChangeStatus.getAttribute("data-path")

  buttonChangeStatus.forEach(btn => {
    btn.addEventListener("click", () => {
      const statusCurrent = btn.getAttribute("data-status")
      const id = btn.getAttribute("data-id")

      let statusChanged = statusCurrent == "active" ? "inactive" : "active"

      const action = path + `/${statusChanged}/${id}?_method=PATCH`

      formChangeStatus.action = action

      formChangeStatus.submit()
    })
  })
}
//end change-status

// start delete Item
const buttonDelete = document.querySelectorAll("[button-delete]")
if (buttonDelete.length > 0) {
  const formDeleteItem = document.querySelector("#form-delete-item")
  const path = formDeleteItem.getAttribute("data-path")
  buttonDelete.forEach(btn => {
    btn.addEventListener("click" , () => {
      //in ra thong bao xac nhan xoa ko
      const isConfirm = confirm("Bạn có chắc muốn xóa sản phẩm này?")

      if(isConfirm) {
        //neu dong y moi gui id sp muon xoa
        const id = btn.getAttribute("data-id")

        const action = `${path}/${id}?_method=DELETE`
        // console.log(action)
        formDeleteItem.action = action
        formDeleteItem.submit()
      }
    })
  })
}

// end delete Item