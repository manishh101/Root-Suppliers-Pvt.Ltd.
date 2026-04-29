import { Metadata } from "next";
import CategoriesClient from "./CategoriesClient";

export const metadata: Metadata = {
  title: "Product Categories",
  description:
    "Browse our wide range of construction materials, hardware, tools, and equipment categories. Find exactly what you need at our company",
  openGraph: {
    title: "Product Categories",
    description:
      "Browse construction materials, hardware, tools, and equipment categories with us.",
  },
  keywords: "construction categories, hardware categories, building materials, tools categories, equipment Nepal",
};

export default function CategoriesPage() {
  return <CategoriesClient />;
}
