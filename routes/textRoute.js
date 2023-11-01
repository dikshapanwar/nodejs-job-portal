import express from "express";
import { testPostController } from "../controller/testControler.js";
import userAuth from "../middlewares/authMiddleWare.js"
//router  object create 
const router =express.Router()

//routes
router.post("/test-post", userAuth,testPostController)





//export 
export default router