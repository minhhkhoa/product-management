// START_CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form")
if (formSendData) { //-1
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

//-start  SEVER_RETURN_MESSAGE 
//-4
socket.on("SEVER_RETURN_MESSAGE", (data) => { //- nhan ve data da dc emit di tu sever

  const body = document.querySelector(".chat .inner-body")
  //- lay ra cờ de biet dc ong nao dang chat
  const myId = document.querySelector("[my-id]").getAttribute("my-id")

  const div = document.createElement("div")
  let htmlFullName = ""

  if (myId == data.userId) { //- tuc la tk gui di
    div.classList.add("inner-outgoing")
  } else {//- thang nhan phai dc ghi ten
    htmlFullName = `<div class="inner-name"> ${data.fullName}</div>`
    div.classList.add("inner-incoming")
  }

  div.innerHTML = `
    ${htmlFullName}
    <div class="inner-content"> ${data.content} </div>
  `
  body.appendChild(div)

  body.scrollTop = body.scrollHeight

})
//-end  SEVER_RETURN_MESSAGE 

//-start scroll chat to bottom
const bodyChat = document.querySelector(".chat .inner-body")
if(bodyChat){
  bodyChat.scrollTop = bodyChat.scrollHeight
}
//-end scroll chat to bottom