import { Metadata } from "next";
import CategoriesClient from "./CategoriesClient";

export const metadata: Metadata = {
  title: "Product Categories | Root Suppliers - Browse All Categories",
  description:
    "Browse our wide range of construction materials, hardware, tools, and equipment categories. Find exactly what you need at Root Suppliers Pvt. Ltd.",
  openGraph: {
    title: "Product Categories | Root Suppliers",
    description:
      "Browse construction materials, hardware, tools, and equipment categories at Root Suppliers.",
  },
  keywords: "construction categories, hardware categories, building materials, tools categories, equipment Nepal",
};

export default function CategoriesPage() {
  return <CategoriesClient />;
}
