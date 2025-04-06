import dotenv from 'dotenv';
import connectDB from './config/db.js';
import {app} from './app.js';
import { Server } from 'socket.io';
import  { createServer } from 'http';

dotenv.config({path: './env'});
console.log(process.env)
connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, ()=> {
            console.log(`Server is running at port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(`error in connection DB`, err);
    })

const server = createServer(app);
// Attach Socket.IO to the server
const io = new Server(server, {
  cors: {
    origin: '*', // your React frontend URL in prod
    methods: ['GET', 'POST'],
  },
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('🔌 A user connected');

  socket.on('disconnect', () => {
    console.log('❌ A user disconnected');
  });
});
// i tried but its giving unaccesiblity error FFS
// const Env = {
//     mongoDb_URI: process.env.MONGODB_URI,
//     accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY,
//     accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
//     refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY,
//     refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
//     cloudinarySecret: process.env.CLOUDNARY_APISECRET,
//     cloudinaryApiKey: process.env.CLOUDINARY_APIKEY,
//     cloudinaryCloudName: process.env.CLOUDINARY_CLOUDNAME,
// }

