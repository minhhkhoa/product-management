//[get]: chat/index
module.exports.index = async (req, res) => {
  //- start socket.io
  _io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
  })
  //- end socket.io

  res.render("client/pages/chat/index",{
    pageTitle: "Chat"
  })
}