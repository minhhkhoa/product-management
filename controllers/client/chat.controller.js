const Chat = require("../../models/chat.model")
const User = require("../../models/user.model")

const uploadToCloudinary = require("../../helpers/uploadToCloudinary")

//[get]: chat/index
module.exports.index = async (req, res) => {
  //- id ng dung
  const userId = res.locals.user.id //- di qua middleware da tao ra 1 bien cuc bo user roi vao do xem lai
  const fullName = res.locals.user.fullName

  //- start socket.io
  //- once: chi gui 1 lan duy nhat thoi
  _io.once('connection', (socket) => {//- lang nghe sk nhan ve
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {//-2
      let images = []
      for(const imageBuffer of data.images){
        const link = await uploadToCloudinary(imageBuffer)
        images.push(link)
      }
      
      //- khi nhan dc data thi luu vao db
      const chat = new Chat({
        user_id: userId,
        content: data.content,
        images: images
      })
      await chat.save()

      //- Tra data ve cho client bao gom ten va nd tin nhan. Dung tu tk To nhat la _io
      //-3
      _io.emit("SEVER_RETURN_MESSAGE", {//- gui di 1 obj
        userId: userId,
        fullName: fullName,
        content: data.content,
        images: images
      })
    })

    //- start typing
    socket.on("CLIENT_SEND_TYPING", async (type) => {
      socket.broadcast.emit("SEVER_RETURN_TYPING", {
        userId: userId,
        fullName: fullName,
        type: type
      })
    })
    //- end typing
  })
  //- end socket.io

  //- lay data tu database
  const chats = await Chat.find({
    deleted: false
  })

  for (const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.user_id
    }).select("fullName")

    //- them key ten user de rende ra giao dien
    chat.infoUser = infoUser
  }


  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
    chats: chats
  })
}