const express = require('express')
const router = express.Router()
const dataUpdateCtrl = require('../controllers/dataUpdate')
const emblemListCtrl = require('../controllers/emblemListGet')
const overviewDataCtrl = require('../controllers/overviewDataGet')
const ledgerDataCtrl = require('../controllers/ledgerDataGet')
const pinnedCtrl = require('../controllers/data/pinnedController')
const auth = require('../middlewares/auth')

router.get('/emblems', auth, emblemListCtrl.emblemListGet)
router.get('/overview', auth, overviewDataCtrl.overviewDataGet)
router.get('/ledgers', auth, ledgerDataCtrl.ledgerDataGet)
router.patch('/update', auth, dataUpdateCtrl.dataUpdate)
router.get('/pinned', auth, pinnedCtrl.getPinned)
router.post('/pinned', auth, pinnedCtrl.addPinned)
router.delete('/pinned', auth, pinnedCtrl.removePinned)

module.exports = router