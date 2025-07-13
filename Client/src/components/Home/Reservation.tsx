import { Link } from "react-router"


function Reservation() {
  return (
    <div className="text-center mx-auto h-[30vh]  lg:w-[500px]  lg:h-[80vh] ">
        <div className="pt-5 sm:pt-25 lg:pt-45">
            <p className="mb-4 ">
            Indulge in our authentic Mala Xiang Guo without the wait. Whether it's a romantic dinner, family gathering, or spicy food adventure with friends, we'll have the perfect table ready for you.
        </p >
         <Link to={'/reservation'} className="group cursor-pointer  relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-yellow-500 px-6 font-medium text-white"><span className="absolute h-0 w-0 rounded-full bg-yellow-600 transition-all duration-300 group-hover:h-56 group-hover:w-full font-bold"></span><span className="relative">Reserve Now</span></Link>
        </div>
    </div>
 
  )
}

export default Reservation