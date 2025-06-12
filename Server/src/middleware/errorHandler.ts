import { NextFunction, Request, Response } from "express";

const errorHandler =(err:Error,req:Request,res:Response,next:NextFunction)=>{
    const statuCode = res.statusCode === 200? 500 : res.statusCode
    res.status(statuCode).json({
        message:err.message,
        stack:process.env.NODE_ENV ==="production" ? null: err.stack
    })
}

export default errorHandler