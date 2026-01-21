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
      google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    },
  };
}

// Structured data for organization (JSON-LD)
function OrganizationSchema() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Root Suppliers Pvt. Ltd.",
    alternateName: "Root Suppliers",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://rootsuppliers.com.np",
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://rootsuppliers.com.np"}/images/logo.png`,
    description: "Your trusted hardware and construction materials partner in Biratnagar, Nepal. We offer a wide range of construction materials, tools, and equipment.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Main Road, Biratnagar",
      addressLocality: "Biratnagar",
      addressRegion: "Province 1",
      postalCode: "56600",
      addressCountry: "NP",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+977-9851235637",
      contactType: "customer service",
      availableLanguage: ["en", "ne"],
    },
    sameAs: [
      "https://www.facebook.com/rootsuppliers",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// Local Business Schema for better local SEO
function LocalBusinessSchema() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HardwareStore",
    name: "Root Suppliers Pvt. Ltd.",
    image: `${process.env.NEXT_PUBLIC_SITE_URL || "https://rootsuppliers.com.np"}/images/logo.png`,
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://rootsuppliers.com.np",
    telephone: "+977-9851235637",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Main Road, Biratnagar",
      addressLocality: "Biratnagar",
      addressRegion: "Province 1",
      postalCode: "56600",
      addressCountry: "NP",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 26.4525,
      longitude: 87.2718,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <OrganizationSchema />
        <LocalBusinessSchema />
      </head>
      <body className={`antialiased ${bankGothic.variable}`}>{children}</body>
    </html>
  );
}
