import express from 'express';
import {chat} from '../controllers/chatController.js';
import {authenticateToken} from '../middleware/authenticateToken.js';

const router = express.Router();

router.post('/chat',authenticateToken, chat);

export default router