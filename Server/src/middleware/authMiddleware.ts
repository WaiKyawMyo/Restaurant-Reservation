import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../Utils/asyncHandler";
import jwt, { JwtPayload } from "jsonwebtoken"
import { User } from "../models/user";
import { Types } from "mongoose";

export interface AuthRequest extends Request{
    user?:{
        username:string,
        email:string,
        _id:string| Types.ObjectId,
        role:string,
        phone_no:string
    }
    
}
interface User{
     username:string,
        email:string,
        _id:string| Types.ObjectId,
        role:string,
        phone_no:string
}

const authMiddleware = asyncHandler(async(req:AuthRequest,res:Response,next:NextFunction)=>{
    let token 
    token = req.cookies.token
    if(!token){
        res.status(401)
        throw new Error("user is not authorized")
     }
       try{
            const decoded =  jwt.verify(token,process.env.JWT_SECRET!)as JwtPayload
            if(!decoded){
                 res.status(401)
                throw new Error("user is not authorized")
            }
            req.user = await User.findById(decoded.userId).select("-password")as User
            next()
       } catch(error){
         res.status(401)
         throw new Error("user is not authorized")
         
       }
       
   
})
export default authMiddleware