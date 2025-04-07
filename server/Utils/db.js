import mongoose from "mongoose";

const connectToDB = async () =>{
    try{
        await mongoose.connect(process.env.DATABASE_URL, {});
        console.log("Connected to MongoDB");
    }
    catch(error){
        return error
    }
}

export default connectToDB