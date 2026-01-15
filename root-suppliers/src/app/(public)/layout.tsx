import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import connectDB from "@/lib/db/connect";
import Settings from "@/lib/db/models/Settings";

async function getSettings() {
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

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <div className="public-font-theme">
      <Header settings={settings} />
      <main className="min-h-screen pb-16 md:pb-0">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
