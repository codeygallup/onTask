import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/ontaskDB");

export const db = mongoose.connection;
