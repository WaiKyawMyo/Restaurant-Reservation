import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    time:{
        type:Date,
        required:true
    },
    user_id:{
        type:Schema.Types.ObjectId,
        ref:"User",
        nullable:true,
        unique:false
    },
    table_id:{
        type:Schema.Types.ObjectId,
        ref:"Table",
        required:true,
        
    },
     reservation_id:{
        type:Schema.Types.ObjectId,
        ref:"Table",
        nullable:true
     },
    total: {
        type: Number,
        required: true,
        min: 0
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    tax_amount: {
        type: Number,
        
        min: 0
    },
    discount_amount: {
        type: Number,
    
        min: 0
    },
    service_charge: {
        type: Number,
    
        min: 0
    },


})


export const Order = mongoose.model("Order",orderSchema)    

