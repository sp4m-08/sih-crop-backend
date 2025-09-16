import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();


export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("mongoDB successfully connected!");
        
    } catch (error) {
        console.log("Error in connecting to DB ", error);
        process.exit(1);
    }
}