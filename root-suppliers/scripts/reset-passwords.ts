
import connectDB from "@/lib/db/connect";
import User from "@/lib/db/models/User";

async function resetPasswords() {
  try {
    await connectDB();
    console.log("Connected to DB");

    // Fix Admin
    const adminEmail = "admin@rootsuppliers.com";
    const admin = await User.findOne({ email: adminEmail });
    if (admin) {
      console.log(`Found admin: ${admin.email}`);
      admin.password = "admin123"; // Will be hashed by pre-save
      await admin.save();
      console.log("Admin password reset to 'admin123'");
    } else {
      console.log("Admin not found");
      // Create if missing (fallback)
      await User.create({
        name: "Admin User",
        email: adminEmail,
        password: "admin123",
        role: "admin"
      });
      console.log("Admin created");
    }

    // Fix Editor (Manish)
    const editorEmail = "manishrajbanshi404@gmail.com";
    const editor = await User.findOne({ email: editorEmail });
    if (editor) {
      console.log(`Found editor: ${editor.email}`);
      editor.password = "password123"; // Reset to a known default
      await editor.save();
      console.log("Editor password reset to 'password123'");
    } else {
      console.log("Editor 'manishrajbanshi404@gmail.com' not found");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error resetting passwords:", error);
    process.exit(1);
  }
}

resetPasswords();
