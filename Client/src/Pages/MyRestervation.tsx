import { useEffect, useState } from "react";
import { useDeleteReservationMutation, useGetMyReservationMutation, usePreOrderMutation } from "../Slice/API/userApi";
import { toast } from "react-toastify";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
function MyRestervation() {
  const [getAll] = useGetMyReservationMutation();
  const [reservation, setReservation] = useState([]);
  const [noData, setNoData] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ x: 0, y: 0 });
  const [loading,setLoading]= useState(false)
  const [popup,setpopup]=useState(false)
  const [ReservationDe]=useDeleteReservationMutation()
  const [id,setid]=useState('')
  const rowPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPage = Math.ceil(reservation.length / rowPerPage);
  const [getOrder]= usePreOrderMutation()
  const [resData,setrespData]=useState([])
  

  const handleClick = (page: number) => {
    setCurrentPage(page);
  };
  const pageData = reservation.slice(
    (currentPage - 1) * rowPerPage,
    currentPage * rowPerPage
  );

  const handleBack = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };
  const handleNext = () => {
    if (currentPage < totalPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  const navigate = useNavigate()
  const confirmdelete = async(id:string)=>{
    setid(id)
    console.log(id)
    setpopup(true)
     setOpenDropdown(null);
  }
  const cancel = async()=>{
     try {
    const res = await ReservationDe({_id: id});
    
    // Check if deletion was successful
    if (res.data) {
      setid('');
      setpopup(false);
      toast.success(res.data.message);
      
      // Refresh the reservations list
      const updatedRes = await getAll({});
      if (updatedRes.data && !updatedRes.data.message) {
        setReservation(updatedRes.data);
        setNoData(false);
      } else {
        setReservation([]);
        setNoData(true);
      }
    }
  } catch (error) {
    toast.error("Failed to cancel reservation");
  }
  }
  useEffect(() => {
    setLoading(true)
    const start = async () => {
      const res = await getAll({});
      const data = await getOrder({})
      
      setrespData(data.data)
      
      console.log(res)
      if (res.error) {
        toast.error(res.error.message);
        setLoading(false)
      }
      if (res.data.message) {
        setNoData(true);
        setLoading(false)
      } else {
        setReservation(res.data);
        
        setNoData(false);
        setLoading(false)
      }
    };
    start();
  }, [getAll]);

  // (Optional) Click outside to close dropdown
  useEffect(() => {
    function handleClick(e) {
      setOpenDropdown(null);
    }
    if (openDropdown !== null) {
      window.addEventListener("click", handleClick);
      return () => window.removeEventListener("click", handleClick);
    }
  }, [openDropdown]);

  return (
    <>
      <h1 className="text-2xl font-bold text-center my-6">My Reservations</h1>
      <div className="pb-10">
        <div className="relative flex flex-col mx-auto h-full overflow-scroll w-full sm:overflow-auto md:w-[600px] lg:w-[800px] text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
          <table className="w-full text-left table-auto min-w-max">
            <thead>
              <tr>
                <th className="p-4 border-b border-slate-300 bg-slate-200">
                 No
                </th>
                <th className="p-4 border-b border-slate-300 bg-slate-200">
                  Table No
                </th>
                <th className="p-4 border-b border-slate-300 bg-slate-200">
                  Date
                </th>
                <th className="p-4 border-b border-slate-300 bg-slate-200">
                  Reservation Start
                </th>
                <th className="p-4 border-b border-slate-300 bg-slate-200">
                  Reservation End
                </th>
                <th className="p-4 border-b border-slate-300 bg-slate-200">Order</th>
                <th className="p-4 border-b border-slate-300 bg-slate-200"></th>
              </tr>
            </thead>
            <tbody>
            
              {!loading && pageData
                .sort(
                  (a, b) =>
                    new Date(b.start_time).getTime() -
                    new Date(a.start_time).getTime()
                )
              
                .map((res,index) => {
                  const startTime = new Date(res.start_time);
                  const now = new Date();
                  
                  const canCancel =
                    startTime.getTime() - now.getTime() > 60 * 60 * 1000;
                  const over = startTime.getTime() < now.getTime();
                  return (
                    <tr key={res._id} className="hover:bg-slate-50">
                      <td className="p-4 border-b border-slate-200">
                        {index+1}
                      </td>
                      <td className="p-4 border-b border-slate-200">
                        Table ({res.table_id.table_No})
                      </td>
                      <td className="p-4 border-b border-slate-200">
                        {startTime.toLocaleDateString()}
                      </td>
                      <td className="p-4 border-b border-slate-200">
                        {startTime.toLocaleTimeString()}
                      </td>
                      <td className="p-4 border-b border-slate-200">
                        {new Date(res.end_time).toLocaleTimeString()}
                      </td>
                      <td className="p-4 border-b border-slate-200">
  {(() => {
    const hasOrder = resData.filter(data => data.reservation_id == res._id).length > 0;
    const isDisabled = !canCancel || over || hasOrder;
    
    return (
      <button
        onClick={() => {
          if (!isDisabled) {
            navigate(`/pro-order/${res.table_id._id}`, {
              state: {
                reservation_id: res._id
              }
            });
          }
        }}
        type="button"
        disabled={isDisabled}
        className={`py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent
          ${
            isDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-100 text-blue-800 hover:bg-blue-200"
          }
        `}
      >
        {hasOrder ? "Order Placed" : "Pre-order"}
      </button>
    );
  })()}
</td>
                      <td className="p-4 border-b border-slate-200 relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const rect =
                              e.currentTarget.getBoundingClientRect();
                            const dropdownWidth = 180; // Or your dropdown width in px (w-44 ≈ 176px)
                            const padding = 16; // for a little spacing with the edge

                            let left = rect.right;
                            if (
                              left + dropdownWidth + padding >
                              window.innerWidth
                            ) {
                              // Adjust to keep in viewport
                              left =
                                window.innerWidth - dropdownWidth - padding;
                            }
                            setDropdownPos({ x: left, y: rect.bottom }); // Set position
                            setOpenDropdown(
                              openDropdown === res._id ? null : res._id
                            ); // Toggle dropdown
                          }}
                          className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none"
                          type="button"
                        >
                          <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 4 15"
                          >
                            <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                          </svg>
                        </button>
                        {openDropdown &&
                          createPortal(
                            <div
                              className="fixed z-50 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-44"
                              style={{
                                left: dropdownPos.x,
                                top: dropdownPos.y,
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ul className="py-2 text-sm text-gray-700">
                                <li>
                                  <button onClick={()=>{confirmdelete(res._id)}} className="block w-full text-left px-4 py-2 hover:bg-red-100 cursor-pointer">
                                     Cancel Reservation
                                  </button>
                                </li>
                                
                              </ul>
                              
                            </div>,
                            document.body
                          )}
                      </td>
                    </tr>
                  );
                })} 
            </tbody>
            
          </table>
          
          {(noData && !loading ) && (
            <div className="">
               <p className="text-center text-red-500 my-2">No reservations yet.</p> 
              <p className="text-center py-1 font-black">Ready to make your booking?</p>
              <button onClick={()=>{navigate('/reservation')}} className="mx-auto block relative h-11  overflow-hidden rounded bg-yellow-500 px-5 py-1 my-2 text-white transition-all duration-300 hover:bg-yellow-700 hover:ring-2 hover:ring-yellow-600 hover:ring-offset-2"><span className="relative">Make Reservation</span></button>
            </div>
          )}
           {loading &&(
            <div className="mx-auto">
               <div role="status">
    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
</div>
         
            </div>
          ) }

           
        </div>
        {!pageData&&  <div className="mx-auto">
            <div className="mt-4 flex justify-center space-x-2 ">
            <button
              onClick={handleBack}
              disabled={currentPage == 1}
              className={`py-1 px-2.5 bg-blue-600 rounded ${
                currentPage == 1 ? "bg-gray-500" : ""
              }`}
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            {Array.from({ length: totalPage }, (_, idx) => (
              <button
                key={idx + 1}
                className={`px-3 py-1 rounded ${
                  currentPage === idx + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => handleClick(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={handleNext}
              disabled={currentPage == totalPage}
              className={`py-1 px-2.5 bg-blue-600 rounded ${
                currentPage == totalPage ? "bg-gray-500" : ""
              }`}
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
          </div>
          </div>}
      </div>
      

      {popup && createPortal(
  <div className="fixed inset-0 backdrop-blur-xs  backdrop:opacity-55 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 mx-4 max-w-md w-full shadow-xl">
      <h1 className="text-xl font-bold">Cancel Reservation?</h1>
      <p className="py-3">This action cannot be undone. Your table reservation will be cancelled and made available to other customers</p>
      <div className="flex gap-3">
        <button 
          onClick={() => setpopup(false)} 
          className="rounded bg-gray-300 py-2 text-gray-800 cursor-pointer px-4 hover:bg-gray-400"
        >
          Go Back
        </button>
        <button 
          onClick={() => cancel()} 
          className="rounded bg-red-500 py-2 text-white cursor-pointer px-4 hover:bg-red-600"
        >
          Confirm Cancellation
        </button>
      </div>
    </div>
  </div>,
  document.body
)}
    </>
  );
}

export default MyRestervation;
          