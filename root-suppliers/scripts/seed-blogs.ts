
import mongoose from "mongoose";
import dotenv from "dotenv";
// Remove static imports that depend on env vars
// import connectDB from "../src/lib/db/connect";
// import Blog from "../src/lib/db/models/Blog";
// import User from "../src/lib/db/models/User";

dotenv.config({ path: ".env.local" });

const sampleImages = [
  "/images/hero/image.png",
  "/images/hero/image copy.png",
  "/images/products/image.png",
  "/images/products/image copy.png",
  "/images/products/image copy 2.png",
  "/images/products/image copy 3.png",
];

const blogTitles = [
  "The Future of Construction: Sustainable Materials",
  "Top 10 Tools Every Contractor Needs",
  "How to Choose the Right Cement for Your Foundation",
  "Safety First: Essential Gear for Construction Sites",
  "Modern Plumbing Solutions for Smart Homes",
  "The Impact of AI in the Construction Industry",
  "Renovation Tips: diverse Styles for 2024",
  "Energy Efficient Building Designs",
  "Understanding Steel Grades for Structural Integrity",
  "Cost Estimation Strategies for Large Projects",
];

const categories = [
  "Sustainability",
  "Tools",
  "Materials",
  "Safety",
  "Plumbing",
  "Technology",
  "Renovation",
  "Design",
  "Structure",
  "Management",
];

async function seedBlogs() {
  try {
    // Dynamic imports to ensure env vars are loaded
    const { default: connectDB } = await import("../src/lib/db/connect");
    const { default: Blog } = await import("../src/lib/db/models/Blog");
    const { default: User } = await import("../src/lib/db/models/User");

    console.log("Connecting to database...");
    await connectDB();
    console.log("Connected.");

    // Find an author (admin or first user)
    const author = await User.findOne({});
    if (!author) {
      console.error("No users found. Please run seed-admin.ts first.");
      process.exit(1);
    }

    console.log(`Using author: ${author.name} (${author.email})`);

    // Clear existing blogs
    await Blog.deleteMany({});
    console.log("Cleared existing blogs.");

    const blogs = blogTitles.map((title, index) => {
      const imageIndex = index % sampleImages.length;
      return {
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        excerpt: `This is a summary for ${title}. Learn more about the latest trends and best practices in the construction industry.`,
        content: `
          <h2>Introduction</h2>
          <p>Welcome to our comprehensive guide on <strong>${title}</strong>. In this article, we will explore the key aspects that you need to know.</p>
          <p>Construction is an ever-evolving field, and keeping up with ${categories[index].toLowerCase()} is crucial for success.</p>
          <h3>Key Takeaways</h3>
          <ul>
            <li>Understand the basics of ${categories[index].toLowerCase()}.</li>
            <li>Apply best practices for better results.</li>
            <li>Avoid common pitfalls in construction projects.</li>
          </ul>
          <h2>Deep Dive</h2>
          <p>Let's look closer at the details. Efficiency and durability are paramount. By selecting the right resources, you ensure the longevity of your project.</p>
          <blockquote>"Quality means doing it right when no one is looking." - Henry Ford</blockquote>
          <h2>Conclusion</h2>
          <p>We hope this article on ${title} has been helpful. Stay tuned for more updates!</p>
        `,
        featuredImage: {
          url: sampleImages[imageIndex],
          publicId: `local-${index}`, // Placeholder
          alt: title,
        },
        author: author._id,
        isPublished: true,
        publishedAt: new Date(Date.now() - index * 86400000), // 1 day apart
        tags: [categories[index], "Construction", "Tips"],
        viewCount: Math.floor(Math.random() * 1000),
      };
    });

    await Blog.insertMany(blogs);
    console.log(`Successfully seeded ${blogs.length} blog posts.`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding blogs:", error);
    process.exit(1);
  }
}

seedBlogs();
