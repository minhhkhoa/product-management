//- phần xử lý button-status
const buttonStatus = document.querySelectorAll("[button-status]") //attribute tự định nghĩa thì thêm []
if (buttonStatus.length > 0) {
  let url = new URL(window.location.href);

  buttonStatus.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const status = btn.getAttribute("button-status")

      if (status) {
        //đây là cú pháp set lại param trên url cần dòng 4 đối tương URl
        url.searchParams.set("status", status)
        //                  para(url)   value
      } else {
        //vì còn th chuỗi rỗng (ko là active or inactive)
        url.searchParams.delete("status")
        //                   xoa para ==> /admin/products
      }

      //sau khi có url ==> chuyển sang trang đó
      window.location.href = url.href

    })
  })
}
//-end button-status

// form search
const formSearch = document.querySelector("#form-search")
if (formSearch) {
  let url = new URL(window.location.href);
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault()
    const keyword = e.target.elements.keyword.value
    // console.log(e.target.elements.keyword.value)
    if (keyword) {
      url.searchParams.set("keyword", keyword)
    } else {
      url.searchParams.delete("keyword")
    }
    window.location.href = url.href
  })
}
// end form search

//start pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]")
if (buttonsPagination) {
  let url = new URL(window.location.href);
  buttonsPagination.forEach(btn => {
    btn.addEventListener("click", () => {
      const page = btn.getAttribute("button-pagination")
      if (page) {
        url.searchParams.set("page", page)
      } else {
        url.searchParams.delete("page")
      }
      window.location.href = url.href
    })
  })

}
//end pagination

//start checkbox multi
const checkboxMulti = document.querySelector("[checkbox-multi]")
if (checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']")
  const inputsId = checkboxMulti.querySelectorAll("input[name='id']")

  //logic inputCheckall
  inputCheckAll.addEventListener("click", () => {
    if (inputCheckAll.checked) {
      inputsId.forEach(boxcheck => {
        boxcheck.checked = true
      })
    } else {
      inputsId.forEach(boxcheck => {
        boxcheck.checked = false
      })
    }
  })

  //logic inputsId
  inputsId.forEach(boxcheck => {
    boxcheck.addEventListener("click", () => {
      const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length
      //- (:checked) : là tìm đến các ô input đã được check

      if (countChecked == inputsId.length) {
        inputCheckAll.checked = true
      } else {
        inputCheckAll.checked = false
      }

    })
  })

}
//end checkbox multi


//start form change multi
const formChangeMulti = document.querySelector("[form-change-multi]")
if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    //ngăn không cho trình duyệt thực hiện hành vi mặc định là gửi biểu mẫu và tải lại trang.
    e.preventDefault()

    const checkboxMulti = document.querySelector("[checkbox-multi]")
    const inputChecked = checkboxMulti.querySelectorAll("input[name='id']:checked")


    //Lấy ra kiểu option
    const typeChange = e.target.elements.type.value

    if (typeChange == "delete-all") {
      const isConfirm = confirm("Bạn có muốn xóa những sản phẩm này?")

      if (!isConfirm) {
        return
      }

    }

    if (inputChecked.length > 0) {
      let ids = []
      const inputIds = formChangeMulti.querySelector("input[name='ids']")
      inputChecked.forEach(input => {
        const id = input.value

        if (typeChange == "change-position") {
          //Gửi kèm vị trí nữa
          const position = input.closest("tr")
            .querySelector("input[name='position']").value
          // console.log(position)

          ids.push(`${id}-${position}`)


        } else {
          ids.push(id)
        }

      })
      //convert to text because value input don't save array
      inputIds.value = ids.join(", ")
      // console.log(inputIds.value)
      formChangeMulti.submit()
    } else {
      alert("Vui lòng chọn ít nhất 1 bản ghi")
    }
  })
}
//end form change multi

//start show-alert
const showAlert = document.querySelector("[show-alert]")
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"))
  const closeAlert = document.querySelector("[close-alert]")
  setTimeout(() => {
    showAlert.classList.add("alert-hidden")
  }, time)

  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden")
  })
}
//end show-alert

//-Start Upload preview image
const uploadImage = document.querySelector("[upload-image]")
if (uploadImage) {
  const uploadImageInput = document.querySelector("[upload-image-input]")
  const uploadImagePreview = document.querySelector("[upload-image-preview]")
  uploadImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0]
    // console.log(file)
    if(file) {
      uploadImagePreview.src = URL.createObjectURL(file)
    }
  })
}
//-End Upload preview image