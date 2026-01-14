// Seed script to sync current hero slides to the database
// Run with: npx tsx scripts/seed-hero-slides.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI!;

// Define the Settings schema inline to avoid import issues
const SettingsSchema = new mongoose.Schema({
  site: {
    name: { type: String, default: "Root Suppliers" },
    tagline: { type: String, default: "All Construction Solutions Under One Roof" },
    logo: { url: String, publicId: String },
    favicon: { url: String, publicId: String },
  },
  contact: {
    primaryPhone: { type: String, default: "+977-XXX-XXXXXXX" },
    secondaryPhone: String,
    primaryEmail: { type: String, default: "info@rootsuppliers.com.np" },
    secondaryEmail: String,
    address: { type: String, default: "Biratnagar, Nepal" },
    googleMapsEmbed: String,
    googleMapsLink: String,
  },
  social: {
    facebook: String,
    instagram: String,
    youtube: String,
    linkedin: String,
  },
  businessHours: [{ day: String, hours: String }],
  seo: {
    defaultTitle: { type: String, default: "Root Suppliers - All Construction Solutions Under One Roof" },
    defaultDescription: { type: String, default: "Your trusted hardware partner in Biratnagar, Nepal." },
    googleAnalyticsId: String,
  },
  homepage: {
    heroSlides: [{
      image: { url: String, publicId: String },
      title: String,
      subtitle: String,
      ctaText: String,
      ctaLink: String,
    }],
    featuredProductsTitle: { type: String, default: "Featured Products" },
    featuredProductsSubtitle: String,
    aboutSectionContent: String,
    stats: [{ label: String, value: Number, suffix: String }],
  },
}, { timestamps: true });

const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

// Current hero slides to seed
const heroSlides = [
  {
    image: { url: '/images/hero/hero.png', publicId: 'hero-slide-1' },
    title: 'Root Suppliers',
    subtitle: 'All Construction Solutions Under One Roof',
    ctaText: 'View Products',
    ctaLink: '/products',
  },
  {
    image: { url: '/images/hero/hero1.png', publicId: 'hero-slide-2' },
    title: 'Quality Hardware',
    subtitle: 'Construction tools and building materials',
    ctaText: 'Browse Categories',
    ctaLink: '/categories',
  },
];

async function seedHeroSlides() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find or create settings document
    let settings = await Settings.findOne();

    if (!settings) {
      console.log('No settings document found, creating one...');
      settings = new Settings({});
    }

    // Update hero slides
    settings.homepage = settings.homepage || {};
    settings.homepage.heroSlides = heroSlides;

    await settings.save();
    console.log('✅ Hero slides seeded successfully!');
    console.log('Slides added:', heroSlides.length);

  } catch (error) {
    console.error('Error seeding hero slides:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedHeroSlides();
