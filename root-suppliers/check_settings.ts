import connectDB from "./src/lib/db/connect";
import Settings from "./src/lib/db/models/Settings";

async function checkSettings() {
  await connectDB();
  const settings = await Settings.findOne().lean();
  console.log(JSON.stringify(settings, null, 2));
  process.exit(0);
}

checkSettings();
