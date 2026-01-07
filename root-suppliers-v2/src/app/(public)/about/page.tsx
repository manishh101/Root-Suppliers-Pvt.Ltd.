import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AboutPageContent from "./AboutPageContent";

export const metadata: Metadata = {
  title: "About Us | Root Suppliers - Your Trusted Hardware Partner",
  description:
    "Learn about Root Suppliers Pvt. Ltd., your trusted hardware and construction materials partner in Biratnagar, Nepal since 2010.",
  openGraph: {
    title: "About Us | Root Suppliers",
    description:
      "Your trusted hardware and construction materials partner in Biratnagar, Nepal since 2010.",
  },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-20 lg:pt-32">
        <AboutPageContent />
      </main>
      <Footer />
    </>
  );
}
