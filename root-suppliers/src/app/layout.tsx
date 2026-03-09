import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import connectDB from "@/lib/db/connect";
import Settings from "@/lib/db/models/Settings";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { ToastProvider } from "@/components/ui/Toast";

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

async function getSettings() {
  await connectDB();
  const settings = await Settings.findOne().lean();
  if (settings) {
    // Convert _id to string to avoid serialization issues
    // and cast to any to match SafeSettings expectation (ignoring Mongoose Document methods)
    return { ...settings, _id: settings._id.toString() } as any;
  }
  return null;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

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
function OrganizationSchema({ settings }: { settings: any }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings?.site?.name || "Root Suppliers Pvt. Ltd.",
    alternateName: settings?.site?.tagline || "Root Suppliers",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://rootsuppliers.com.np",
    logo: settings?.site?.logo?.url || `${process.env.NEXT_PUBLIC_SITE_URL || "https://rootsuppliers.com.np"}/images/logo.png`,
    description: settings?.seo?.defaultDescription || "Your trusted hardware and construction materials partner in Biratnagar, Nepal. We offer a wide range of construction materials, tools, and equipment.",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings?.contact?.address || "Main Road, Biratnagar",
      addressLocality: "Biratnagar",
      addressRegion: "Province 1",
      postalCode: "56600",
      addressCountry: "NP",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings?.contact?.primaryPhone || "+977-9851235637",
      contactType: "customer service",
      availableLanguage: ["en", "ne"],
    },
    sameAs: [
      settings?.social?.facebook || "https://www.facebook.com/rootsuppliers",
    ].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// Local Business Schema for better local SEO
function LocalBusinessSchema({ settings }: { settings: any }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HardwareStore",
    name: settings?.site?.name || "Root Suppliers Pvt. Ltd.",
    image: settings?.site?.logo?.url || `${process.env.NEXT_PUBLIC_SITE_URL || "https://rootsuppliers.com.np"}/images/logo.png`,
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://rootsuppliers.com.np",
    telephone: settings?.contact?.primaryPhone || "+977-9851235637",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings?.contact?.address || "Main Road, Biratnagar",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  return (
    <html lang="en">
      <head>
        <OrganizationSchema settings={settings} />
        <LocalBusinessSchema settings={settings} />
      </head>
      <body className={`antialiased ${bankGothic.variable}`}>
        <SettingsProvider initialSettings={settings}>
          <ToastProvider>
            {children}
          </ToastProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
