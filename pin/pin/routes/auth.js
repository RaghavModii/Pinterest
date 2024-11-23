import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();



router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/profile', authenticateToken, (req, res) => {
    res.status(200).json({
        message: 'Welcome to your profile',
        user: req.user,
    });
});

export default router;