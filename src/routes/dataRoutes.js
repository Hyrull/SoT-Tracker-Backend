const router = Router()
import { Router } from 'express'
import { dataUpdate } from '../controllers/dataUpdate.js'
import { emblemListGet } from '../controllers/emblemListGet.js'
import { overviewDataGet } from '../controllers/overviewDataGet.js'
import { ledgerDataGet } from '../controllers/ledgerDataGet.js'
import { getPinned, addPinned, removePinned } from '../controllers/data/pinnedController.js'
import { scoreGet } from '../controllers/scoreGet.js'
import auth from '../middlewares/auth.js'

router.get('/emblems', auth, emblemListGet)
router.get('/overview', auth, overviewDataGet)
router.get('/ledgers', auth, ledgerDataGet)
router.patch('/update', auth, dataUpdate)
router.get('/pinned', auth, getPinned)
router.post('/pinned', auth, addPinned)
router.delete('/pinned', auth, removePinned)
router.get('/score', auth, scoreGet )

export default router