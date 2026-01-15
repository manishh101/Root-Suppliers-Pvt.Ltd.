
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Register Models
import '../src/lib/db/models/Category';
import '../src/lib/db/models/Product';
import '../src/lib/db/models/Brand';
import '../src/lib/db/models/Settings';

const Category = mongoose.model('Category');
const Product = mongoose.model('Product');
const Brand = mongoose.model('Brand');
const Settings = mongoose.models.Settings || mongoose.model('Settings', new mongoose.Schema({}, { strict: false }));

// Config
const MONGODB_URI = process.env.MONGODB_URI!;
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

async function uploadImage(filePath: string, folder: string, publicId?: string) {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  File not found: ${filePath}`);
      return null;
    }
    // console.log(`📤 Uploading ${path.basename(filePath)} to folder '${folder}'...`); // Reduced log noise
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      public_id: publicId,
      overwrite: true,
      resource_type: 'image',
    });
    return {
      url: result.secure_url,
      publicId: result.public_id,
      alt: publicId || path.basename(filePath, path.extname(filePath)),
    };
  } catch (error) {
    console.error(`❌ Failed to upload ${filePath}:`, error);
    return null;
  }
}

// Data Handling
const brandFiles = [
  { file: 'asianpaints.png', name: 'Asian Paints' },
  { file: 'delta-laminates.png', name: 'Delta Laminates' },
  { file: 'incco.png', name: 'Ingco' },
  { file: 'jagadamba-steel.png', name: 'Jagadamba Steel' },
  { file: 'litmus.png', name: 'Litmus' },
  { file: 'sarvo.png', name: 'Sarvo' },
  { file: 'sika.png', name: 'Sika' },
  { file: 'surya-ply.png', name: 'Surya Ply' },
];

const categoriesData = [
  // 1. Cement & Aggregates
  {
    name: "Cement & Aggregates",
    description: "High-grade cement, sand, and aggregates for strong foundations.",
    icon: "Package",
    subcategories: [
      "OPC Cement 43 Grade",
      "PPC Cement",
      "White Cement",
      "River Sand",
      "Coarse Aggregates (20mm)"
    ]
  },
  // 2. Steel & Structural
  {
    name: "Steel & Structural",
    description: "TMT bars, structural steel, and binding wires for durability.",
    icon: "Wrench",
    subcategories: [
      "Fe 500D TMT Bars",
      "MS Angles & Channels",
      "Binding Wire",
      "Steel Pipes (Square/Round)",
      "Galvanized Sheets"
    ]
  },
  // 3. Bricks & Masonry
  {
    name: "Bricks & Masonry",
    description: "Premium bricks, blocks, and pavers for wall construction.",
    icon: "Box",
    subcategories: [
      "Red Clay Bricks",
      "Fly Ash Bricks",
      "AAC Blocks",
      "Concrete Hollow Blocks",
      "Interlocking Pavers"
    ]
  },
  // 4. Plumbing & Water
  {
    name: "Plumbing & Sanitary",
    description: "Pipes, fittings, tanks, and sanitary ware.",
    icon: "Droplet",
    subcategories: [
      "CPVC Pipes & Fittings",
      "PVC Drainage Pipes",
      "Water Storage Tanks",
      "Bathroom Faucets",
      "Kitchen Sinks"
    ]
  },
  // 5. Electrical & Lighting
  {
    name: "Electrical & Lighting",
    description: "Wires, switches, MCCBs, and LED lighting solutions.",
    icon: "Zap",
    subcategories: [
      "House Wires (FR/FRLS)",
      "Modular Switches",
      "LED Panels & Bulbs",
      "MCB & Distribution Boards",
      "Cable Conduits"
    ]
  },
  // 6. Paints & Finishes
  {
    name: "Paints & Finishes",
    description: "Interior/exterior emulsions, primers, and wall putty.",
    icon: "Paintbrush",
    subcategories: [
      "Interior Emulsion",
      "Exterior Weather Coat",
      "Wall Putty",
      "Metal Enamel Paint",
      "Wood Varnish & Stains"
    ]
  },
  // 7. Flooring & Tiles
  {
    name: "Flooring & Tiling",
    description: "Vitrified tiles, ceramic wall tiles, and flooring solutions.",
    icon: "Grid",
    subcategories: [
      "Double Charged Vitrified Tiles",
      "Ceramic Wall Tiles",
      "Anti-Skid Floor Tiles",
      "Granite Slabs",
      "Marble Flooring"
    ]
  },
  // 8. Doors & Windows
  {
    name: "Doors & Windows",
    description: "Ready-made doors, frames, and window fittings.",
    icon: "DoorOpen",
    subcategories: [
      "Flush Doors",
      "UPVC Windows",
      "Aluminum Sliding Windows",
      "Door Locks & Handles",
      "Plywood Sheets"
    ]
  },
  // 9. Roofing
  {
    name: "Roofing Solutions",
    description: "CGI sheets, polycarbonate sheets, and roofing accessories.",
    icon: "Home",
    subcategories: [
      "Color Coated CGI Sheets",
      "Polycarbonate Sheets",
      "Roofing Screws & Washers",
      "Rainwater Gutters",
      "Fiberglass Sheets"
    ]
  },
  // 10. Tools & Machinery
  {
    name: "Tools & Equipment",
    description: "Power tools, hand tools, and construction machinery.",
    icon: "Hammer",
    subcategories: [
      "Power Drills & Drivers",
      "Angle Grinders",
      "Hand Tool Sets",
      "Measuring Tapes & Levels",
      "Concrete Mixers"
    ]
  },
  // 11. Waterproofing & Adhesives
  {
    name: "Waterproofing & Adhesives",
    description: "Tile adhesives, waterproofing chemicals, and epoxies.",
    icon: "Droplets",
    subcategories: [
      "Tile Adhesive (Polymer Modified)",
      "Roof Waterproofing Compounds",
      "Epoxy Grouts",
      "Silicone Sealants",
      "Crack Fillers"
    ]
  },
  // 12. Safety & PPE
  {
    name: "Safety & PPE",
    description: "Helmets, safety shoes, gloves, and reflective jackets.",
    icon: "Shield",
    subcategories: [
      "Industrial Safety Helmets",
      "Safety Shoes (Steel Toe)",
      "Construction Gloves",
      "Reflective Vests",
      "Dust Masks & Goggles"
    ]
  }
];

// Product adjectives to generate variety
const adjectives = ["Premium", "Durable", "Heavy Duty", "Industrial Grade", "Eco-Friendly", "High Strength", "Weather Resistant", "Professional"];

async function seed() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected.");

    // 1. Upload Assets
    console.log("\n🚀 Starting Asset Uploads (This might take a moment)...");

    // Upload Brands
    const brandMap: Record<string, any> = {};
    for (const b of brandFiles) {
      const res = await uploadImage(path.join(process.cwd(), 'public/images/brands', b.file), 'brands', b.name.toLowerCase().replace(/[^a-z0-9]/g, '-'));
      if (res) brandMap[b.name] = { ...res, name: b.name, slug: b.name.toLowerCase().replace(/[^a-z0-9]/g, '-') };
    }

    // Upload Products (Generic)
    const productImages = [];
    const productFiles = ['image1.png', 'image2.png', 'image3.png', 'image4.png', 'image5.png', 'image6.png'];
    for (const p of productFiles) {
      const res = await uploadImage(path.join(process.cwd(), 'public/images/products', p), 'products');
      if (res) productImages.push(res);
    }

    // Upload Hero
    const heroImages = [];
    const heroFiles = ['hero.png', 'hero1.png'];
    for (const h of heroFiles) {
      const res = await uploadImage(path.join(process.cwd(), 'public/images/hero', h), 'hero');
      if (res) heroImages.push(res);
    }

    // Upload Logo
    const logoRes = await uploadImage(path.join(process.cwd(), 'public/images/logo.png'), 'static', 'logo');


    // 2. Clear Database
    console.log("\n🗑️  Clearing Database...");
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Brand.deleteMany({});

    // 3. Seed Brands
    console.log("\n🌱 Seeding Brands...");
    const createdBrands = [];
    for (const key in brandMap) {
      const b = brandMap[key];
      const brand = await Brand.create({
        name: b.name,
        slug: b.slug,
        logo: { url: b.url, publicId: b.publicId },
        isActive: true
      });
      createdBrands.push(brand);
    }
    console.log(`✅ Seeded ${createdBrands.length} brands.`);

    // 4. Seed Categories & Products
    console.log("\n🌱 Seeding Categories & Products...");

    let totalCats = 0;
    let totalSubs = 0;
    let totalProds = 0;

    for (const catData of categoriesData) {
      const randomCatImg = productImages[Math.floor(Math.random() * productImages.length)];

      const parent = await Category.create({
        name: catData.name,
        description: catData.description,
        icon: catData.icon,
        image: { url: randomCatImg?.url, publicId: randomCatImg?.publicId, alt: catData.name },
        slug: catData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        isActive: true,
        isFeatured: true
      });
      totalCats++;

      for (const subName of catData.subcategories) {
        const randomSubImg = productImages[Math.floor(Math.random() * productImages.length)];
        const subSlug = subName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        const sub = await Category.create({
          name: subName,
          parent: parent._id,
          slug: subSlug,
          image: { url: randomSubImg?.url, publicId: randomSubImg?.publicId, alt: subName },
          isActive: true,
          isFeatured: false
        });
        totalSubs++;

        // Products (5-6 products per subcategory)
        const numProducts = 5 + Math.floor(Math.random() * 2); // 5 or 6
        for (let i = 0; i < numProducts; i++) {
          const pImg = productImages[Math.floor(Math.random() * productImages.length)];
          const pBrand = createdBrands[Math.floor(Math.random() * createdBrands.length)];
          const adj = adjectives[Math.floor(Math.random() * adjectives.length)];

          await Product.create({
            name: `${adj} ${subName} - Type ${String.fromCharCode(65 + i)}`,
            slug: `${subSlug}-type-${String.fromCharCode(65 + i).toLowerCase()}-${Math.floor(Math.random() * 1000)}`,
            description: `This ${adj.toLowerCase()} ${subName.toLowerCase()} is perfect for your construction needs. Manufactured by ${pBrand?.name || 'industry leaders'}, it ensures longevity and reliability.`,
            shortDescription: `${adj} ${subName} for professional use.`,
            price: 500 + Math.floor(Math.random() * 15000),
            discountPrice: Math.random() > 0.7 ? (500 + Math.floor(Math.random() * 15000)) * 0.9 : undefined,
            category: sub._id,
            brand: pBrand?._id,
            images: [{ url: pImg?.url, publicId: pImg?.publicId, alt: `${subName} product` }],
            isActive: true,
            isFeatured: Math.random() > 0.85,
            isNew: Math.random() > 0.7,
            stock: 50 + Math.floor(Math.random() * 500)
          });
          totalProds++;
        }
      }
    }

    console.log(`✅ Seeded ${totalCats} Parent Categories.`);
    console.log(`✅ Seeded ${totalSubs} Subcategories.`);
    console.log(`✅ Seeded ${totalProds} Products.`);

    // 5. Seed Settings
    console.log("\n⚙️  Updating Settings...");
    let settings = await Settings.findOne({});
    if (!settings) settings = new Settings({});

    settings.site = settings.site || {};
    if (logoRes) {
      settings.site.logo = { url: logoRes.url, publicId: logoRes.publicId };
    }

    settings.homepage = settings.homepage || {};
    settings.homepage.heroSlides = heroImages.map((h, idx) => ({
      image: { url: h.url, publicId: h.publicId },
      title: idx === 0 ? "Root Suppliers" : "Building The Future",
      subtitle: idx === 0 ? "All Construction Solutions Under One Roof" : "Quality materials for every project",
      ctaText: "Shop Catalog",
      ctaLink: "/categories"
    }));

    await settings.save();
    console.log("✅ Settings updated.");

    console.log("\n🎉 EXPANDED SEEDING COMPLETE!");
    process.exit(0);

  } catch (e) {
    console.error("Critical Error:", e);
    process.exit(1);
  }
}

seed();
