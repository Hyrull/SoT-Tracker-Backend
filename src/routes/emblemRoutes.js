const express = require('express')
const router = express.Router()
const emblemUpdateCtrl = require('../controllers/emblemUpdate')
const auth = require('../middlewares/auth')

router.patch('/update', auth, emblemUpdateCtrl.emblemUpdate)

module.exports = router