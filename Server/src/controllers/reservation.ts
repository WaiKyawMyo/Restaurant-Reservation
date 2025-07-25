import { Request, Response } from "express";
import { asyncHandler } from "../Utils/asyncHandler";

import { Table } from "../models/table";
import { Reservation } from "../models/reservation";
import { AuthRequest } from "../middleware/authMiddleware";
import mongoose from "mongoose";
import { Menu } from "../models/Menu";
import { Order } from "../models/Order";
import { OrderMenu } from "../models/Order_Menu";
import { Set } from "../models/Set";

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
export const PreOrder = asyncHandler(async(req:Request,res:Response)=>{
    const response = await Order.find({})
    if(!response.length){
        res.status(200).json({message:"You Don't have any order"})
    }else{
        res.status(200).json(response)
    }
})
export const removeReservation = asyncHandler(async(req: Request, res: Response) => {
  const { _id } = req.body
  
  // Find all orders with the given reservation_id
  const orderData = await Order.find({ reservation_id: _id })
  

  
  if (orderData.length > 0) {
    // Delete all OrderMenus for each order (using Promise.all for better performance)
    await Promise.all(
      orderData.map(order => OrderMenu.deleteMany({ order_id: order._id }))
    )
    
    // Delete all orders with this reservation_id
    await Order.deleteMany({ reservation_id: _id })
    
    // Delete the reservation itself
    await Reservation.findByIdAndDelete(_id)
    
    res.status(200).json({ message: "Successfully deleted reservation" })
  } else {
    // Still delete the reservation even if no orders found
    await Reservation.findByIdAndDelete(_id)
    res.status(200).json({ message: "Reservation deleted (no related orders found)" })
  }
})

export const createOrder = asyncHandler(async(req:AuthRequest,res:Response)=>{
    const { 
        table_id, 
        order_items, 
        reservation_id,
        discountPercent = 5,
        service_charge = 2500
    } = req.body;
    if(!reservation_id){
        res.status(400).json({
            success:false,
            message:"Reservation ID are Required"
        })
    }
    // Get user_id from your existing auth middleware
    const user_id = req.user?._id;

    // Validate required fields
    if (!table_id || !order_items || order_items.length === 0) {
         res.status(400).json({
            success: false,
            message: "Table ID and order items are required"
        });
    }
    if(!user_id){
        res.status(400).json({
            success:false,
            message:"User ID is Required"
        })
    }

   

   
        // Validate table exists
        const table = await Table.findById(table_id)
        if (!table) {
            throw new Error("Table not found");
        }

        let subtotal = 0;
        let orderMenuItems = [];

        // Process each order item
        for (const item of order_items) {
            const { menu_id, quantity, set_id } = item;

            // Validate required fields
            if ( !quantity || quantity <= 0) {
                throw new Error("Invalid menu item or quantity");
            }

            if(menu_id){
 // Validate menu item exists and is available
            const menu = await Menu.findById(menu_id);
            if (!menu) {
                throw new Error(`Menu item with ID ${menu_id} not found`);
            }else{
                const itemTotal = menu.price * quantity;
                 subtotal += itemTotal;
            }
           }

            
           if(set_id){
            // Validate set exists and is available
                const set = await Set.findById(set_id)
                if (!set) {
                 throw new Error(`Set with ID ${set_id} not found`);
                }else{
                    const itemTotal = Number(set.price) * quantity
                    subtotal+= itemTotal
                }

            }

            // Calculate subtotal using menu price
            

            // Prepare order menu item
            if(menu_id){
                orderMenuItems.push({
                menu_id :menu_id,
                quantity,
                table_id
            });
            }else{
                orderMenuItems.push({
                set_id :set_id,
                quantity,
                
                table_id
            });
            }
            
        }
        
        // Calculate discount amount from percentage
        const discountAmount = subtotal * (discountPercent / 100);
        // Calculate totals
        const tax_rate = 0.1; // 10% tax
        const tax_amount = subtotal * tax_rate;
        const total = subtotal + tax_amount + service_charge - discountAmount;
        
        // Validate total amount
        if (total < 0) {
            throw new Error("Total amount cannot be negative");
        }

        // Create the main order
        const order =await Order.create({
            time: new Date(),
            user_id,
            reservation_id,
            table_id,
            subtotal,
            tax_amount,
            discount_amount : discountAmount,
            service_charge,
            total
            // order_number will be generated automatically by pre-save hook
        });
        
        

        // Add order_id to each order menu item and create them
        const orderMenuItemsWithOrderId = orderMenuItems.map(item => ({
            ...item,
            order_id: order._id
        }));
        

        if(Array.isArray(orderMenuItemsWithOrderId)){
            for (const item of orderMenuItemsWithOrderId){
             const dataResponse=  await OrderMenu.create({
                    menu_id:item.menu_id?item.menu_id: null,
                    quantity:item.quantity,
                    set_id:item.set_id?item.set_id: null,
                    order_id:item.order_id,
                    table_id:item.table_id
                })
            }
        }
        

       

        // Get order items with populated data
        const orderItemsWithDetails = await OrderMenu.find({ order_id: order._id })
            .populate('menu_id', 'name type price image is_available cloudinary_id')
            .populate('set_id', 'name price  ')
            .populate('table_id', 'table_No capacity ')
            .populate('order_id');

        // Populate the order
        const populatedOrder = await Order.findById(order._id)
            .populate('user_id', 'name email phone role')
            .populate('table_id', 'table_No capacity ');

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: {
                order: populatedOrder,
                order_items: orderItemsWithDetails,
                summary: {
                    order_id: order._id,
                 
                    table_number: table.table_No,
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

    
})

