import { Router } from 'express';
import { OTPChangePW, requestOTP, VerifyOTP } from '../controllers/OTP';


const router = Router();

router.post('/request-otp-email', requestOTP);
router.post('/verify-otp-email', VerifyOTP);
router.post('/change-with-OTP',OTPChangePW)
export default router;