const User = require('../models/user')
const bcrypt = require('bcryptjs')

const getIndex = (req, res) => {
    res.render('index')
}

const getSignup =  (req, res) => {
    res.render('signup')
}

const postSignup = async (req, res, next) => {
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
}

const logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
}

module.exports = {
    getIndex,
    getSignup,
    postSignup,
    logout,
}