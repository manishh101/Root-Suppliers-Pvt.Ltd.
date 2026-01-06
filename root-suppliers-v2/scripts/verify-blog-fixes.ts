
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Colors
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function loginAsAdmin() {
  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@rootsuppliers.com",
        password: "Admin@2024!",
      }),
    });
    const data = await response.json();
    if (data.success && response.headers.get("set-cookie")) {
      const tokenMatch = response.headers.get("set-cookie").match(/auth-token=([^;]+)/);
      return tokenMatch ? `auth-token=${tokenMatch[1]}` : null;
    }
    return null;
  } catch (e) {
    console.error("Login failed", e);
    return null;
  }
}

async function verify() {
  console.log("Starting verification...");
  const cookie = await loginAsAdmin();
  if (!cookie) {
    log("Failed to login", colors.red);
    process.exit(1);
  }

  // 1. Verify Author in List
  console.log("\nVerifying Author in Blog List...");
  const listRes = await fetch(`${API_BASE}/api/blogs`, {
    headers: { Cookie: cookie }
  });
  const listData = await listRes.json();

  if (listData.success && listData.blogs.length > 0) {
    const firstBlog = listData.blogs[0];
    // Check if author is populated (is an object with name)
    if (typeof firstBlog.author === 'object' && firstBlog.author.name) {
      log(`✓ Author populated in list: ${firstBlog.author.name}`, colors.green);
    } else {
      log(`✗ Author NOT populated in list: ${JSON.stringify(firstBlog.author)}`, colors.red);
      process.exit(1);
    }
  } else {
    log("⚠ No blogs found to verify author list", colors.yellow);
  }

  // 2. Verify Publish Flow
  console.log("\nVerifying Publish Flow...");
  // Create Draft
  const createRes = await fetch(`${API_BASE}/api/blogs`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({
      title: `Verify Publish ${Date.now()}`,
      content: JSON.stringify({ type: "doc", content: [] }),
      excerpt: "Test",
      status: "draft", // Frontend sends 'status' but API expects 'isPublished' boolean, let's verify what API expects
      // Actually based on previous analysis, API expects 'isPublished', but frontend maps status to isPublished.
      // Let's send key data as frontend would send if it matched API, or check if I need to send isPublished directly.
      // Looking at route.ts previously: const { title, content, excerpt, featuredImage, tags, isPublished, metaTitle, metaDescription } = body;
      // So I must send isPublished.
      isPublished: false
    })
  });
  const createData = await createRes.json();
  const slug = createData.blog?.slug;

  if (!slug) {
    log("✗ Failed to create draft blog", colors.red);
    process.exit(1);
  }
  log(`✓ Created draft blog: ${slug}`, colors.green);

  // Publish
  const publishRes = await fetch(`${API_BASE}/api/blogs/${slug}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ isPublished: true })
  });
  const publishData = await publishRes.json();

  if (publishData.success && publishData.blog.isPublished && publishData.blog.publishedAt) {
    log(`✓ Blog published successfully. PublishedAt: ${publishData.blog.publishedAt}`, colors.green);
  } else {
    log(`✗ Failed to publish blog. isPublished: ${publishData.blog?.isPublished}`, colors.red);
    process.exit(1);
  }

  // Cleanup
  await fetch(`${API_BASE}/api/blogs/${slug}`, {
    method: "DELETE",
    headers: { Cookie: cookie }
  });
  log("✓ Cleanup finished", colors.green);
}

verify();
