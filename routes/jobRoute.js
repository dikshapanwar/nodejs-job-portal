import express from "express";
import userAuth from "../middlewares/authMiddleWare.js";
import { deleteJob, getAllJobs, getByFilters, jobsController, updateJob } from "../controller/jobController.js";
const router = express.Router()

//Routes
router.post("/create-job",userAuth,jobsController)
//get
router.get("/get-job",userAuth,getAllJobs)
//Update || PUT ||PATCH
router.patch("/update-job/:id",userAuth,updateJob)
//delete
router.delete("/delete-job/:id",userAuth,deleteJob)



//JOB START WITH FILTER
router.get("/job-status",userAuth,getByFilters)
//export
export default router