import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";

export const asyncHandler=(controllerFn:(req:AuthRequest,res:Response,next:NextFunction)=>Promise<void>)=>(req:Request,res:Response,next:NextFunction)=>{
    Promise.resolve(controllerFn(req,res,next)).catch(next)
}
