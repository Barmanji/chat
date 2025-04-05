import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()
app.use(cors({
 origin: process.env.ORIGIN_KEY_CORS,
 credentials: true
}))

app.use(express.json({limit: '16kb'})) // to parse json data for api requests
app.use(express.urlencoded({extended: true, limit: "16kb"})) // to parse urlencoded data for form submissions
app.use(express.static("public")) // in case of serving static files
app.use(cookieParser()) // populate req.cookies with cookies from the request headers

//routes
// import userRouter from './routes/user.routes.js'
// app.use("/api/v1/user", userRouter)   //USL WILL BE = http://localhost:8000/api/v1/users/register  - good prac for url.
export default {app}

