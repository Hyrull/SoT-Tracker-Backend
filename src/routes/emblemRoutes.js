const express = require('express')
const router = express.Router()
const emblemUpdateCtrl = require('../controllers/emblemUpdate')
const emblemListCtrl = require('../controllers/emblemListGet')
const auth = require('../middlewares/auth')

router.get('/fetch', auth, emblemListCtrl.emblemListGet)
router.patch('/update', auth, emblemUpdateCtrl.emblemUpdate)

module.exports = router