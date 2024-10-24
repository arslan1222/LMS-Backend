import app from './app.js';
import connectDB from './config/connectDB.js';

const PORT = process.env.PORT;

app.listen(PORT, async ()=>{
    await connectDB();
    console.log(`Server is running at ${PORT}`);
    
})