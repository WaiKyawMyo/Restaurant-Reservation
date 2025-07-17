import mongoose, { Schema } from "mongoose";
export interface IFood extends Document {
  name: string;
  type: string;
  price: number;
  is_avaliable: boolean;
  image: string;
  cloudinary_id?: string;
}


const foodSchema = new Schema <IFood>({
    name:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    is_avaliable:{
        type:Boolean,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    cloudinary_id: {
        type:String,
        require:true
    }
})

export const Menu= mongoose.model('Menu',foodSchema)