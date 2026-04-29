import { Metadata } from "next";
import { getSettings } from "@/lib/getSettings";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact our company for all your hardware and construction material needs. Visit our store in Biratnagar, Nepal or call us today.",
  openGraph: {
    title: "Contact Us",
    description:
      "Get in touch with Root Suppliers for hardware and construction materials in Biratnagar, Nepal.",
  },
  keywords: "contact us, hardware shop Biratnagar, construction materials Nepal, building supplies contact",
};

export default async function ContactPage() {
  const settings = await getSettings();
  return <ContactContent settings={settings} />;
}
