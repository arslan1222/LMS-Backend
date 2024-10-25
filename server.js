import { v2 } from 'cloudinary';
import app from './app.js';
import connectDB from './config/connectDB.js';
import cloudinary from "cloudinary";

const PORT = process.env.PORT;

// Cloudinary COnfiguration

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

app.listen(PORT, async ()=>{
    await connectDB();
    console.log(`Server is running at ${PORT}`);
    
})