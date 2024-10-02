const express = require('express')
const path = require('path')
var methodOverride = require('method-override')
var bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
var flash = require('express-flash')
//-convert time in js
var moment = require('moment')
require("dotenv").config()

const dataBase = require("./config/database")
dataBase.connect()

const routeAdmin = require("./routes/admin/index.route")
const route = require("./routes/client/index.route")

const app = express()
const port = process.env.PORT

app.use(methodOverride('_method'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))


//- kết nối vs pug
// app.set('views', `./views`)
app.set('views', `${__dirname}/views`)
app.set('view engine', 'pug')
// end conect pug

//start express-flash
app.use(cookieParser('khoaHii.'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
//end express-flash

//start tinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
//end tinyMCE

// App Locals Variables( bieens nay dung dc o dau cx dc ca file pug)
const systemConfig = require("./config/systems")
app.locals.prefixAdmin = systemConfig.prefixAdmin
app.locals.moment = moment

// app.use(express.static(`public`))
app.use(express.static(`${__dirname}/public`))

//Routes
routeAdmin(app)
route(app)

//-them route 404
app.get("*", (req, res) => { //- * la cac th con lai
  res.render("client/pages/errors/404",{
    pageTitle: "404 Not Found"
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})