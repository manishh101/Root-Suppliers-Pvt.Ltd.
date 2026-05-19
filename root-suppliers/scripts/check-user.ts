import mongoose from "mongoose";
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
  const users = await User.find({});
  console.log("Users in DB:");
  console.log(JSON.stringify(users, null, 2));
  await mongoose.disconnect();
}

run();
