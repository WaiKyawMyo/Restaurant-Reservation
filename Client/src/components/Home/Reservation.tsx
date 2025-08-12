import { Link } from "react-router";
import ReservationBg from '../../../public/selective-focus-shot-bucket-with-forks-napkins-trendy-cafe-table.jpg';

function Reservation() {
  return (
    <div
      className="relative text-center mx-auto h-[50vh] md:h-[90vh] bg-center bg-cover"
      style={{ backgroundImage: `url(${ReservationBg})` }}
    >
      {/* Overlay for better text contrast */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative flex items-center justify-center h-full w-full">
       
        <Link to={'/reservation'} type="button" className="text-yellow-400 hover:text-white border-2 font-bold border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 rounded-lg text-sm px-5 py-2.5 md:px-10 md:py-6 md:text-xl text-center me-2 mb-2 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-600 dark:focus:ring-yellow-900">Reserve Now</Link>
      </div>
      
    </div>
  );
}

export default Reservation;