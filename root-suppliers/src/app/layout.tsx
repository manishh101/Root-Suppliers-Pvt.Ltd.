import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Root Suppliers - All Construction Solutions Under One Roof",
    template: "%s | Root Suppliers",
  },
  description:
    "Root Suppliers Pvt. Ltd. - Your trusted hardware partner in Biratnagar, Nepal. We offer a wide range of construction materials, tools, and equipment.",
  keywords: [
    "hardware shop",
    "construction materials",
    "Biratnagar",
    "Nepal",
    "building supplies",
    "tools",
    "equipment",
    "Root Suppliers",
  ],
  authors: [{ name: "Root Suppliers Pvt. Ltd." }],
  creator: "Root Suppliers Pvt. Ltd.",
  publisher: "Root Suppliers Pvt. Ltd.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Root Suppliers",
    title: "Root Suppliers - All Construction Solutions Under One Roof",
    description:
      "Your trusted hardware partner in Biratnagar, Nepal. Wide range of construction materials, tools, and equipment.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Root Suppliers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Root Suppliers - All Construction Solutions Under One Roof",
    description:
      "Your trusted hardware partner in Biratnagar, Nepal. Wide range of construction materials, tools, and equipment.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
