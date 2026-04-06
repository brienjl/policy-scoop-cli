import mongoose from "mongoose";

const connectDB = async() => {
    return mongoose.connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_SERVER}/?appName=${process.env.DB_ENV}`
    )
}

export default connectDB;