import { Metadata } from "next";
import ProductsPageContent from "./ProductsPageContent";

export const metadata: Metadata = {
  title: "Products | Root Suppliers",
  description:
    "Browse our extensive catalog of construction materials, hardware, and electrical supplies. Quality products from trusted brands.",
  openGraph: {
    title: "Products | Root Suppliers",
    description:
      "Browse our extensive catalog of construction materials, hardware, and electrical supplies.",
    images: ["/images/og/products.jpg"],
  },
};

export default function ProductsPage() {
  return <ProductsPageContent />;
}
