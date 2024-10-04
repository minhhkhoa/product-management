const Chat = require("../../models/chat.model")
const User = require("../../models/user.model")

//[get]: chat/index
module.exports.index = async (req, res) => {
  //- id ng dung
  const userId = res.locals.user.id //- di qua middleware da tao ra 1 bien cuc bo user roi vao do xem lai


  //- start socket.io
  //- once: chi gui 1 lan duy nhat thoi
  _io.once('connection', (socket) => {//- lang nghe sk nhan ve
    socket.on("CLIENT_SEND_MESSAGE", async (content)=>{
      //- khi nhan dc data thi luu vao db
      const chat = new Chat({
        user_id: userId,
        content: content
      })
      await chat.save()
    })
  })
  //- end socket.io

  //- lay data tu database
  const chats = await Chat.find({
    deleted: false
  })

  for(const chat of chats){
    const infoUser = await User.findOne({
      _id: chat.user_id
    }).select("fullName")

    //- them key ten user de rende ra giao dien
    chat.infoUser = infoUser
  }


  res.render("client/pages/chat/index",{
    pageTitle: "Chat",
    chats: chats
  })
}