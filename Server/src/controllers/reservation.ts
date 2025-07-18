import { Request, Response } from "express";
import { asyncHandler } from "../Utils/asyncHandler";

import { Table } from "../models/table";
import { Reservation } from "../models/reservation";
import { AuthRequest } from "../middleware/authMiddleware";
import mongoose from "mongoose";
import { Menu } from "../models/Menu";
import { Order } from "../models/Order";
import { OrderMenu } from "../models/Order_Menu";

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

export const createOrder = asyncHandler(async(req:AuthRequest,res:Response)=>{
    const { 
        table_id, 
        order_items, 
        discount_amount = 0,
        service_charge = 0
    } = req.body;
    
    // Get user_id from your existing auth middleware
    const user_id = req.user?.id || req.user?._id;

    // Validate required fields
    if (!table_id || !order_items || order_items.length === 0) {
         res.status(400).json({
            success: false,
            message: "Table ID and order items are required"
        });
    }

    // Start transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Validate table exists
        const table = await Table.findById(table_id).session(session);
        if (!table) {
            throw new Error("Table not found");
        }

        let subtotal = 0;
        const orderMenuItems = [];

        // Process each order item
        for (const item of order_items) {
            const { menu_id, quantity, set_id } = item;

            // Validate required fields
            if (!menu_id || !quantity || quantity <= 0) {
                throw new Error("Invalid menu item or quantity");
            }

            if (!set_id) {
                throw new Error("Set ID is required");
            }

            // Validate menu item exists and is available
            const menu = await Menu.findById(menu_id).session(session);
            if (!menu) {
                throw new Error(`Menu item with ID ${menu_id} not found`);
            }

            if (!menu.is_available) {
                throw new Error(`Menu item "${menu.name}" is not available`);
            }

            // Validate set exists and is available
            const set = await Set.findById(set_id).session(session);
            if (!set) {
                throw new Error(`Set with ID ${set_id} not found`);
            }

            if (!set.is_available) {
                throw new Error(`Set "${set.name}" is not available`);
            }

            // Calculate subtotal using menu price
            const itemTotal = menu.price * quantity;
            subtotal += itemTotal;

            // Prepare order menu item
            orderMenuItems.push({
                menu_id,
                quantity,
                set_id,
                table_id
            });
        }

        // Calculate totals
        const tax_rate = 0.1; // 10% tax
        const tax_amount = subtotal * tax_rate;
        const total = subtotal + tax_amount + service_charge - discount_amount;

        // Validate total amount
        if (total < 0) {
            throw new Error("Total amount cannot be negative");
        }

        // Create the main order
        const order = new Order({
            time: new Date(),
            user_id,
            table_id,
            subtotal,
            tax_amount,
            discount_amount,
            service_charge,
            total
            // order_number will be generated automatically by pre-save hook
        });

        await order.save({ session });

        // Add order_id to each order menu item and create them
        const orderMenuItemsWithOrderId = orderMenuItems.map(item => ({
            ...item,
            order_id: order._id
        }));

        await OrderMenu.insertMany(orderMenuItemsWithOrderId, { session });

        // Update table status to occupied if available
        if (table.status === 'available') {
            await Table.findByIdAndUpdate(
                table_id,
                { status: 'occupied' },
                { session }
            );
        }

        // Commit transaction
        await session.commitTransaction();

        // Get order items with populated data
        const orderItemsWithDetails = await OrderMenu.find({ order_id: order._id })
            .populate('menu_id', 'name type price image is_available cloudinary_id')
            .populate('set_id', 'name price description category is_available')
            .populate('table_id', 'number section capacity status')
            .populate('order_id', 'order_number time total subtotal tax_amount');

        // Populate the order
        const populatedOrder = await Order.findById(order._id)
            .populate('user_id', 'name email phone role')
            .populate('table_id', 'number section capacity status location');

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: {
                order: populatedOrder,
                order_items: orderItemsWithDetails,
                summary: {
                    order_id: order._id,
                    order_number: order.order_number,
                    table_number: table.number,
                    total_items: orderItemsWithDetails.length,
                    subtotal: order.subtotal,
                    tax_amount: order.tax_amount,
                    discount_amount: order.discount_amount,
                    service_charge: order.service_charge,
                    total: order.total,
                    order_time: order.time
                }
            }
        });

    } catch (error) {
        // Rollback transaction on error
        await session.abortTransaction();
        
        res.status(400).json({
            success: false,
            message: error.message || "Failed to create order",
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    } finally {
        session.endSession();
    }
})