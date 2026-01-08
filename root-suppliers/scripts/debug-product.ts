
import dotenv from "dotenv";
import path from "path";
import connectDB from "../src/lib/db/connect";
import Product from "../src/lib/db/models/Product";
import Category from "../src/lib/db/models/Category";
import Brand from "../src/lib/db/models/Brand";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

async function debugProduct() {
  try {
    await connectDB();
    const slug = "safety-helmets-product-3";
    console.log(`🔍 Searching for product with slug: ${slug}`);

    const product = await Product.findOne({ slug }).lean();

    if (!product) {
      console.log("❌ Product not found!");
    } else {
      console.log("✅ Product found:");
      console.log(JSON.stringify(product, null, 2));
    }
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

debugProduct();
