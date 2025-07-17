import mongoose, { Mongoose, Schema } from "mongoose";


interface ISet {
    name:string,
    image:string,
    cloudinary_id:string,
    timestamp:Date,
    price:Number
}


const SetSchema = new Schema<ISet>({
    name:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
     image:{
        type:String,
        required:true
    },
    cloudinary_id: {
        type:String,
        require:true
    },
    timestamp: {
        type: Date,
        default : Date.now
    }
})

export const Set = mongoose.model('Set',SetSchema)