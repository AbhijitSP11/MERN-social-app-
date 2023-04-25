import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from 'dotenv';
import mongoose from 'mongoose'
import multer from "multer"
import helmet from "helmet"
import morgan from "morgan"
import path from "path"
import { fileURLToPath } from "url"
import {register } from './controllers/auth'
import authRoutes from './routes/auth'


/* Configurations : Middleware config */

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express()
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}))
app.use(morgan("common"))
app.use(bodyParser.json({limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true }))
app.use(cors())
app.use("/assets", express.static(path.join(__dirname, 'public/assets')))


/*File Storage */

const storage = multer.diskStorage({
    destination: function( req, file, cb){
        cb(null, "public/assets")
    }, 
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
});

const upload = multer({storage})

/* Routes with files */
app.post("/auth/register", upload.single("picture"), register);  //Upload the picture locally and is the middleware. Register is the controller  

/*Routes*/
app.use("/auth", authRoutes)

/* Setting Mongoose */
const PORT = process.env.PORT || 6001;
mongoose
  .connect('mongodb+srv://abhijit:Abhi1234@cluster0.vwcouhs.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));

