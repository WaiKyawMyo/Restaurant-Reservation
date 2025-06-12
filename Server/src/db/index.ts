import mongoose from "mongoose"

export const connectDB =async() =>{
    try {
        const dbResponse = await mongoose.connect(`${process.env.MONGODB_URL!}restaurant` )
        console.log("Database is running",  dbResponse.connection.host)
    } catch (error) {
        console.log(error)
    }
}