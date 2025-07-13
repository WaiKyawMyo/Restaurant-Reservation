import { useEffect, useState } from "react";
import { useGetMyReservationMutation } from "../Slice/API/userApi";
import { toast } from "react-toastify";

function MyRestervation() {
  const [getAll] = useGetMyReservationMutation();
  const [reservation, setReservation] = useState([]);
  const [noData, setNoData] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const start = async () => {
      const res = await getAll({});
      if (res.error) {
        toast.error(res.error.message);
      }
      if (res.data.message) {
        setNoData(true);
      } else {
        setReservation(res.data);
        setNoData(false);
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
      <div className="py-10">
        <div className="relative flex flex-col mx-auto h-full overflow-scroll w-full sm:overflow-auto md:w-[600px] lg:w-[800px] text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
          <table className="w-full text-left table-auto min-w-max">
            <thead>
              <tr>
                <th className="p-4 border-b border-slate-300 bg-slate-200">Table No</th>
                <th className="p-4 border-b border-slate-300 bg-slate-200">Date</th>
                <th className="p-4 border-b border-slate-300 bg-slate-200">Reservation Start</th>
                <th className="p-4 border-b border-slate-300 bg-slate-200">Reservation End</th>
                <th className="p-4 border-b border-slate-300 bg-slate-200"></th>
                <th className="p-4 border-b border-slate-300 bg-slate-200"></th>
              </tr>
            </thead>
            <tbody>
              {reservation.map((res) => {
                const startTime = new Date(res.start_time);
                const now = new Date();
                const canCancel = startTime.getTime() - now.getTime() > 60 * 60 * 1000;
                return (
                  <tr key={res._id} className="hover:bg-slate-50">
                    <td className="p-4 border-b border-slate-200">{res.table_id.table_No}</td>
                    <td className="p-4 border-b border-slate-200">{startTime.toLocaleDateString()}</td>
                    <td className="p-4 border-b border-slate-200">{startTime.toLocaleTimeString()}</td>
                    <td className="p-4 border-b border-slate-200">{new Date(res.end_time).toLocaleTimeString()}</td>
                    <td className="p-4 border-b border-slate-200">
                      <button
                        type="button"
                        disabled={!canCancel}
                        className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200"
                      >
                        Pre-order
                      </button>
                    </td>
                    <td className="p-4 border-b border-slate-200 relative">
                      <button
                        onClick={e => {
                          e.stopPropagation(); // To prevent the table click-outside from closing immediately
                          setOpenDropdown(openDropdown === res._id ? null : res._id);
                        }}
                        className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none"
                        type="button"
                      >
                        <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 4 15">
                          <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
                        </svg>
                      </button>
                      {openDropdown === res._id && (
                        <div
                          className="absolute right-0 top-full mt-2 z-20 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-44"
                          onClick={e => e.stopPropagation()}  // Prevent click from bubbling
                        >
                          <ul className="py-2 text-sm text-gray-700">
                            <li>
                              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Dashboard</button>
                            </li>
                            <li>
                              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Settings</button>
                            </li>
                            <li>
                              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Earnings</button>
                            </li>
                          </ul>
                          <div className="py-2">
                            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Separated link</button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {noData && <div className="text-center text-red-500 my-4">No Reservations Found</div>}
        </div>
      </div>
    </>
  );
}

export default MyRestervation;