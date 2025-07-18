import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    time:{
        type:Date,
        required:true
    },
    user_id:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    table_id:{
        type:Schema.Types.ObjectId,
        ref:"Table",
        required:true,
        
    },
      order_number: {
        type: String,
        unique: true,
        required: true
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
        default: 0,
        min: 0
    },
    discount_amount: {
        type: Number,
        default: 0,
        min: 0
    },
    service_charge: {
        type: Number,
        default: 0,
        min: 0
    },


})
orderSchema.pre('save', async function(next) {
    if (!this.order_number) {
        const count = await mongoose.model('Order').countDocuments();
        this.order_number = `ORD-${(count + 1).toString().padStart(4, '0')}`;
    }
    next();
});

export const Order = mongoose.model("Order",orderSchema)    

