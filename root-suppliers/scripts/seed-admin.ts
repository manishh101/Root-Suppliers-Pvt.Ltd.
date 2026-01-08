/**
 * Seed Admin User Script
 * 
 * This script creates the first admin user for the Root Suppliers admin panel.
 * 
 * Usage:
 * npx tsx scripts/seed-admin.ts
 * 
 * Or with custom credentials:
 * ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=yourpassword npx tsx scripts/seed-admin.ts
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { readFileSync } from "fs";
import { join } from "path";

// Try to load .env.local manually
let MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  try {
    const envPath = join(process.cwd(), '.env.local');
    const envFile = readFileSync(envPath, 'utf-8');
    const match = envFile.match(/MONGODB_URI=(.+)/);
    if (match) {
      MONGODB_URI = match[1].trim().replace(/^["']|["']$/g, '');
    }
  } catch (err) {
    // .env.local not found or can't be read
  }
}
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@rootsuppliers.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@2024!";
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin User";

// User schema (simplified version)
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "editor"], default: "editor" },
    avatar: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

async function seedAdmin() {
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI environment variable is not set");
    console.log("\nPlease set it in your .env.local file:");
    console.log('MONGODB_URI="mongodb+srv://..."');
    process.exit(1);
  }

  console.log("🔄 Connecting to MongoDB...");

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const User = mongoose.models.User || mongoose.model("User", UserSchema);

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      console.log(`\n⚠️  Admin user already exists with email: ${ADMIN_EMAIL}`);
      console.log("   If you need to reset the password, use the reset-users script.");
      await mongoose.disconnect();
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    // Create admin user
    const admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL.toLowerCase(),
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    console.log("\n✅ Admin user created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   Name: ${ADMIN_NAME}`);
    console.log(`   Role: admin`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n🔐 Login at: http://localhost:3000/admin/login");
    console.log("\n⚠️  IMPORTANT: Change the password after first login!");

    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

seedAdmin();
