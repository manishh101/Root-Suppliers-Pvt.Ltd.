import { Metadata } from "next";
import BlogsClient from "./BlogsClient";

export const metadata: Metadata = {
  title: "Blog | Root Suppliers - Industry Insights & Tips",
  description:
    "Read our latest blog posts about construction materials, hardware tips, industry trends, and expert advice from Root Suppliers Pvt. Ltd.",
  openGraph: {
    title: "Blog | Root Suppliers",
    description:
      "Industry insights, construction tips, and expert advice from Root Suppliers.",
  },
  keywords: "construction blog, hardware tips, building materials guide, construction industry Nepal",
};

export default function BlogsPage() {
  return <BlogsClient />;
}
