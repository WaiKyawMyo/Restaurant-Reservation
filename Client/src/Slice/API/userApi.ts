
import { apiSlite } from "../Api";
interface LoginInput {
    email:string,
    password:string
}
interface registerInput  {
    username:string,
    email:string,
    password:string
}
interface ReqOTP {
    email:string
}
interface VefOTP{
    email : string,
    userOtp:string
}
interface ChangeWOTP{
    password:string ,
    comfirmPassword:string,
    email ?:string
}
interface updateInp{
    email?:string,
    username?:string
}

export const userApiSlite =apiSlite.injectEndpoints({
    endpoints:(build)=>({
        Login:build.mutation({
            query:(data:LoginInput)=>({
                url:"login",
                method:"post",
                body:data,
                credentials:"include",
            })
        }),
        UserRegister:build.mutation({
            query:(data:registerInput)=>({
                url:'register',
                method: "post",
                body:data,
                credentials:"include",
            })
        })
        ,
        Logout:build.mutation({
            query:()=>({
                url:"logout",
                method: "post",
                Credential:"include"
            })
        }),
       RequestOTP:build.mutation({
            query:(data:ReqOTP)=>({
                url: "request-otp-email",
                method:"post",
                body:data,
                credentials:"include"
            })
       }),
       VarifyOTP:build.mutation({
        query:(data:VefOTP)=>({
            url:"verify-otp-email",
            method:"post",
            body:data
        })
       }),
       ChangePWwithOTP:build.mutation({
        query:(data:ChangeWOTP)=>({
            url:'change-with-OTP',
            method:"post",
            body:data,

        })
       }),
       Profile:build.mutation({
        query:()=>({
            url:'profile',
            method:"get",
            credentials:"include"
        })
       }),
       UpdtePro:build.mutation({
        query:(data:updateInp)=>({
            url:'profile',
            method:'put',
            body:data,
            credentials:'include',
        })
       })
      
    })
})
export  const{useLoginMutation,useLogoutMutation,useUserRegisterMutation,useRequestOTPMutation,useVarifyOTPMutation,useChangePWwithOTPMutation,useProfileMutation,useUpdteProMutation}= userApiSlite