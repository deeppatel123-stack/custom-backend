import { db_name } from "../constants.js";
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const DB = await mongoose.connect(`${process.env.DB_URL}/${db_name}`)
        console.log("Database connected successfully");
    } catch (error) {
        console.error("ERROR :", error)
        throw error
    }
}

export default connectDB