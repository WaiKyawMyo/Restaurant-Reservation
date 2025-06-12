import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./db"
import cors from "cors"
import UserRouter from "./router/user"
import cookieparser from "cookie-parser"
import OTProute from "./router/OTP"
import errorHandler from "./middleware/errorHandler"

dotenv.config({
    path: ".env"
})
const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}))
app.use(cookieparser())


app.use('/api',UserRouter)
app.use('/api',OTProute)

app.use(errorHandler)

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
    connectDB()
})