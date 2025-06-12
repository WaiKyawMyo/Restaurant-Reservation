// src/controllers/otpController.ts
import { Request, Response } from 'express';
import { ApiResponse, RequestOtpBody, VerifyOtpBody } from '../Types/OTP';
import { generateOTP } from '../Utils/otpGenerate';
import { clearOTP, getStoredOTP, OtpData, storeOTP } from '../Utils/otpStore';
import { sendEmail } from '../Servic/email';
import { User } from '../models/user';
import { asyncHandler } from '../Utils/asyncHandler';


export const requestOTP = async (
  req: Request<{}, ApiResponse, RequestOtpBody>,
  res: Response<ApiResponse>
): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: 'Email address is required.' });
    return;
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    res.status(400).json({ message: 'Invalid email format.' });
    return;
  }
  const Existing = await User.findOne({email})
  if(!Existing){
    res.status(404).json({message:"This email is not registered."})
    
  }
  const otp = generateOTP();
  storeOTP(email, otp);

  const emailSent = await sendEmail(email, otp);

  if (emailSent) {
    res.status(200).json({ message: 'OTP sent successfully to your email.' });
  } else {
    res.status(500).json({ message: 'Failed to send OTP. Please try again later.' });
  }
};

export const VerifyOTP = async (
  req: Request<{}, ApiResponse, VerifyOtpBody>,
  res: Response<ApiResponse>
): Promise<void> => {
  const { email, userOtp } = req.body;

  if (!email || !userOtp) {
    res.status(400).json({ message: 'Email and OTP are required.' });
    return;
  }

  const storedOtpData: OtpData | undefined = getStoredOTP(email);

  if (!storedOtpData) {
    res.status(400).json({
      message: 'OTP not found, may have expired, or email is incorrect. Please request a new one.',
    });
    return;
  }

  const { otp: expectedOtp, expiresAt } = storedOtpData;

  if (Date.now() > expiresAt) {
    clearOTP(email);
    res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    return;
  }

  if (userOtp === expectedOtp) {
    clearOTP(email);
    res.status(200).json({ message: 'OTP verified successfully.' });
  } else {
    res.status(400).json({ message: 'Invalid OTP.' });
  }
};

export const OTPChangePW = asyncHandler(async(req:Request,res:Response)=>{
  const {password,comfirmPassword,email}= req.body
  if(!password || !comfirmPassword){
    res.status(400)
    throw new Error('Ender your password')
  }
  if(!email){
    res.status(500)
    throw new Error('Something wrong!')
  }
  if(password!==comfirmPassword){
    res.status(400)
    throw new Error('Passwords do not match.')
  }
  const user =await User.findOne({email})
  if(!user){
    res.status(404)
    throw new Error('User not found')
  }
  user.password = comfirmPassword
  await user.save()
  res.status(200).json({message:"Success Password Change"})
})