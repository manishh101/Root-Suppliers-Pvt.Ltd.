import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { readFileSync } from "fs";
import { join } from "path";

let MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  try {
    const envPath = join(process.cwd(), '.env.local');
    const envFile = readFileSync(envPath, 'utf-8');
    const match = envFile.match(/MONGODB_URI=(.+)/);
    if (match) {
      MONGODB_URI = match[1].trim().replace(/^["']|["']$/g, '');
    }
  } catch (err) {}
}

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, default: "editor" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

async function run() {
  if (!MONGODB_URI) {
    console.error("No MONGODB_URI");
    process.exit(1);
  }
  await mongoose.connect(MONGODB_URI);
  const User = mongoose.models.User || mongoose.model("User", UserSchema);
  const admin = await User.findOne({ email: "admin@rootsuppliers.com" });
  if (!admin) {
    console.log("No admin user found");
    await mongoose.disconnect();
    return;
  }
  const isMatchAdmin2024 = await bcrypt.compare("Admin@2024!", admin.password);
  const isMatchAdmin123 = await bcrypt.compare("admin123", admin.password);
  console.log("Comparing password hash in DB:");
  console.log("Matches 'Admin@2024!':", isMatchAdmin2024);
  console.log("Matches 'admin123':", isMatchAdmin123);
  await mongoose.disconnect();
}

run();
