const express = require('express')
const path = require('path')
const session = require('express-session')
const mongoose = require('mongoose')

const passportRouter = require('./routes/passport')
const {passport} = require('./middlewares/passport')

//set up databse
const db_url = 'mongodb://0.0.0.0:27017/test_auth'
mongoose.connect(db_url)
const db = mongoose.connection
db.on('error', console.error.bind(console, "mongoose connection error"))

const app = express()

//set views and view engine
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

//middlewares
app.use(session({secret: "cats", resave: false, saveUninitialized: true}))
app.use(passport.session())
app.use((req, res, next) => {
    res.locals.currentUser = req.user
    next()
})
app.use(express.urlencoded({extended: false}))

//routes
app.use('/', passportRouter)

//listen to request on port 3000
app.listen(3000, () => {console.log('listening on port 3000')})
