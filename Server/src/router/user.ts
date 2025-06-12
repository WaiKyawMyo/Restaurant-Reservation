import { Router } from "express";
import { changePassword, getUserProfile, userLogin, userLogout, userProfileUpdate, userRegister } from "../controllers/user";
import authMiddleware from "../middleware/authMiddleware";
import { requestOTP, VerifyOTP } from "../controllers/OTP";

const router = Router()

router.post("/register",userRegister)
router.post('/login',userLogin)
router.post("/logout",userLogout)
router.route('/profile').get(authMiddleware,getUserProfile).put(authMiddleware,userProfileUpdate)
router.put('/changepassword',authMiddleware,changePassword)


export default router