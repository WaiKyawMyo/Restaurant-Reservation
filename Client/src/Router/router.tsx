import { createBrowserRouter } from "react-router";
import Main from "../Layout/Main";

import Register from "../components/Login/Register";
import Login from "../components/Login/Login";
import Forgot from "../components/Login/Fotgot";

import OtpVerification from "../components/Login/OTPcode";
import ChangePw from "../components/Login/ChangePw";
import Home from "../Pages/Home";
import Reservation from "../Pages/Reservation";
import Protuct from "../components/Protuct";


const router = createBrowserRouter([
    {
        path:'/',
        element: <Main/>,
        children:[
            {
                path:'/',
                element:<Home/>

            } ,
            {
                path:'/reservation',
                element:<Protuct><Reservation/></Protuct> 
            },
            {
               
            }
        ]   
    },
    {
        path:'/login',
        element:<Login/>
    },
    {
         path:'/register',
        element:<Register/>
    },
    {
        path:"/forgot",
        element:<Forgot/>
    },{
        path:"/otpcode",
        element:<OtpVerification/>
    },{
        path:'/changepassword',
        element:<ChangePw/>
    },
])
export default router