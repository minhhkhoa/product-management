// START_CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form")
if (formSendData) {
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault()
    const content = e.target.elements.content.value //- ô input đặt tên là content
    if (content) {//- co data thi gui len sever
      // console.log(content)
      socket.emit("CLIENT_SEND_MESSAGE", content);//- socket dc nhung vao roi o cho layoutsDefault client
      e.target.elements.content.value = ""
    }
  })
}
// END_CLIENT_SEND_MESSAGE