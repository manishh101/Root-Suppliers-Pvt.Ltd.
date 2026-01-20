import mongoose from "mongoose";

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI environment variable is not defined!");
    throw new Error(
      "Please define the MONGODB_URI environment variable. Check your .env.local file or hosting platform environment variables."
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB connected successfully");
      return mongoose;
    }).catch((error) => {
      console.error("❌ MongoDB connection failed:", error.message);
      // Check for common issues
      if (error.message.includes("ENOTFOUND") || error.message.includes("getaddrinfo")) {
        console.error("💡 Tip: Check if your MongoDB Atlas cluster hostname is correct.");
      }
      if (error.message.includes("authentication") || error.message.includes("Authentication")) {
        console.error("💡 Tip: Check your MongoDB username and password in MONGODB_URI.");
      }
      if (error.message.includes("IP") || error.message.includes("whitelist") || error.message.includes("network")) {
        console.error("💡 Tip: Add your server IP to MongoDB Atlas Network Access (or use 0.0.0.0/0 for production).");
      }
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
