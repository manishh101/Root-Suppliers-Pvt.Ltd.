// Seed script to add stats to the database
// Run with: npx tsx scripts/seed-stats.ts

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

// Stats to seed
const stats = [
  { label: "Products", value: 1000, suffix: "+" },
  { label: "Happy Customers", value: 500, suffix: "+" },
  { label: "Trusted Brands", value: 50, suffix: "+" },
  { label: "Years Experience", value: 15, suffix: "+" },
];

async function seedStats() {
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

    // Update stats
    settings.homepage = settings.homepage || {};
    settings.homepage.stats = stats;

    await settings.save();
    console.log('✅ Stats seeded successfully!');
    console.log('Stats added:', JSON.stringify(stats, null, 2));

  } catch (error) {
    console.error('Error seeding stats:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

seedStats();
