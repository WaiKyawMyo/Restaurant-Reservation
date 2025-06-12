
import { useSelector } from "react-redux"
import type { RootState } from "../store"
import { Link } from "react-router"

interface Props{
    children:React.ReactNode
}

function Protuct({children}:Props) {
    const userInfo = useSelector((state:RootState)=>state.auth.userInfo)
  return (
    <>
             { !userInfo?  <div  className=" overflow-y-auto  absolute z-50 w-full h-screen  backdrop-blur-2xl">
            <div className="mx-auto mt-6 items-center justify-center p-4 w-full max-w-lg h-full ">
                <div className="relative p-4 bg-white rounded-lg shadow md:p-8">
                    <div className="mb-4 text-sm font-light  ">
                        <h3 className="mb-3 text-2xl font-bold text-black ">Sign in required</h3>
                        <p>
                            You need to be logged in to perform this action. Please sign in or create an account.
                        </p>
                    </div>
                    <div className="justify-between items-center pt-0 space-y sm:space-y-0">
                    
                        <div className="items-center space-y-4 sm:space-x-4 sm:flex sm:space-y-0">
                            <Link to={'/'} id="close-modal" type="button"  className="py-2 text-center px-4 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 w-1/2 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Cancel</Link>
                            <Link to={'/login'} id="confirm-button" type="button" className="py-2 px-4  text-sm font-medium text-center text-white rounded-lg bg-primary-700 w-1/2 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Sign in</Link>
                        </div>
                    </div>
                </div>
            </div>
            </div> : <></>
            
            }
            
            {children}
</>
  )
}

export default Protuct