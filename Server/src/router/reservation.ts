import { Router } from "express";
import { Available, getReservedSlots, myReservationGet, ReservationTable } from "../controllers/reservation";
import authMiddleware from "../middleware/authMiddleware";

const route = Router()


route.get('/getTable',Available)
route.post('/reservation',ReservationTable)
route.get('/reservations/slots', getReservedSlots)
route.get('/my-reservatoin',authMiddleware,myReservationGet)
export default route