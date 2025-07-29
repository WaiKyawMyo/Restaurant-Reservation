import mongoose, { Schema } from "mongoose";
export interface IFood {
  name: string;
  persent: number;
  status:boolean
}


const discountSchema = new Schema <IFood>({
    name:{
        type:String,
        required:true
    },
    persent:{
        type:Number,
        required:true
    },
    status:{
        type:Boolean,
        required:true
    }
    
})

export const Discount= mongoose.model('Discount',discountSchema)