import { createSlice } from "@reduxjs/toolkit"

interface AuthState {
    userInfo: {
        _id:string,
        email:string,
        username:string
    } | null
}

const initialState:AuthState ={
    userInfo:localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo' )as string ): null,
}

export const authSlite = createSlice({
    name: "auth",
    initialState,
    reducers:{
         setUserInfo:(state,action)=>{
        state.userInfo =action.payload
        localStorage.setItem('userInfo',JSON.stringify(action.payload))
       },
       clearUserInfo:(state)=>{
        state.userInfo = null
        localStorage.removeItem('userInfo')
       }

    }
})

export const {setUserInfo,clearUserInfo} =  authSlite.actions
export default authSlite.reducer