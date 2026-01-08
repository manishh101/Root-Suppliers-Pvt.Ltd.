import dotenv from "dotenv";
import path from "path";
import connectDB from "../src/lib/db/connect";
import Category from "../src/lib/db/models/Category";
import Product from "../src/lib/db/models/Product";
import Brand from "../src/lib/db/models/Brand";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const categories = [
  // Building Materials
  {
    name: "Cement & Concrete",
    description: "Premium cement, concrete mixes, and related materials for all construction needs",
    icon: "Package",
    subcategories: [
      { name: "Portland Cement", description: "Standard and specialized Portland cement" },
      { name: "Ready Mix Concrete", description: "Pre-mixed concrete solutions" },
      { name: "Concrete Blocks", description: "Various sizes of concrete blocks" },
      { name: "Cement Additives", description: "Admixtures and strengthening agents" }
    ]
  },
  {
    name: "Steel & Metals",
    description: "High-quality steel bars, sheets, and metal products",
    icon: "Wrench",
    subcategories: [
      { name: "TMT Bars", description: "Thermo-mechanically treated reinforcement bars" },
      { name: "Steel Angles", description: "L-shaped structural steel" },
      { name: "Steel Channels", description: "C and U-shaped steel sections" },
      { name: "Metal Sheets", description: "Galvanized and plain steel sheets" },
      { name: "Wire Mesh", description: "Welded and woven wire mesh" }
    ]
  },
  {
    name: "Bricks & Blocks",
    description: "Traditional and modern bricks for all construction requirements",
    icon: "Box",
    subcategories: [
      { name: "Red Clay Bricks", description: "Traditional fired clay bricks" },
      { name: "Fly Ash Bricks", description: "Eco-friendly alternative bricks" },
      { name: "AAC Blocks", description: "Autoclaved aerated concrete blocks" },
      { name: "Solid Concrete Blocks", description: "Standard concrete building blocks" }
    ]
  },
  {
    name: "Plumbing & Sanitary",
    description: "Complete plumbing solutions and sanitary ware",
    icon: "Droplet",
    subcategories: [
      { name: "PVC Pipes", description: "Durable PVC piping systems" },
      { name: "CPVC Pipes", description: "Hot water resistant piping" },
      { name: "Sanitary Ware", description: "Toilets, basins, and fixtures" },
      { name: "Plumbing Fittings", description: "Connectors, valves, and accessories" },
      { name: "Water Tanks", description: "Overhead and underground storage" }
    ]
  },
  {
    name: "Electrical & Wiring",
    description: "Electrical cables, switches, and lighting solutions",
    icon: "Zap",
    subcategories: [
      { name: "Electrical Cables", description: "Copper and aluminum wiring" },
      { name: "Switches & Sockets", description: "Modular switches and power points" },
      { name: "MCB & Distribution", description: "Circuit breakers and DB boxes" },
      { name: "LED Lighting", description: "Energy-efficient lighting solutions" },
      { name: "Conduits & Accessories", description: "Cable management systems" }
    ]
  },
  {
    name: "Paints & Coatings",
    description: "Interior and exterior paints, primers, and finishes",
    icon: "Paintbrush",
    subcategories: [
      { name: "Interior Emulsion", description: "Smooth finish emulsion paints" },
      { name: "Exterior Paints", description: "Weather-resistant coatings" },
      { name: "Wood Finishes", description: "Stains, varnishes, and polishes" },
      { name: "Primers & Putty", description: "Surface preparation materials" }
    ]
  },
  {
    name: "Tiles & Flooring",
    description: "Ceramic, vitrified, and natural stone tiles",
    icon: "Grid3x3",
    subcategories: [
      { name: "Ceramic Tiles", description: "Glazed ceramic floor and wall tiles" },
      { name: "Vitrified Tiles", description: "High-strength polished tiles" },
      { name: "Natural Stone", description: "Marble, granite, and slate" },
      { name: "Wooden Flooring", description: "Engineered and laminate wood" },
      { name: "Floor Tile Adhesives", description: "Grouts and fixing materials" }
    ]
  },
  {
    name: "Hardware & Tools",
    description: "Construction hardware and professional tools",
    icon: "Hammer",
    subcategories: [
      { name: "Power Tools", description: "Drills, saws, and grinders" },
      { name: "Hand Tools", description: "Hammers, screwdrivers, and wrenches" },
      { name: "Locks & Handles", description: "Door hardware and security" },
      { name: "Fasteners", description: "Screws, nails, and bolts" }
    ]
  },
  {
    name: "Doors & Windows",
    description: "Wooden, aluminum, and UPVC doors and windows",
    icon: "DoorOpen",
    subcategories: [
      { name: "Wooden Doors", description: "Solid and engineered wood doors" },
      { name: "UPVC Windows", description: "Energy-efficient window systems" },
      { name: "Aluminum Frames", description: "Lightweight and durable frames" },
      { name: "Door Hardware", description: "Hinges, locks, and handles" }
    ]
  },
  {
    name: "Roofing Materials",
    description: "Roofing sheets, tiles, and waterproofing solutions",
    icon: "Home",
    subcategories: [
      { name: "Metal Roofing Sheets", description: "Galvanized corrugated sheets" },
      { name: "Clay Roof Tiles", description: "Traditional terracotta tiles" },
      { name: "Polycarbonate Sheets", description: "Transparent roofing panels" },
      { name: "Waterproofing Materials", description: "Membranes and sealants" }
    ]
  },
  {
    name: "Adhesives & Sealants",
    description: "Construction adhesives, silicones, and bonding agents",
    icon: "Droplets",
    subcategories: [
      { name: "Tile Adhesives", description: "Ceramic and stone fixing compounds" },
      { name: "Silicone Sealants", description: "Waterproof joint sealants" },
      { name: "Wood Adhesives", description: "PVA and polyurethane glues" },
      { name: "Construction Chemicals", description: "Bonding and repair compounds" }
    ]
  },
  {
    name: "Safety Equipment",
    description: "Personal protective equipment and safety gear",
    icon: "Shield",
    subcategories: [
      { name: "Safety Helmets", description: "Hard hats and bump caps" },
      { name: "Safety Shoes", description: "Steel toe and slip-resistant" },
      { name: "Gloves & Masks", description: "Hand and respiratory protection" },
      { name: "Safety Harness", description: "Fall protection equipment" }
    ]
  }
];

