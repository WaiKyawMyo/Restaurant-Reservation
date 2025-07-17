import { Router } from "express";
import { getAllMenu } from "../controllers/showMenu";

const router = Router()

router.get('/getMenu',getAllMenu)

export default router;

