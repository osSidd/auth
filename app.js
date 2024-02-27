const express = require('express')
const path = require('path')
const session = require('express-session')
const passport = require('passport')
const mongoose = require('mongoose')
const LocalStrategy = require('passport-local').Strategy
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const db_url = 'mongodb://0.0.0.0:27017/test_auth'
mongoose.connect(db_url)
const db = mongoose.connection
db.on('error', console.error.bind(console, "mongoose connection error"))

const User = mongoose.model('User', new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true}
}))

const app = express()
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(session({secret: "cats", resave: false, saveUninitialized: true}))
app.use(passport.session())
app.use(express.urlencoded({extended: false}))

passport.use(new LocalStrategy(async (username, password, done) => {
    try{
        const user = await User.findOne({username})
        
        if(!user) return done(null, false, {message: "Incorrect username"})

        const match = await bcrypt.compare(password, user.password)

        if(!match) return done(null, false, {message: "Incorrect password"})
        
        return done(null, user)
    }catch(err){
        return done(err)
    }
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try{
        const user = await User.findById(id)
        done(null, user)
    }catch(err){
        done(err)
    }
})

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    next()
})

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/sign-up', (req, res) => {
    res.render('signup')
})

app.post("/sign-up", async (req, res, next) => {
    try {
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            // if err, do something
            if(err) return next(err)
            // otherwise, store hashedPassword in DB
            const user = new User({
                username: req.body.username,
                password: hashedPassword
              });
            const result = await user.save();
          });
        res.redirect("/");
    } catch(err) {
      return next(err);
    };
  });

app.post("/log-in",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/"
    })
);

app.get("/log-out", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});

app.listen(3000, () => {console.log('listening on port 3000')})
