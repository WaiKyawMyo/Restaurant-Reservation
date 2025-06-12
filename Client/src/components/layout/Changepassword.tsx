import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { z } from "zod"
import ChangepasswordSchema from "../../Schema/Changepassword"
import { useChangePWwithOTPMutation } from "../../Slice/API/userApi"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useSelector } from "react-redux"
import type { RootState } from "../../store"
import { toast } from "react-toastify"

import { zodResolver } from "@hookform/resolvers/zod"

type Loginfrom = z.infer<typeof ChangepasswordSchema>
type Props ={
    SetChangePW: React.Dispatch<React.SetStateAction<boolean>>;
}

function Changepassword({SetChangePW}:Props) {
    


    const userInfo = useSelector((state:RootState)=>state.auth.userInfo)
     
     const { register, handleSubmit,formState:{errors,isSubmitting} } = useForm<Loginfrom>({
                    resolver: zodResolver(ChangepasswordSchema)
                })
         const [changePW ,{isLoading}] = useChangePWwithOTPMutation()
              const Submit:SubmitHandler<Loginfrom> = async(data)=> {
                const NewData = {
                    password : data.password,
                    comfirmPassword :data.comfirmPassword,
                    email:userInfo?.email 
                }
                 try {
                  const res= await changePW(NewData).unwrap()
                  toast.success(res.message,{
                     onClose: () => {
                      SetChangePW(false)
                }
                 })
                 
                 } catch (err:any) {
                   toast.error(err?.data?.message || err.error)
                 }
                  }     
  return (
    <div className="fixed inset-0 bg-transparent backdrop-contrast-50 z-20 w-full">
        <div className=" absolute  w-80 mt-30 left-25 lg:left-2/5  bg-white overflow-hidden shadow rounded-lg border z-30 p-6">
            <div className='py-3 cursor-pointer hover:text-gray-500' onClick={()=>SetChangePW(false)}>
                <FontAwesomeIcon icon={faArrowLeft} className='cursor-pointer'/> Back
            </div>
            <form onSubmit={handleSubmit(Submit)} className="max-w-sm mx-auto">
                
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-900">New Password</label>
                    <input  {...register('password')}className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "  placeholder="••••••••" />
                    {errors.password? <p className='text-red-400'>{errors.password?.message}</p>: <></>}
                </div>
                <div className="mb-5">
                    <label  className="block mb-2 text-sm font-medium text-gray-900 ">Confirm Password</label>
                    <input {...register('comfirmPassword')}  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="••••••••"/>
                    {errors.comfirmPassword? <p className='text-red-400'>{errors.comfirmPassword?.message}</p>: <></>}
    
                </div>
                
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{isSubmitting || isLoading?"Updating..." :  "Change Password"}</button>
            </form>
    </div>
    </div>
  )
}

export default Changepassword