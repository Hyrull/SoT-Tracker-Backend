const express = require('express')
const router = express.Router()
const emblemUpdateCtrl = require('../controllers/dataUpdate')
const emblemListCtrl = require('../controllers/emblemListGet')
const auth = require('../middlewares/auth')

router.get('/fetch', auth, emblemListCtrl.emblemListGet)
router.patch('/update', auth, emblemUpdateCtrl.dataUpdate)

module.exports = router