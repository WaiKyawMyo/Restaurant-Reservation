import { useForm, type SubmitHandler } from "react-hook-form"
import { useLocation, useNavigate } from "react-router"
import ChangepasswordSchema from "../../Schema/Changepassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangePWwithOTPMutation } from "../../Slice/API/userApi";
import { Bounce, toast, ToastContainer } from "react-toastify";
import Logo from '../../assets/Logo.svg'
import { z } from "zod"
import background from '../../assets/Background.jpg'

type Loginfrom = z.infer<typeof ChangepasswordSchema>

function ChangePw() {
    const navigate = useNavigate()
    const location = useLocation();
    const email = location.state?.email;
             const { register, handleSubmit,formState:{errors,isSubmitting} } = useForm<Loginfrom>({
                    resolver: zodResolver(ChangepasswordSchema)
                })
         const [changePW ,{isLoading}] = useChangePWwithOTPMutation()
          const Submit:SubmitHandler<Loginfrom> = async(data)=> {
            const NewData = {
                password : data.password,
                comfirmPassword :data.comfirmPassword,
                email
            }
             try {
              const res= await changePW(NewData).unwrap()
              toast.success(res.message,{
                 onClose: () => {
                  navigate('/changepassword' );
            }
             })
             navigate('/login')
             } catch (err:any) {
               toast.error(err?.data?.message || err.error)
             }
              }     
  return (
    <section className="bg-cover bg-center bg-amber-600  opacity-0.9 " style={{backgroundImage:`url(${background})`}}>
        <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
                />
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="#" className="flex items-center mb-6 w-30 bg-white rounded-b-4xl text-gray-900 dark:text-white">
                    <img src={Logo} alt="" />
                </a>
                <div className="w-full backdrop-blur-md bg-black/30 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:border-gray-400">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(Submit)}>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Password</label>
                                <input type="text" {...register('password')} className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="••••••••" />
                                {
                                    errors.password ? <span className='text-red-400 font-bold'>{errors.password?.message}</span> : <span className='h-4'></span>
                                }
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                                <input type="text" {...register('comfirmPassword')}className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="••••••••" />
                                {
                                    errors.comfirmPassword ? <span className='text-red-400 font-bold'>{errors.comfirmPassword?.message}</span> : <span className='h-4'></span>
                                }
                            </div>
                            
                            <button type="submit" className="w-full flex items-center justify-center text-white bg-primary hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 cursor-pointer hover:bg-amber-700" disabled={isLoading|| isSubmitting}>
                               { isLoading ?
                                <svg aria-hidden="true" className="w-4 h-4 me-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                                :<></>}
                                 Sign in</button>
                             <p className="text-sm font-light text-gray-200">
                                back to <a  className="font-medium text-primary-600 hover:underline dark:text-primary-500 " onClick={()=>navigate('/login')} >Sign in</a>
                            </p>
                        </form>
                    </div>
                </div>
        </div>

        </section>
  )
}

export default ChangePw