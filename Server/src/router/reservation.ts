import { Router } from "express";
import { Available, getReservedSlots, myReservationGet, removeReservation, ReservationTable } from "../controllers/reservation";
import authMiddleware from "../middleware/authMiddleware";

const route = Router()


route.get('/getTable',Available)
route.post('/reservation',ReservationTable)
route.get('/reservations/slots', getReservedSlots)
route.get('/my-reservatoin',authMiddleware,myReservationGet)
route.delete('/delete-reservation',removeReservation)
export default route