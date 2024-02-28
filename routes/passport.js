const express = require('express')
const router = express.Router()
const {login} = require('../middlewares/passport')

const {
    getIndex,
    getSignup,
    postSignup,
    logout,
} = require('../controllers/passport')

//get index page
router.get('/', getIndex)

//get sign-up page
router.get('/sign-up', getSignup)

//post data from sign-up page
router.post('/sign-up', postSignup)

//log in
router.post('/log-in', login)

//logout
router.get('/log-out', logout)

module.exports = router