const brands = [
  { name: "UltraSteel", slug: "ultrasteel", logo: { url: "https://placehold.co/200x200", publicId: "brands/ultrasteel" } },
  { name: "BuildPro", slug: "buildpro", logo: { url: "https://placehold.co/200x200", publicId: "brands/buildpro" } },
  { name: "TechMix", slug: "techmix", logo: { url: "https://placehold.co/200x200", publicId: "brands/techmix" } },
  { name: "SafeWear", slug: "safewear", logo: { url: "https://placehold.co/200x200", publicId: "brands/safewear" } },
  { name: "PowerMax", slug: "powermax", logo: { url: "https://placehold.co/200x200", publicId: "brands/powermax" } },
  { name: "EcoBlocks", slug: "ecoblocks", logo: { url: "https://placehold.co/200x200", publicId: "brands/ecoblocks" } },
  { name: "AquaFlow", slug: "aquaflow", logo: { url: "https://placehold.co/200x200", publicId: "brands/aquaflow" } },
  { name: "BrightLite", slug: "brightlite", logo: { url: "https://placehold.co/200x200", publicId: "brands/brightlite" } }
];

const productsPerSubcategory = 6; // Will create 6-7 products per subcategory

async function seedData() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await connectDB();

    console.log("🗑️  Clearing existing data...");
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Brand.deleteMany({});

    console.log("✨ Creating brands...");
    const createdBrands = await Brand.insertMany(brands);
    console.log(`✅ Created ${createdBrands.length} brands`);

    console.log("\\n📦 Creating categories and subcategories...");
    let totalProducts = 0;

    for (const categoryData of categories) {
      // Select a random image for category
      const categoryImages = [
        "/images/products/image.png",
        "/images/products/image copy.png",
        "/images/products/image copy 2.png",
        "/images/products/image copy 3.png"
      ];

      // Create parent category
      const parentCategory = await Category.create({
        name: categoryData.name,
        description: categoryData.description,
        icon: categoryData.icon,
        image: {
          url: categoryImages[Math.floor(Math.random() * categoryImages.length)],
          publicId: `categories/${categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          alt: categoryData.name
        },
        isActive: true,
        isFeatured: true,
        orderIndex: 0,
      });

      console.log(`\\n✅ Created parent: ${parentCategory.name}`);

      // Create subcategories
      for (let i = 0; i < categoryData.subcategories.length; i++) {
        const subData = categoryData.subcategories[i];
        const subCategory = await Category.create({
          name: subData.name,
          description: subData.description,
          parent: parentCategory._id,
          image: {
            url: categoryImages[Math.floor(Math.random() * categoryImages.length)],
            publicId: `categories/${subData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            alt: subData.name
          },
          isActive: true,
          isFeatured: false,
          orderIndex: i,
        });

        console.log(`  ↳ Created subcategory: ${subCategory.name}`);

        // Create products for this subcategory
        const numProducts = i === 0 ? 7 : productsPerSubcategory; // First subcategory gets 7 products
        const products = [];

        for (let j = 0; j < numProducts; j++) {
          const brand = createdBrands[Math.floor(Math.random() * createdBrands.length)];
          const basePrice = Math.floor(Math.random() * 5000) + 500;
          const hasDiscount = Math.random() > 0.6;

          products.push({
            name: `${subData.name} - Product ${j + 1}`,
            slug: `${subData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-product-${j + 1}`,
            description: `High-quality ${subData.name.toLowerCase()} for construction and renovation projects. Durable, reliable, and cost-effective solution.`,
            shortDescription: `Premium ${subData.name.toLowerCase()} product`,
            category: subCategory._id,
            brand: brand._id,
            price: basePrice,
            discountPrice: hasDiscount ? Math.floor(basePrice * 0.85) : undefined,
            images: [
              {
                url: [
                  "/images/products/image.png",
                  "/images/products/image copy.png",
                  "/images/products/image copy 2.png",
                  "/images/products/image copy 3.png"
                ][Math.floor(Math.random() * 4)],
                publicId: `products/seed-${j}`,
                alt: `${subData.name} Product ${j + 1}`,
              },
            ],
            specifications: [
              { key: "Material", value: "Premium Grade" },
              { key: "Warranty", value: "1 Year" },
              { key: "Origin", value: "India" }
            ],
            stock: Math.floor(Math.random() * 100) + 50,
            isActive: true,
            isFeatured: j === 0,
            isNew: Math.random() > 0.7,
          });
        }

        const createdProducts = await Product.insertMany(products);
        totalProducts += createdProducts.length;
        console.log(`    ✓ Added ${createdProducts.length} products`);
      }
    }

    console.log("\\n✅ Seeding completed successfully!");
    console.log(`\\n📊 Summary:`);
    console.log(`  • Categories: ${categories.length} parent categories`);
    console.log(`  • Subcategories: ${categories.reduce((sum, c) => sum + c.subcategories.length, 0)}`);
    console.log(`  • Products: ${totalProducts}`);
    console.log(`  • Brands: ${createdBrands.length}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
}

seedData();
