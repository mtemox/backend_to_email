import { Router } from 'express';
import { sendVerification, verifyEmail, sendPasswordReset, resetPassword } from './auth.controller.js';

const router = Router();

router.post('/send-verification', sendVerification);
router.post('/verify-email', verifyEmail);
router.post('/send-password-reset', sendPasswordReset);
router.post('/reset-password', resetPassword);

export default router;
