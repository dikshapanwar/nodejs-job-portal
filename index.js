//api doc
import  SwaggerUi from 'swagger-ui-express';
import swaggerDoc from 'swagger-jsdoc'
//basic
import express from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import color from 'color';
import colors from 'colors';
import cors from 'cors';
import morgan  from 'morgan';
import mongoSanitize from 'express-mongo-sanitize'

//security package
import helmet from "helmet";
//file imports
import connectDB from './config/db.js';

//routes Import
import authRoute from './routes/authRoute.js'
import testRoute from './routes/textRoute.js';
import errorMiddleWare from './middlewares/erroeMiddleWare.js';
import userRoute from './routes/userRoute.js';
import jobroute from './routes/jobRoute.js'
//config
dotenv.config()
//middlewar

//MongoDB connection
connectDB();
//---------------------------------------------------------------------------swagger api config
const options ={
  definition:{
    openapi:"3.0.0",
    info:{
      title:'job -portal',
      description:"Node Expreesjs job portal application"
    },
    servers:[
      {
        url:"http://localhost:3000"
      }
    ]
  },
  apis:["./routes/*.js"]
  
};

const spec= swaggerDoc(options)

//rest object const object
const app = express();
const port = process.env.PORT || 3000

//midelware 
app.use(express.json());
// Use Helmet!
app.use(helmet());
app.use(mongoSanitize())
app.use(cors());
app.use(morgan('dev'));
// route
app.use('/api/v1/test',testRoute)
app.use('/api/v1/auth',authRoute)
app.use('/api/v1/user',userRoute)
app.use('/api/v1/job',jobroute)
//validation of middleware
app.use(errorMiddleWare)
//home route
app.use("/api-doc",SwaggerUi.serve,SwaggerUi.setup(spec))

//set up of server
app.listen(port, () => {
    console.log(`Node Server in ${process.env.DEV_MODE} Mode On Port no ${port}`.bgYellow.white)
  })