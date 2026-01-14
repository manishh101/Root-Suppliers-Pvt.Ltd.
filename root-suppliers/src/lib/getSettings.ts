import connectDB from "@/lib/db/connect";
import Settings from "@/lib/db/models/Settings";

export async function getSettings() {
  try {
    await connectDB();
    const settings = await Settings.findOne().lean();
    if (!settings) return null;
    return JSON.parse(JSON.stringify(settings));
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
}
