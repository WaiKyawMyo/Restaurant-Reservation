import { request, Request, response, Response } from "express";
import { User } from "../models/user";
import { generateToken } from "../Utils/generateToken";
import { asyncHandler } from "../Utils/asyncHandler";
import { AuthRequest } from "../middleware/authMiddleware";


export const userRegister = asyncHandler(async(req:Request ,res:Response)=>{
    
        const {username,email,password,phone_no}= req.body
        const existinguser = await User.findOne({email})

        if(existinguser){
            res.status(400)
            throw new Error("Email is Existing")
        }
        const user = await User.create({
            username,
            email,
            password,
            phone_no,
            role:"user"
        })
        if(!user){
           res.status(500)
           throw new Error("Register is something wrong")
        }
        res.status(201).json({
                _id:user._id,
                username: user.username,
                eamil:user.email,
                phone_no:user.phone_no,
                role:user.role,
                message:"Success! Your account has been created."
         })
        
})

export const userLogin =asyncHandler(async(req:Request ,res:Response)=>{
    const {email,password}= req.body
    const existing = await User.findOne({email})
    if(existing && (await existing.matchPassword(password))){
       generateToken(res,existing._id)
       res.status(200).json({
        _id:existing._id,
        username:existing.username,
        email:existing.email,
        role:existing.role,
        phone_no:existing.phone_no,
        message:"Login successful!"
       })
    }else{
        res.status(404)
        throw new Error('Invalid email or password.')
    }
})

export const userLogout=asyncHandler(async(req:Request ,res:Response)=>{
    res.cookie("token","",{
        httpOnly:true,
        expires: new Date(0)
    })
    res.status(200).json({message:"Logout successful."})
})

export const getUserProfile =asyncHandler(async(req:AuthRequest,res:Response)=>{
    const user ={
        _id:req.user?._id,
        username:req.user?.username,
        email:req.user?.email,
        role:req.user?.role,
        phone_no:req.user?.phone_no
    }
    res.status(200).json(user)
})

export const userProfileUpdate = asyncHandler(async(req:AuthRequest,res:Response)=>{
  const user = await User.findById(req.user?._id)
  if(!user){
    res.status(404)
    throw new Error('User not found')
  }
  user.username= req.body.username || user.username
  user.email= req.body.email || user.email
  user.phone_no= req.body.phone_no || user.phone_no

  const updateUser = await user.save()
  const selectUser = {
    _id:updateUser._id,
    username: updateUser.username,
    email:updateUser.email,
    
    role:updateUser.role
  }
  res.status(200).json(selectUser)
})

export const changePassword = asyncHandler(async(req:AuthRequest,res:Response)=>{
    const user = await User.findById(req.user?._id)
    const {oldpassword,newpassword} = req.body
    if(!user){
        res.status(401)
        throw new Error("user is not authorized")
    }
    
    if(!await user.matchPassword(oldpassword)){
        res.status(401)
        throw new Error("Passwords do not match. Please try again.")
    }
    user.password = newpassword
    await user.save()
    res.status(200).json({message:"Password Change Success"})
})





;