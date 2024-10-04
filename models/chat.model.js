const mongoose = require("mongoose")

//-gio hang
const chatSchema = new mongoose.Schema(
  {
    user_id: String,
    room_chat_id: String,
    content: String,
    images: Array,
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  {
    timestamps: true
  }
)

const Chat = mongoose.model('Chat', chatSchema, "chats")
//  varriable              ten bien model           ten obj trong mongoo ko bawts buoc co
module.exports = Chat