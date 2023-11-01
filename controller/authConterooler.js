import userModel from '../models/userModel.js'
export const registerController =async (req, res,next) => {
//   try{
      const {name,email,password}=req.body
      //vallidate
      if(!name){
       next('Name is required')
      }
      if(!email){
        next('Email is required')
      }
      if(!password){
        next('Password is required')
      }
      const existingUser =await userModel.findOne({email})
      if(existingUser){
        next("email already exist")
      }
      const user =await userModel.create({name,email,password})
       //token
      const token = user.createJWT()
      res.status(201).send({
        success:true,
        message:'user  Register ' , 
        user:{
          name:user.name,
          lastName:user. lastName,
          email:user.email,
          locations:user.locations,
        },
        token
    })
//   }
//   catch(error){ 
//     // console.log(error);
//     // res.status(400).send({message:'Error In Register controller',
//     //    success:false,
//     //      error})}
//     next(error)
//   }
    
}

//LOGIN PAGE
export const loginController =async (req, res,next) =>{
const{email,password}=req.body
//validation
if(!email || !password){
  next('Please Provide All Fields')
}
//find by email
const user =await userModel.findOne({email}).select('+password')
if(!user){
  next('Invalid User userName  or Password')
}
//compare password
const isMatch = await user.comparePassword(password)
if(!isMatch){
  next('Invalid User userName  or Password')
}
//passwoerd undefined
user.password = undefined;
//token
const token = user.createJWT()
  res.status(200).json({
    success:true,
    message:"Login Successful",
   
    user,
    token 
  })

}