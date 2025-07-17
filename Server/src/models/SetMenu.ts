import mongoose, { Schema } from "mongoose";

interface ISet_Menu {
    menu_id:mongoose.Types.ObjectId,
    set_id:mongoose.Types.ObjectId,
    unit_Quantity:number
}

const Set_Menu = new Schema <ISet_Menu>({
     menu_id:{
        type:Schema.Types.ObjectId,
        ref:"Menu",
        required:true
    },
    set_id:{
        type:Schema.Types.ObjectId,
        ref:"Set",
        required:true
    },
    unit_Quantity:{
        type:Number,
        required:true
    }
})

export const SetMenu= mongoose.model('Set_Menu',Set_Menu)