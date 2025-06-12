import { useForm, type SubmitHandler } from 'react-hook-form'
import background from '../../assets/Background.jpg'
import Logo from '../../assets/Logo.svg'
import { z } from "zod"

import { zodResolver } from '@hookform/resolvers/zod'
import LoginSchema from '../../Schema/Login'
import { useLoginMutation } from '../../Slice/API/userApi' 
import { useDispatch } from 'react-redux'
import { setUserInfo } from '../../Slice/auth'
import { Bounce, toast, ToastContainer } from 'react-toastify'
import { Link, useNavigate } from 'react-router'



type Loginfrom = z.infer<typeof LoginSchema>


function Login() {
    const navigate = useNavigate()
    const [Login,{isLoading}] = useLoginMutation()

    const dispstch =useDispatch() 
     const { register, handleSubmit,formState:{errors,isSubmitting} } = useForm<Loginfrom>({
            resolver: zodResolver(LoginSchema)
        })

    const Submit:SubmitHandler<Loginfrom> = async(data)=> {
       
        try {
            const res = await Login(data).unwrap()
            
            dispstch(setUserInfo(res))
            toast.success(res.message ,{
                onClose:()=>{
                    navigate('/')
                }
            })
            
        } catch (err:any) {
            toast.error(err?.data?.message || err.error)
            console.log(err)
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
    <div className="flex flex-col items-center justify-center px-6 py-8 h-screen mx-auto md:h-screen lg:py-0">
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
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                        <input type="email" {...register('email')} id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@gmail.com" />
                        {
                            errors.email ? <span className='text-red-400 font-bold'>{errors.email?.message}</span> : <span className='h-4'></span>
                        }
                    </div>
                    <div>
                        <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <input type="password" {...register("password")} name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        {
                            errors.password ? <span className='text-red-400 font-bold'>{errors.password?.message}</span> : <span className='h-4'></span>
                        }
                    </div>
                    <div className="flex items-center ">
                        
                        <Link to={'/forgot'}  className="text-sm font-medium text-primary-600 text-white hover:underline ">Forgot password?</Link>
                    </div>
                    <button type="submit" className="w-full text-white bg-primary hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 cursor-pointer hover:bg-amber-700" disabled={isLoading || isSubmitting}>Sign in</button>
                    <p className="text-sm font-light text-gray-200">
                        Don’t have an account yet? <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" onClick={()=>navigate('/register')} >Sign up</a>
                    </p>
                </form>
            </div>
        </div>
  </div>

</section>
  )
}

export default Login


