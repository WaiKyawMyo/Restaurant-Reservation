import mongoose, { Schema } from "mongoose";

const reservationSchema = new Schema({
    user_id:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    table_id:{
        type:Schema.Types.ObjectId,
        ref:"Table",
        required:true
    },
  // Add reservation time fields
    start_time: {
        type: Date,
        required: true
    },
    end_time: {
        type: Date,
        required: true
    },
    
})
export const Reservation = mongoose.model("Reservation",reservationSchema)