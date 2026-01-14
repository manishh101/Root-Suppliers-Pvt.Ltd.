import { getSettings } from "@/lib/getSettings";
import ContactContent from "./ContactContent";

export default async function ContactPage() {
  const settings = await getSettings();
  return <ContactContent settings={settings} />;
}
