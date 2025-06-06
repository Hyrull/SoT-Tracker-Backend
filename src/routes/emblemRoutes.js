const express = require('express')
const router = express.Router()
const dataUpdateCtrl = require('../controllers/dataUpdate')
const emblemListCtrl = require('../controllers/emblemListGet')
const auth = require('../middlewares/auth')

router.get('/fetch', auth, emblemListCtrl.emblemListGet)
router.patch('/update', auth, dataUpdateCtrl.dataUpdate)

module.exports = router