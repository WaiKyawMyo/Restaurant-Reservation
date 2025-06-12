
import { Bounce, ToastContainer } from "react-toastify"
import Header from "../components/layout/Header"
import { Outlet } from "react-router"
import Footer from "../components/layout/Footer"


function Main() {
  return (
    <div>
        
        <Header/>
         <ToastContainer
         className={'mt-14'}
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
     <Outlet/>
     <Footer/>
    </div>
  )
}

export default Main