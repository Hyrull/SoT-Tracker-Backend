const express = require('express')
const router = express.Router()
const dataUpdateCtrl = require('../controllers/dataUpdate')
const emblemListCtrl = require('../controllers/emblemListGet')
const overviewDataCtrl = require('../controllers/overviewDataGet')
const ledgerDataCtrl = require('../controllers/ledgerDataGet')
const auth = require('../middlewares/auth')

router.get('/emblems', auth, emblemListCtrl.emblemListGet)
router.get('/overview', auth, overviewDataCtrl.overviewDataGet)
router.get('/ledgers', auth, ledgerDataCtrl.ledgerDataGet)
router.patch('/update', auth, dataUpdateCtrl.dataUpdate)

module.exports = router