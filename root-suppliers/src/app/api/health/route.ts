import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db/connect";

export async function GET() {
  const status = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    database: "offline",
    environment: process.env.NODE_ENV,
    version: "1.0.0",
  };

  try {
    await connectDB();
    const dbStatus = mongoose.connection.readyState;

    // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
    switch (dbStatus) {
      case 1:
        status.database = "online";
        break;
      case 2:
        status.database = "connecting";
        break;
      default:
        status.database = "offline";
    }

    return NextResponse.json(
      { success: true, ...status },
      { status: status.database === "online" ? 200 : 503 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, ...status, error: "Database connection failed" },
      { status: 503 }
    );
  }
}
