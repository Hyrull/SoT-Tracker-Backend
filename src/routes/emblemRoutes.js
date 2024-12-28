const express = require('express')
const router = express.Router()
const emblemUpdateCtrl = require('../controllers/emblemUpdate')

router.get('/update', emblemUpdateCtrl.emblemUpdate)

module.exports = router