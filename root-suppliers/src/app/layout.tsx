import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import connectDB from "@/lib/db/connect";
import Settings from "@/lib/db/models/Settings";

const bankGothic = localFont({
  src: [
    {
      path: './fonts/bank-gothic.woff',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/bank-gothic.ttf',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-primary',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  await connectDB();
  const settings: any = await Settings.findOne().lean();

  const siteTitle = settings?.site?.name || "Root Suppliers";
  const siteTagline = settings?.site?.tagline || "All Construction Solutions Under One Roof";
  const description = settings?.seo?.defaultDescription || "Root Suppliers Pvt. Ltd. - Your trusted hardware partner in Biratnagar, Nepal. We offer a wide range of construction materials, tools, and equipment.";
  const faviconUrl = settings?.site?.favicon?.url || "/favicon.ico";

  return {
    title: {
      default: `${siteTitle} - ${siteTagline}`,
      template: `%s | ${siteTitle}`,
    },
    description,
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
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "/",
      siteName: siteTitle,
      title: `${siteTitle} - ${siteTagline}`,
      description,
      images: [
        {
          url: "/images/og-image.jpg",
          width: 1200,
          height: 630,
          alt: siteTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteTitle} - ${siteTagline}`,
      description,
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased ${bankGothic.variable}`}>{children}</body>
    </html>
  );
}
