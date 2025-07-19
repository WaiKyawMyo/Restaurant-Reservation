import { Router } from "express";
import { getAllMenu } from "../controllers/showMenu";
import { createOrder } from "../controllers/reservation";

const router = Router()

router.get('/getMenu',getAllMenu)
router.post('/createOrder',createOrder)

export default router;

