import {Navigate, useNavigate } from 'react-router'
import Image from '../../../public/cuteanimated_474.jpg'

function Success() {
const navigate =useNavigate()
  return (
    <div className="w-[500px] m-auto my-10  p-2 border border-gray-300 shadow-[0px_2px_12px_2px_rgba(0,_0,_0,_0.2)]">
        <div className="m-1 border p-6 border-gray-400">
            <h1 className="text-center text-2xl font-extrabold text-gray-500">Thank you for reserving your table at MuMu Restaurant</h1>
            <div className='w-60 mx-auto'>
                <img src={Image} alt="" />
            </div>
            <div className='flex justify-evenly'>
<button
              
            
                className=" group relative inline-flex h-12 w-35 items-center justify-center cursor-pointer overflow-hidden  bg-neutral-950 px-6 font-medium text-neutral-200"
              >
                <span>Pre-Order</span>
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                  <div className="relative h-full w-8 bg-white/20"></div>
                </div>
              </button>
               
               <button onClick={()=>navigate('/')} type="button" className=" relative h-12 w-35 overflow-hidden rounded border border-gray-300 bg-white px-5 py-2.5 text-gray-600 cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:ring-2 hover:ring-neutral-400 hover:ring-offset-2"><span className="relative">Skip for now</span></button>
            </div>
        </div>
    </div>
  )
}

export default Success