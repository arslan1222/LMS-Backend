import mongoose from "mongoose";

const MONGO_DB = 'mongodb://127.0.0.1:27017/lms';

// By using then

// function connectDB(){
//    return mongoose.connect(MONGO_DB);
// }

// connectDB().then(() => {
//     console.log("DB Connected Successfully!");
// }).catch((error) => {
//     console.log("DB Connection Failed!", error);
// });

// By using try catch
async function connectDB(){

    try {
        const cenncetion = await mongoose.connect(MONGO_DB);
        if(cenncetion){
        console.log("DB connected successfully!");
    }   
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}


export default connectDB;