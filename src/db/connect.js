import mongoose from "mongoose";

const connectDB = async() => { return mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@policy-scoop-test.sysl387.mongodb.net/?appName=policy-scoop-test`)}

export default connectDB;