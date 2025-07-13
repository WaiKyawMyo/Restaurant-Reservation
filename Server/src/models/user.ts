import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"

interface IUser extends Document{
    username:string,
    email:string,
    password:string,
    role:string,
    phone_no:string
    matchPassword(password:string) : Promise<boolean>
}
const userSchema = new Schema <IUser>({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        require:true,
        uniqued:true
    },
    password:{
        type:String,
        required:true
    },
    phone_no:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    }
})
userSchema.pre("save",async function (next) {
    if(!this.isModified("password")){
        next()
    }
    const salt =await bcrypt.genSalt(10)
    this.password =await bcrypt.hash(this.password,salt)
    next()
})
userSchema.methods.matchPassword = async function(password:string) {
    return await bcrypt.compare(password,this.password)
}
export const User = mongoose.model("User",userSchema)
