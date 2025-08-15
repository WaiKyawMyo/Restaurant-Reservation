import { useEffect, useState } from "react";
import { z } from "zod";
import { reservationSchema } from "../Schema/Reservation";
import type { RootState } from "../store";
import { useSelector } from "react-redux";
import { useGetAllTableQuery } from "../Slice/Api";
import { useCreateReservationMutation } from "../Slice/API/userApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faChair, faClock,  faPerson } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";

// --- Time slots definition
const slots = [
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

type FormType = z.infer<typeof reservationSchema>;

function Reservation() {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  const user_id = userInfo?._id;
  const [step2, setStep2] = useState(false);

  const [createReservation, { isLoading: loadingReserve }] =
    useCreateReservationMutation();
  const navigate = useNavigate()
  const [reservations, setReservations] = useState<any[]>([]);
  // const [noTable, setNoTable] = useState(false);
  // const [autoTableId, setAutoTableId] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormType>({
    resolver: zodResolver(reservationSchema),
    defaultValues: { numberOfPeople: 1, date: "", slot: "" },
  });

  const people = watch("numberOfPeople");
  const date = watch("date");
  const table_id = watch("table_id");

  const { data: tables = [], isLoading: loadingTables } =
    useGetAllTableQuery(people);
  const availableTables = tables.filter(
    (t) => t.capacity >= people && t.capacity <= 7
  );
  const confirm = async () => {
  const selectedSlot = watch("slot");
  
  if (!people) {
    toast.info('Please select the number of people');
  } else if (!date) {
    toast.info('Please select a date');
  } else if (!table_id) {
    toast.info('Please select a table');
  } else if (!selectedSlot) {
    toast.info('Please select a time slot');
  } else {
    setStep2(true);
  }
};

  useEffect(() => {
    if (table_id && date) {
      fetch(
        `http://localhost:8000/api/reservations/slots?table_id=${table_id}&date=${date}`
      )
        .then((res) => res.json())
        .then(setReservations)
        .catch(() => setReservations([]));
      setValue("slot", "");
    } else {
      setReservations([]);
      setValue("slot", "");
    }
    document.body.style.overflow = "";
  }, [table_id, date]);
