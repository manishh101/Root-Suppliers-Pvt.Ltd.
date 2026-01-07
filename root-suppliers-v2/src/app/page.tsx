import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  HeroCarousel,
  TopBrandsStatic,
  FeaturedProductsStatic,
  CategoriesSectionStatic,
  AboutSection,
  StatsSection,
  TestimonialsSectionStatic,
  CTASection,
  VisitUsSection,
} from "@/components/sections";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <HeroCarousel />

        {/* Top Brands */}
        <TopBrandsStatic />

        {/* Featured Products */}
        <FeaturedProductsStatic />

        {/* Categories */}
        <CategoriesSectionStatic />

        {/* About Section */}
        <AboutSection />

        {/* Stats Section */}
        <StatsSection />

        {/* Testimonials */}
        <TestimonialsSectionStatic />

        {/* Visit Us / Map Section */}
        <VisitUsSection />

        {/* CTA Section */}
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
