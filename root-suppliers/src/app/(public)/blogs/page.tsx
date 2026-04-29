import { Metadata } from "next";
import BlogsClient from "./BlogsClient";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read our latest blog posts about construction materials, hardware tips, industry trends, and expert advice from our company",
  openGraph: {
    title: "Blog",
    description:
      "Industry insights, construction tips, and expert advice from us.",
  },
  keywords: "construction blog, hardware tips, building materials guide, construction industry Nepal",
};

export default function BlogsPage() {
  return <BlogsClient />;
}
