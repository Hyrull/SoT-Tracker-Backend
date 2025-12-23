import { Router } from 'express'
const router =  Router()
import auth from '../middlewares/auth.js'
import { signup, login } from '../controllers/user.js'
import { userRatUpdate } from '../controllers/userRatUpdate.js'
import { deleteUser } from '../controllers/deleteUser.js'

router.post('/signup', signup)
router.post('/login', login)
router.patch('/ratUpdate', auth, userRatUpdate)
router.delete('/delete', auth, deleteUser)


export default router