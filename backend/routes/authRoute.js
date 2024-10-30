import express from 'express';
import { register,login,logout,getUser } from '../controllers/authController.js';
import {authenticateToken} from '../middleware/authenticateToken.js';

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout',  logout)
router.get('/user', authenticateToken , getUser)



export default router