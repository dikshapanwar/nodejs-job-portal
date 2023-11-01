import jobModel from "../models/jobModel.js"
import mongoose from "mongoose"
import moment from "moment"
export const jobsController =async (req,res,next)=>{
    const {company,position} =req.body
    if(!company ||!position ){
   next("please provide all  fields")
    }
    req.body.createBy = req.user.userId
    const job =await jobModel.create(req.body)
    res.status(200).json({job})
}
//get all 

// export const getAllJobs =async(req,res,next)=>{
//    const jobs =await jobModel.find({createBy:req.user.userId})
//    res.status(200).json({
//     totalJobs :jobs.length,
//     jobs})
// }
export const getAllJobs =async(req,res,next)=>{
    const{status,workType,search,sort}=req.query
    const queryObject ={
        createBy:req.user.userId
    }
    //logic
    if(status  && status !== 'all'){
        queryObject.status =status;
    }
    if(workType && workType !== 'all'){
        queryObject.workType=workType
    }
    if(search){
        queryObject.position ={$regex :search,$options: 'i'}
    }
    let queryResult =jobModel.find(queryObject)
    //sorting
    if(sort ==='latest'){
          queryResult =queryResult.sort('-createdAt')
  
    }
    if(sort ==='oldest'){
        queryResult =queryResult.sort('createdAt')
     }
     if(sort ==='a -z'){
        queryResult =queryResult.sort('position')
     }
     if(sort ==='Z-A'){
        queryResult =queryResult.sort('-position')
     }
     //pagination
     const page =Number(req.query.page) ||1
     const limit =Number(req.query.limit) ||10
     const skip =(page-1)*limit
     queryResult =queryResult.skip(skip).limit(limit)
     //jonbs count
     const totalJobs =await jobModel.countDocuments(queryResult)
     const numOfPage= Math.ceil(totalJobs/limit)
      const jobs =await queryResult;
    res.status(200).json({
     totalJobs,
     jobs,numOfPage})
 }
//-------------------------------------------------------------------------------update
export const updateJob=async(req,res,next)=>{
    const {id} =req.params
    const {company,position} =req.body
    //validation
    if(!company || !position){
        next("please provide all fields")
    }
    //find job
    const job =await jobModel.findOne({_id:id})
    //valid
    if(!job){
        next(`no jobs find this id ${id}`)
    }
    if(!req.user.userId === job.createBy.toString()){
        next('your not authorized to updaet this job')
        return
    }
    const updateJobs =await jobModel.findByIdAndUpdate({_id:id},req.body,{
        new:true,
        runValidators:true,

    })
    res.status(200).json({updateJobs})
    
 }
 //delete
 export const deleteJob=async(req,res,next)=>{
    const {id} =req.params;
    //find job
    const job= await jobModel.findOne({_id:id});
    // validation
   if(!job){
    next(`no jobs find this id ${id}`)
   }
   if(!req.user.userId === job.createBy.toString()){
    next('your not authorized to delete  this job')
    return
}
await job.deleteOne()
res.status(200).json({messgae:"done"})
 };

 //GET ALL BY FILTERS
 export const getByFilters =async(req,res,next)=>{
    const status =await jobModel.aggregate([
        {
            $match:{createBy:new mongoose.Types.ObjectId(req.user.userId)}
            
        },
        {
            $group: { _id: "$status", count: { $sum: "1" } }


        },
]);

//default status
const defaultStutus ={
    pending:status.pending ||0,
    reject:status.reject || 0,
    interview:status.interview ||0
}
//monthly modified
// let monthlyApllication =await jobModel.aggregate([
//     {
//         $match:{createBy:new mongoose.Types.ObjectId(req.user.userId)}
//     },
//     {
//         $group: { _id:"$id",
//         //  year:{ $year: '$createdAt' },
//           month:{ $month: "$createdAt" },
//             count:{
//                 $sum:1,
//              },
//         },
      
//     },
// ])
// monthlyApllication =monthlyApllication.map(item =>{
//     const {_id:{year,month},count}=item
//     const date =moment().month(month-1).year(year).format('MM Y')
//     return{date,count}
// }).reverse();


//status


res.status(200).json({
    totalJobs:status.length,
    defaultStutus
,})
 }

