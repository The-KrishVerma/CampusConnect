import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.connection.on('connected', () => console.log("Database Connected"));
    
    // Connect directly to the provided URI
    const uri = process.env.MONGODB_URI || '';

    cached.promise = mongoose.connect(uri).then((mongoose) => mongoose);
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.log("MongoDB connection error:", error.message);
  }
  
  return cached.conn;
}

export default connectDB;