import mongoose from 'mongoose'

const connectdb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL||DATABASE_URL, {
          
        });
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection error:", error);
    }
};
export default connectdb;

