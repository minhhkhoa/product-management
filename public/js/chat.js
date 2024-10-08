import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

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
      socket.emit("CLIENT_SEND_TYPING", "hidden") //- tat typing sau khi an gui
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

  const boxTyping = document.querySelector(".chat .inner-list-typing")

  const div = document.createElement("div")
  let htmlFullName = ""

  if (myId == data.userId) { //- tuc la tk gui di
    div.classList.add("inner-outgoing")
  } else {//- thang nhan phai dc ghi ten
    htmlFullName = `<div class="inner-name"> ${data.fullName}</div>`
    div.classList.add("inner-incoming") //- them ten class
  }

  div.innerHTML = `
    ${htmlFullName}
    <div class="inner-content"> ${data.content} </div>
  `
  body.insertBefore(div, boxTyping)//- luon insert div trc cai boxTyping

  body.scrollTop = body.scrollHeight

})
//-end  SEVER_RETURN_MESSAGE 

//-start scroll chat to bottom
const bodyChat = document.querySelector(".chat .inner-body")
if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight
}
//-end scroll chat to bottom

//- start show Icon chat
//- start show popup
const buttonIcon = document.querySelector('.button-icon')
const tooltip = document.querySelector('.tooltip')
Popper.createPopper(buttonIcon, tooltip)

buttonIcon.onclick = () => {
  tooltip.classList.toggle('shown')
}
//- end show popup

//-Show typing
var timeOut
const showTyping = () => {
  socket.emit("CLIENT_SEND_TYPING", "show")

  clearTimeout(timeOut) //- moi lan go se clearTimeout
  timeOut = setTimeout(() => {
    socket.emit("CLIENT_SEND_TYPING", "hidden")
  }, 4000)
}
//-end Show typing

//-start insert icon to input

const emojiPicker = document.querySelector("emoji-picker")
if (emojiPicker) {
  const inputChat = document.querySelector(".chat .inner-form input[name='content']")
  emojiPicker.addEventListener("emoji-click", (event) => {
    const icon = event.detail.unicode
    inputChat.value = inputChat.value + icon

    const end = inputChat.value.length
    inputChat.setSelectionRange(end, end) //- con tro chuot luon o cuoi vanban
    inputChat.focus()

    showTyping()

  })

  // - start input keyup
  inputChat.addEventListener("keyup", () => {
    showTyping()
  })
  // - end input keyup
}
//-end insert icon to input
//- end show Icon chat

// - start SEVER_RETURN_TYPING
//-lay ra khoi typing
const elementListTyping = document.querySelector(".chat .inner-list-typing")
if (elementListTyping) {
  socket.on("SEVER_RETURN_TYPING", (data) => {
    if (data.type == "show") {
      const bodyChat = document.querySelector(".chat .inner-body")
      const existTyping = elementListTyping.querySelector(`[user-id="${data.userId}"]`) //- muc dich la tranh typing nhieu lan xoa di thu check xem
      if (!existTyping) {
        const boxTyping = document.createElement("div")
        boxTyping.classList.add("box-typing")
        boxTyping.setAttribute("user-id", data.userId) //- theem cowf ddeer check

        boxTyping.innerHTML = `
          <div class="inner-name">${data.fullName}</div>
          <div class="inner-dots">
              <span></span>
              <span></span>
              <span></span>
          </div>
        `

        elementListTyping.appendChild(boxTyping)
        bodyChat.scrollTop = bodyChat.scrollHeight

      }
    } else {
      const boxTypingRemove = elementListTyping.querySelector(`[user-id="${data.userId}"]`)
      if (boxTypingRemove) {
        elementListTyping.removeChild(boxTypingRemove)
      }
    }
  })
}
// - end SEVER_RETURN_TYPING


