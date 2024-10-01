//-start cap nhat lai so lg sp ben gio hang
const inputQuantity = document.querySelectorAll("input[name='quantity']")
if (inputQuantity.length > 0) {
  inputQuantity.forEach(input => {
    input.addEventListener("change", (e) => {
      const productId = input.getAttribute("product-id")
      const quantity = e.target.value

      //-co the lam cach nay hoac lam cai form
      //-chuyen huong trang
      window.location.href = `/cart/update/${productId}/${quantity}` //-them route
    })
  })
}


//-end cap nhat lai so lg sp ben gio hang