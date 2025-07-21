import { Router } from "express";
import { getAllMenu } from "../controllers/showMenu";
import { createOrder } from "../controllers/reservation";
import authMiddleware from "../middleware/authMiddleware";

const router = Router()

router.get('/getMenu',getAllMenu)
router.post('/createOrder', authMiddleware,createOrder)

export default router;

