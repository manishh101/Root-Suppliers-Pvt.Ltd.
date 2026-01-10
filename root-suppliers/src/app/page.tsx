import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
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
    const brands = await Brand.find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .lean();
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

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <HeroCarousel topProducts={topProducts} />

        {/* Top Brands */}
        <TopBrands brands={brands} />

        {/* Featured Products */}
        <FeaturedProducts products={featuredProducts} />

        {/* CTA Section */}
        <CTASection />

        {/* Categories */}
        <CategoriesSection categories={categories} />

        {/* About Section */}
        <AboutSection />

        {/* Stats Section */}
        <StatsSection />

        {/* Testimonials */}
        <TestimonialsSectionStatic />

        {/* Visit Us / Map Section */}
        <VisitUsSection />
      </main>
      <Footer />
    </>
  );
}
