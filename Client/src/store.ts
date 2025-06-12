import { configureStore } from "@reduxjs/toolkit";

import authSlite  from "./Slice/auth";
import { apiSlite } from "./Slice/Api";



 export const store = configureStore({
    reducer:{
      auth : authSlite ,
      [apiSlite.reducerPath]:apiSlite.reducer
    },
   middleware:(getDefaultMiddleware)=> getDefaultMiddleware().concat(apiSlite.middleware),
   devTools:true
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch