const express = require('express')
var methodOverride = require('method-override')
var bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
var flash = require('express-flash')
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

// App Locals Variables( bieens nay dung dc o dau cx dc ca file pug)
const systemConfig = require("./config/systems")
app.locals.prefixAdmin = systemConfig.prefixAdmin

// app.use(express.static(`public`))
app.use(express.static(`${__dirname}/public`))

//Routes
routeAdmin(app)
route(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})