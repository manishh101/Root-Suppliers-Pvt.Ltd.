import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  HeroCarousel,
  TopBrandsStatic,
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
import Category from "@/lib/db/models/Category"; // Ensure model is registered

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
    const categories = await Category.find({ isActive: true })
      .sort({ orderIndex: 1, name: 1 })
      .lean();
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function Home() {
  const topProducts = await getTopProducts();
  const featuredProducts = await getFeaturedProducts();
  const categories = await getCategories();

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <HeroCarousel topProducts={topProducts} />

        {/* Top Brands */}
        <TopBrandsStatic />

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
