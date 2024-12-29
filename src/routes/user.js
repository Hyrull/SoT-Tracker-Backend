const express = require('express')
const router =  express.Router()
const auth = require('../middlewares/auth')
const userCtrl = require('../controllers/user')
const userRatCtrl = require('../controllers/userRatUpdate')

router.post('/signup', userCtrl.signup)
router.post('/login', userCtrl.login)
router.patch('/ratUpdate', auth, userRatCtrl.userRatUpdate)


module.exports = router