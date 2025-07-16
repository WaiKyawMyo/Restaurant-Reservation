import { Request, Response } from "express";
import { asyncHandler } from "../Utils/asyncHandler";

import { Table } from "../models/table";
import { Reservation } from "../models/reservation";
import { AuthRequest } from "../middleware/authMiddleware";

// const hasOverlap = async (table_id, start_time, end_time) => {
//   return await Reservation.findOne({
//     table_id,
//     $or: [
//       {
//         start_time: { $lt: new Date(end_time) },
//         end_time: { $gt: new Date(start_time) }
//       }
//     ]
//   });
// };

// export const createReservation = asyncHandler(async (req: Request, res: Response) => {
//   const { start_time, end_time, user_id, table_id } = req.body;

//   if (!start_time || !end_time || !user_id || !table_id) {
//      res.status(400).json({ message: "All fields are required." });
//   }

//   // Check for overlap
//   const overlap = await hasOverlap(table_id, start_time, end_time);
//   if (overlap) {
//      res.status(409).json({ message: "Time slot for this table is already reserved." });
//   }

//   // Create and save the reservation
//   const reservation = new Reservation({
//     start_time: new Date(start_time),
//     end_time: new Date(end_time),
//     user_id,
//     table_id
//   });

//   await reservation.save();
//      res.status(201).json({ message: "Reservation created successfully!", reservation });
// });

export const Available = asyncHandler(async (req: Request, res: Response) => {
    const { people } = req.query;
    if (!people) {
       res.status(400).json({ message: "people required" });
    }
    const intPeople = parseInt(people as string, 10);

    // Find tables that suit
    const tables = await Table.find({
        capacity: { $gte: intPeople, $lte: intPeople+2 }
    });

    res.json(tables);
});
export const getReservedSlots = asyncHandler(async (req: Request, res: Response) => {
  const { table_id, date } = req.query;
  if (!table_id || !date) {
     res.status(400).json({ message: "table_id and date required" });
  }
  // Find reservations for this table and this date
  const start = new Date(date as string);
  const end = new Date(date as string);
  end.setHours(23, 59, 59, 999);

  const reservations = await Reservation.find({
    table_id,
    start_time: { $gte: start, $lte: end }
  });

  res.json(reservations);
});


export const ReservationTable = asyncHandler(async (req: Request, res: Response) => {
  const { user_id, table_id, start_time, end_time } = req.body;
  if (!user_id || !table_id || !start_time || !end_time)
    res.status(400).json({ message: "Missing fields" });

  // Check overlap
  const overlap = await Reservation.findOne({
    table_id,
    $or: [
      { start_time: { $lt: new Date(end_time) },
        end_time: { $gt: new Date(start_time) }
      }
    ]
  });
  if (overlap)
     res.status(409).json({ message: "Time slot is already booked" });

  // Save
  const reservation = await Reservation.create({ user_id, table_id, start_time, end_time });
  res.status(201).json({ message: "Reserved", reservation });
});

export const myReservationGet =asyncHandler(async(req:AuthRequest,res:Response)=>{
  const userId= req.user?._id
  
  const reservations = await Reservation.find({ user_id: userId }).populate('table_id');
   if (!reservations.length) {
     res.status(200).json({ message: "You don’t have any bookings yet. Ready to make one?" });
  }else{
    res.status(200).json(reservations);
  }
  
})

export const removeReservation = asyncHandler(async(req:Request,res:Response)=>{
  const {_id}=req.body
   await Reservation.findByIdAndDelete({_id})
  res.status(200).json({message:"Success Deleted"})
})