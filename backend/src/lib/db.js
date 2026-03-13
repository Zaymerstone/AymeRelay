import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  // named export, so I need curly braces in the import file
  try {
    const { MONGO_URI } = ENV;
    if (!MONGO_URI) throw new Error("MONGO_URI is not set");
    const conn = await mongoose.connect(ENV.MONGO_URI); // connect to the database using our connection string
    console.log("Connected to MONGODB:", conn.connection.host);
  } catch (error) {
    console.error("Error connecting to MONGODB:", error);
    process.exit(1); // 1 status code means fail, 0 means success
    // process is that running server, in my case my backend server, so if db fails to connect, stop the server instantly, because API is useless
  }
};
