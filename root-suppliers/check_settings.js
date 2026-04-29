const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

const SettingsSchema = new mongoose.Schema({
  site: {
    name: String,
    tagline: String,
    establishedYear: String,
  },
}, { strict: false });

const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);

async function checkSettings() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
    const settings = await Settings.findOne().lean();
    console.log(JSON.stringify(settings, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkSettings();
