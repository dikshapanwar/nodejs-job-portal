import userModel from "../models/userModel.js"

export const updateUserController =async (req,res,next)=>{
 const{name,email,lastName,locations} = req.body
 //validation
 if(!name || !email ||!lastName ||!locations){
next("Pleaase Provide all fields")

 }
 const user =await userModel.findOne({_id :req.user.userId})
 user.name =name
 user.lastName =lastName
 user.email= email
 user.locations =locations
//  user.password =password
await user.save()
const token = user.createJWT()
res.status(200).json({
    user,
    token,
})


}
