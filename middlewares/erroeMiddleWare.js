//error middleware ||next function
 const errorMiddleWare =(err,req,res,next) =>{
 console.log(err);
 const defaultError ={
    statusCode:500,
    message:err
 };
//  res.status(500).send({
//     success:false,
//     message:'something went wrong',
//     err,
//  });
 //code misssing field
 if(err.name ==='validationError'){
    defaultError.statusCode = 400
    defaultError.message = Object.values(err.errors)
    .map(item => item.message)
    .join(",")
 }
 //duplicateerror
 if(err.code && err.code ===11000){
    defaultError.statusCode =400
    defaultError.message = `${Object.keys(err.keyValue)} feild had to be unique`
 }
 res.status(defaultError.statusCode).json({message : defaultError.message} )
 }
 export default errorMiddleWare