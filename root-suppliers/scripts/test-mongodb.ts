/**
 * MongoDB Connection Test Script
 * 
 * Tests if the MongoDB connection string works and if the IP is whitelisted.
 * 
 * Usage:
 * MONGODB_URI="your-connection-string" npx tsx scripts/test-mongodb.ts
 * 
 * Or set MONGODB_URI in .env.local and run from Next.js context
 */

import mongoose from "mongoose";
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

async function testConnection() {
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI environment variable is not set");
    console.log("\nPlease set it in your .env.local file:");
    console.log('MONGODB_URI="mongodb+srv://..."');
    process.exit(1);
  }

  console.log("🔄 Testing MongoDB connection...");
  console.log(`📍 Connection string: ${MONGODB_URI.replace(/\/\/.*:.*@/, '//****:****@')}`);

  try {
    // Set connection timeout
    const options = {
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(MONGODB_URI, options);
    
    console.log("\n✅ Successfully connected to MongoDB Atlas!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`   Database: ${mongoose.connection.db?.databaseName || 'N/A'}`);
    console.log(`   Host: ${mongoose.connection.host}`);
    console.log(`   Connection State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Unknown'}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // List collections
    const collections = mongoose.connection.db ? await mongoose.connection.db.listCollections().toArray() : [];
    console.log(`📦 Found ${collections.length} collection(s):`);
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });

    await mongoose.disconnect();
    console.log("\n✅ Connection test completed successfully!");
    process.exit(0);

  } catch (error: any) {
    console.error("\n❌ MongoDB Connection Failed!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    if (error.message?.includes("IP") || error.message?.includes("whitelist")) {
      console.log("🚫 IP Address Not Whitelisted");
      console.log("\nYour current IP address is not allowed to connect to MongoDB Atlas.");
      console.log("\nTo fix this:");
      console.log("1. Go to https://cloud.mongodb.com/");
      console.log("2. Select your project and cluster");
      console.log("3. Click 'Network Access' in the left sidebar");
      console.log("4. Click 'Add IP Address'");
      console.log("5. Either:");
      console.log("   - Click 'Add Current IP Address' (recommended)");
      console.log("   - Or click 'Allow Access From Anywhere' (0.0.0.0/0 - for development)");
      console.log("6. Click 'Confirm'");
      console.log("7. Wait 1-2 minutes for changes to propagate");
    } else if (error.message?.includes("authentication")) {
      console.log("🔐 Authentication Failed");
      console.log("\nYour username or password is incorrect.");
      console.log("\nCheck your .env.local file:");
      console.log("- Username: musk02029_db_user");
      console.log("- Password: root-suppliers");
      console.log("\nOr create a new database user in MongoDB Atlas:");
      console.log("1. Go to 'Database Access' in the left sidebar");
      console.log("2. Check if user 'musk02029_db_user' exists");
      console.log("3. If not, create a new user with the correct credentials");
    } else {
      console.log("⚠️  Unknown Error");
      console.log(`\nError: ${error.message}`);
    }
    
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    process.exit(1);
  }
}

// Run the test
testConnection();
