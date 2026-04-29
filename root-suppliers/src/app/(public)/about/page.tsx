import { Metadata } from "next";
import AboutPageContent from "./AboutPageContent";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about our company, your trusted hardware and construction materials partner in Biratnagar, Nepal since 2010.",
  openGraph: {
    title: "About Us",
    description:
      "Your trusted hardware and construction materials partner in Biratnagar, Nepal since 2010.",
  },
};

export default function AboutPage() {
  return (
    <main className="pt-0">
      <AboutPageContent />
    </main>
  );
}