const selectedTable = tables.find((t: any) => t._id === table_id);
  const isSlotReserved = (slot: string) => {
    const slotHour = Number(slot.split(":")[0]);
    return reservations.some((r) => {
      const resStart = new Date(r.start_time).getHours();
      const resEnd = new Date(r.end_time).getHours();
      // Check if [slotHour, slotHour+2) overlaps with [resStart, resEnd)
      return slotHour < resEnd && slotHour + 2 > resStart;
    });
  };

  const onSubmit: SubmitHandler<FormType> = async (data) => {
    const start_time = `${data.date}T${data.slot}:00`;
    const endHour = String(Number(data.slot.split(":")[0]) + 2).padStart(
      2,
      "0"
    );
    const end_time = `${data.date}T${endHour}:00`;

    try {
      const resData =  await createReservation({
        user_id,
        table_id: data.table_id,
        start_time,
        end_time,
      }).unwrap();
      toast.success("Reservation successful!");
      reset({ numberOfPeople: 1, table_id: "", date: "", slot: "" });
      console.log(resData)
      navigate('/success-reserved',{
          state:{
            table_id:data.table_id,
            reservation_id:resData.reservation._id
          }
      })
    } catch (err: any) {
      toast.error(err?.data?.message || "Reservation failed!");
    }
  };
  return (
    <>
      <div className="w-60 flex mx-auto pt-4">
        <ol className="flex items-center  w-full text-xs text-gray-900 font-medium sm:text-base">
          {!step2? <li className="flex w-full relative text-gray-900  after:content-['']  after:w-full after:h-0.5  after:bg-gray-200 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4">
            <div className="block whitespace-nowrap z-10">
              <span className="w-6 h-6 bg-indigo-50 border-2 border-indigo-600 rounded-full flex justify-center items-center mx-auto mb-3 text-sm text-indigo-600 lg:w-10 lg:h-10">
                1
              </span>{" "}
              Step 1
            </div>
          </li> : <li className="flex w-full relative text-indigo-600  after:content-['']  after:w-full after:h-0.5  after:bg-indigo-600 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4">
         <div className="block whitespace-nowrap z-10">
             <span className="w-6 h-6 bg-indigo-600 border-2 border-transparent rounded-full flex justify-center items-center mx-auto mb-3 text-sm text-white lg:w-10 lg:h-10">1</span> Step 1
         </div>
      </li>}

          {!step2?<li className="flex  relative text-gray-900  ">
            <div className="block whitespace-nowrap z-10">
              <span className="w-6 h-6 bg-gray-50 border-2 border-gray-200 rounded-full flex justify-center items-center mx-auto mb-3 text-sm  lg:w-10 lg:h-10">
                2
              </span>{" "}
              Step 2
            </div>
          </li>:<li className="flex relative text-gray-900  ">
            <div className="block whitespace-nowrap z-10">
              <span className="w-6 h-6 bg-indigo-50 border-2 border-indigo-600 rounded-full flex justify-center items-center mx-auto mb-3 text-sm text-indigo-600 lg:w-10 lg:h-10">
                2
              </span>{" "}
              Step 2
            </div>
          </li> }
        </ol>
      </div>
      <div className="w-[500px] m-auto my-10  p-2 border border-gray-300 shadow-[0px_2px_12px_2px_rgba(0,_0,_0,_0.2)]">
        <div className="m-1 border p-6 border-gray-400">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            { !step2 &&  <div className="space-y-5">
            <h1 className="text-2xl font-bold text-center text-gray-600">
              Make A Reservation
            </h1>
            <div>
              <label className="">Number of People</label>
              <input
                type="number"
                min={1}
                max={7}
                {...register("numberOfPeople", { valueAsNumber: true })}
                className="border p-2 w-full border-slate-200 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
              />
              {errors.numberOfPeople && (
                <p className="text-red-500">{errors.numberOfPeople.message}</p>
              )}
            </div>
            <div>
              <label>Table</label>
              {loadingTables ? (
                <p>Loading tables...</p>
              ) : (
                <select
                  {...register("table_id")}
                  className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
                >
                  <option value="">Select a table</option>
                  {availableTables.map((table: any) => (
                    <option
                      className="border-gray-400"
                      key={table._id}
                      value={table._id}
                    >
                      {table.name ?? `Table No ${table.table_No}`} (seats:{" "}
                      {table.capacity})
                    </option>
                  ))}
                </select>
              )}
              {availableTables.length === 0 && (
                <p className="text-red-500">
                  No tables for this party size (max 7)
                </p>
              )}
              {errors.table_id && (
                <p className="text-red-500">{errors.table_id.message}</p>
              )}
            </div>
            <div>
              <label>Date</label>
              <input
                type="date"
                {...register("date")}
                min={new Date().toISOString().split("T")[0]}
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
              />
              {errors.date && (
                <p className="text-red-500">{errors.date.message}</p>
              )}
            </div>
            <h1 className="text-center font-semibold text-gray-500">
              Available Tables
            </h1>
            <div>
              <label>Time Slot</label>
              <div className="flex flex-wrap gap-2">
                {slots.map((slot) => {
                  const reserved = isSlotReserved(slot);
                  console.log(slot, reserved);
                  return (
                    <button
                      type="button"
                      key={slot}
                      disabled={
                        isSlotReserved(slot) ||
                        !date ||
                        !table_id ||
                        loadingReserve
                      }
                      className={`px-4 py-2 border rounded text-lg font-semibold
      ${
        isSlotReserved(slot)
          ? "bg-red-500 text-white cursor-not-allowed line-through"
          : "bg-gray-100 text-black"
      }
      ${watch("slot") === slot ? "bg-green-300" : ""}
    `}
                      onClick={() =>
                        !isSlotReserved(slot) && setValue("slot", slot)
                      }
                    >
                      {slot} {isSlotReserved(slot) && ""}
                    </button>
                    
                  );
                })}

                
                
              </div>
              {errors.slot && (
                <p className="text-red-500">{errors.slot.message}</p>
              )}
            </div>
              <div className="flex ">
                <button
                type="button"
                onClick={confirm}
               
                className="mx-auto group relative inline-flex h-12 w-35 items-center justify-center cursor-pointer overflow-hidden  bg-neutral-950 px-6 font-medium text-neutral-200"
              >
                <span>Next</span>
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                  <div className="relative h-full w-8 bg-white/20"></div>
                </div>
              </button>
              </div>
            </div>}
            {step2 && <div className="space-y-5">
              <div className="p-3 bg-amber-200">
                <p className="text-center">We have a table for you  at <span className="font-bold">Table No {selectedTable.table_No} </span> for <span className="font-bold">{people}</span> people at <span className="font-bold">{selectedTable ? `Table No ${selectedTable.table_No}` : "-"}</span> at <span className="font-bold">{slots.find(s => s === watch("slot")) ? `${watch("slot")}:00` : "-"}</span> on <span className="font-bold">{date ? new Date(date).toLocaleDateString(undefined, { weekday: "short", day: "2-digit", month: "short", year: "numeric" }) : "-"}</span></p>
              </div>
              <div className="border border-gray-300 p-3 space-y-5">
                <div className="flex justify-between p-2">
                   <div className="ml-10">
                      <FontAwesomeIcon icon={faChair} /><span className="ml-2">Tabel No {selectedTable.table_No}</span> 
                   </div>
                   <div className="mr-25">
                       <FontAwesomeIcon icon={faPerson} /><span className="ml-2"> x {people}</span> 
                   </div>
                </div>
                <div className="flex justify-between p-2">
                   <div className="ml-10">
                      <FontAwesomeIcon icon={faClock} /><span className="ml-2">{slots.find(s => s === watch("slot")) ? `${watch("slot")}:00` : "-"}</span> 
                   </div>
                   <div className="mr-2">
                       <FontAwesomeIcon icon={faCalendarDays} /><span className="ml-2">{date ? new Date(date).toLocaleDateString(undefined, { weekday: "short", day: "2-digit", month: "short", year: "numeric" }) : "-"}</span> 
                   </div>
                </div>
              </div>
              <div className="bg-gray-200 p-3 ">
                <p className="font-thin">Note </p>
                <p className="font-thin ">Each reservation allows for a maximum of 2 hours at the table.</p>
                <p className="font-thin">If you need to make any changes, you may go back to the previous step.</p>
                <p className="font-thin">If you’d like to cancel, please do so at least 1 day before your reservation.</p>
              </div>
                <div className=" flex  justify-between w-full">
                  <div>
                  <button onClick={()=>setStep2(false)} type="button" className=" relative h-12 w-35 overflow-hidden rounded border border-gray-300 bg-white px-5 py-2.5 text-gray-600 cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:ring-2 hover:ring-neutral-400 hover:ring-offset-2"><span className="relative">Back</span></button>
                  </div>
                  <div>
              <button
                type="submit"
                disabled={loadingReserve || availableTables.length === 0}
                className="mx-auto group relative inline-flex h-12 w-35 items-center justify-center cursor-pointer overflow-hidden  bg-neutral-950 px-6 font-medium text-neutral-200"
              >
                <span>{loadingReserve ? "Reserving..." : "Reserve"}</span>
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                  <div className="relative h-full w-8 bg-white/20"></div>
                </div>
              </button>
              </div>
            </div>
            </div>}
          </form>
        </div>
      </div>
    </>
  );
}

export default Reservation;