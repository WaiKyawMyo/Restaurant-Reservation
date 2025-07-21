import mongoose, { Schema } from "mongoose";

const orderMenuSchema = new Schema({
    menu_id:{
        type:Schema.Types.ObjectId,
        ref:"Menu",
        nullable: true
    },
    quantity:{
        type:Number,
        required:true
    },
    set_id:{
        type:Schema.Types.ObjectId,
        ref:"Set",
        nullable: true
    },
    order_id:{
        type:Schema.Types.ObjectId,
        ref:"Order",
        required:true
    },
    table_id:{
        type:Schema.Types.ObjectId,
        ref:"Table",
        required:true
    }
})

export const OrderMenu = mongoose.model("OrderMenu",orderMenuSchema)