import { Metadata } from "next";
import {
  HeroCarousel,
  TopBrands,
  FeaturedProducts,
  CategoriesSection,
  CategoriesSectionStatic,
  AboutSection,
  StatsSection,
  TestimonialsSectionStatic,
  CTASection,
  VisitUsSection,
} from "@/components/sections";
import connectDB from "@/lib/db/connect";
import Product from "@/lib/db/models/Product";
import Category from "@/lib/db/models/Category";
import Brand from "@/lib/db/models/Brand";
import Settings from "@/lib/db/models/Settings";

// Home page specific metadata (supplements root layout metadata)
export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};





async function getSettings() {
  try {
    await connectDB();
    const settings = await Settings.findOne().lean();
    if (!settings) return null;
    return JSON.parse(JSON.stringify(settings));
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
}

async function getTopProducts() {
  try {
    await connectDB();
    // Register Category model if not already

    const products = await Product.find({ isTopSelling: true, isActive: true })
      .populate("category", "name slug")
      .sort({ updatedAt: -1 })
      .limit(8)
      .lean();

    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Error fetching top products:", error);
    return [];
  }
}

async function getFeaturedProducts() {
  try {
    await connectDB();
    // Register Category model if not already

    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate("category", "name slug")
      .sort({ updatedAt: -1 })
      .limit(8)
      .lean();

    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

async function getCategories() {
  try {
    await connectDB();
    // Fetch only root categories (parent is null) that are active
    const categories = await Category.find({ parent: null, isActive: true })
      .sort({ orderIndex: 1, name: 1 })
      .limit(8)
      .lean();
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

async function getBrands() {
  try {
    await connectDB();
    // Try to get featured brands first
    let brands = await Brand.find({ isActive: true, isFeatured: true })
      .sort({ order: 1, name: 1 })
      .lean();

    // Fallback to all active brands if no featured brands are found
    if (!brands || brands.length === 0) {
      brands = await Brand.find({ isActive: true })
        .sort({ order: 1, name: 1 })
        .lean();
    }

    return JSON.parse(JSON.stringify(brands));
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
}

export default async function Home() {
  const topProducts = await getTopProducts();
  const featuredProducts = await getFeaturedProducts();
  const categories = await getCategories();
  const brands = await getBrands();
  const settings = await getSettings();

  const heroSlides = settings?.homepage?.heroSlides || [];
  const stats = settings?.homepage?.stats || [];

  return (
    <>
      {/* Hero Section */}
      <HeroCarousel topProducts={topProducts} heroSlides={heroSlides} />



      {/* Featured Products */}
      <FeaturedProducts products={featuredProducts} />

      {/* CTA Section */}
      <CTASection />

      {/* Top Brands */}
      <TopBrands brands={brands} />

      {/* Categories */}
      <CategoriesSection categories={categories} />

      {/* About Section */}
      <AboutSection />

      {/* Stats Section */}
      <StatsSection stats={stats} />

      {/* Testimonials */}
      <TestimonialsSectionStatic />

      {/* Visit Us / Map Section */}
      <VisitUsSection />
    </>
  );
}

