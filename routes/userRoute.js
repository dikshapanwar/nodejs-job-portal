import express from "express";
import userAuth from "../middlewares/authMiddleWare.js";
import { updateUserController } from "../controller/userConteroler.js";
const router = express.Router()
//routes
//GET \\USER
 //upadet ||pput
 router.put('/update-user', userAuth,updateUserController)
export default router