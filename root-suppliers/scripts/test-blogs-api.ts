/**
 * Blog API Testing Script
 * Tests all blog CRUD operations
 * 
 * Run with: npx tsx scripts/test-blogs-api.ts
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Colors for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSection(title: string) {
  console.log("\n" + "=".repeat(60));
  log(title, colors.bright + colors.blue);
  console.log("=".repeat(60));
}

function logTest(testName: string) {
  log(`\n▶ ${testName}`, colors.cyan);
}

function logSuccess(message: string) {
  log(`✓ ${message}`, colors.green);
}

function logError(message: string) {
  log(`✗ ${message}`, colors.red);
}

function logWarning(message: string) {
  log(`⚠ ${message}`, colors.yellow);
}

// Test data
let authCookie: string = "";
let userId: string = "";
let testBlogSlug: string = "";
let testBlogSlug2: string = "";

// Test counters
let totalTests = 0;
let passedTests = 0;

function incrementTest(passed: boolean) {
  totalTests++;
  if (passed) passedTests++;
}

async function loginAsAdmin() {
  logTest("Login as Admin");
  
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

    if (data.success) {
      // Store user ID
      if (data.user && data.user.id) {
        userId = data.user.id;
      }
      
      // Extract token from Set-Cookie header
      const setCookie = response.headers.get("set-cookie");
      if (setCookie) {
        const tokenMatch = setCookie.match(/auth-token=([^;]+)/);
        if (tokenMatch) {
          authCookie = `auth-token=${tokenMatch[1]}`;
          logSuccess(`Logged in successfully. Cookie extracted.`);
          console.log(`User ID: ${userId}`);
          return true;
        }
      }
      
      logWarning(`Login successful but no token found in cookie.`);
      return false;
    } else {
      logError(`Login failed: ${data.message}`);
      return false;
    }
  } catch (error: any) {
    logError(`Login error: ${error.message}`);
    return false;
  }
}

async function testGetAllBlogs() {
  logTest("GET /api/blogs - Get all blogs");

  try {
    const response = await fetch(`${API_BASE}/api/blogs`);
    const data = await response.json();

    if (data.success) {
      logSuccess(`Fetched ${data.blogs.length} blogs (Page ${data.pagination.page}/${data.pagination.pages})`);
      console.log(`Total: ${data.pagination.total} blogs`);
      incrementTest(true);
      return true;
    } else {
      logError(`Failed: ${data.message}`);
      incrementTest(false);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    incrementTest(false);
    return false;
  }
}

async function testGetPublishedBlogs() {
  logTest("GET /api/blogs?isPublished=true - Get published blogs only");

  try {
    const response = await fetch(`${API_BASE}/api/blogs?isPublished=true`);
    const data = await response.json();

    if (data.success) {
      const allPublished = data.blogs.every((b: any) => b.isPublished);
      if (allPublished) {
        logSuccess(`Fetched ${data.blogs.length} published blogs`);
        incrementTest(true);
        return true;
      } else {
        logError(`Some blogs are not published`);
        incrementTest(false);
        return false;
      }
    } else {
      logError(`Failed: ${data.message}`);
      incrementTest(false);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    incrementTest(false);
    return false;
  }
}

async function testSearchBlogs() {
  logTest("GET /api/blogs?search=test - Search blogs");

  try {
    const response = await fetch(`${API_BASE}/api/blogs?search=test`);
    const data = await response.json();

    if (data.success) {
      logSuccess(`Found ${data.blogs.length} blogs matching "test"`);
      incrementTest(true);
      return true;
    } else {
      logError(`Failed: ${data.message}`);
      incrementTest(false);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    incrementTest(false);
    return false;
  }
}

async function testPagination() {
  logTest("GET /api/blogs?page=1&limit=5 - Test pagination");

  try {
    const response = await fetch(`${API_BASE}/api/blogs?page=1&limit=5`);
    const data = await response.json();

    if (data.success) {
      const correctLimit = data.blogs.length <= 5;
      if (correctLimit) {
        logSuccess(`Pagination working: ${data.blogs.length} blogs on page 1`);
        incrementTest(true);
        return true;
      } else {
        logError(`Pagination not working correctly`);
        incrementTest(false);
        return false;
      }
    } else {
      logError(`Failed: ${data.message}`);
      incrementTest(false);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    incrementTest(false);
    return false;
  }
}

async function testCreateBlog() {
  logTest("POST /api/blogs - Create new blog (draft)");

  const blogData = {
    title: `Test Blog Post ${Date.now()}`,
    content: JSON.stringify({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "This is a test blog post content." }]
        }
      ]
    }),
    excerpt: "This is a test blog post excerpt for testing purposes.",
    author: userId,
    isPublished: false,
    tags: ["test", "automation"],
  };

  try {
    const response = await fetch(`${API_BASE}/api/blogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": authCookie,
      },
      body: JSON.stringify(blogData),
    });

    const data = await response.json();

    if (data.success && data.blog) {
      testBlogSlug = data.blog.slug;
      logSuccess(`Created blog: "${data.blog.title}" (slug: ${testBlogSlug})`);
      console.log(`Status: ${data.blog.isPublished ? 'Published' : 'Draft'}`);
      incrementTest(true);
      return true;
    } else {
      logError(`Failed: ${data.message}`);
      console.log(`Response status: ${response.status}`);
      console.log(`Request body:`, JSON.stringify(blogData, null, 2));
      incrementTest(false);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    incrementTest(false);
    return false;
  }
}

async function testCreatePublishedBlog() {
  logTest("POST /api/blogs - Create published blog");

  const blogData = {
    title: `Published Test Blog ${Date.now()}`,
    content: JSON.stringify({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "This is a published blog post." }]
        }
      ]
    }),
    excerpt: "This is a published blog post for testing.",
    author: userId,
    isPublished: true,
    tags: ["test", "published"],
  };

  try {
    const response = await fetch(`${API_BASE}/api/blogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": authCookie,
      },
      body: JSON.stringify(blogData),
    });

    const data = await response.json();

    if (data.success && data.blog) {
      testBlogSlug2 = data.blog.slug;
      logSuccess(`Created published blog: "${data.blog.title}"`);
      console.log(`Published at: ${data.blog.publishedAt}`);
      incrementTest(true);
      return true;
    } else {
      logError(`Failed: ${data.message}`);
      console.log(`Response status: ${response.status}`);
      console.log(`Request body:`, JSON.stringify(blogData, null, 2));
      incrementTest(false);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    incrementTest(false);
    return false;
  }
}

async function testGetBlogBySlug() {
  logTest(`GET /api/blogs/${testBlogSlug} - Get blog by slug (authenticated)`);

  if (!testBlogSlug) {
    logWarning("Skipping: No blog slug available");
    incrementTest(false);
    return false;
  }

  try {
    const response = await fetch(`${API_BASE}/api/blogs/${testBlogSlug}`, {
      headers: {
        "Cookie": authCookie,
      },
    });
    const data = await response.json();

    if (data.success && data.blog) {
      logSuccess(`Fetched blog: "${data.blog.title}"`);
      console.log(`Author: ${data.blog.author?.name || 'Unknown'}`);
      console.log(`Views: ${data.blog.viewCount || 0}`);
      incrementTest(true);
      return true;
    } else {
      logError(`Failed: ${data.message}`);
      incrementTest(false);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    incrementTest(false);
    return false;
  }
}

async function testUpdateBlog() {
  logTest(`PUT /api/blogs/${testBlogSlug} - Update blog`);

  if (!testBlogSlug) {
    logWarning("Skipping: No blog slug available");
    incrementTest(false);
    return false;
  }

  const updateData = {
    title: `Updated Test Blog ${Date.now()}`,
    excerpt: "This excerpt has been updated for testing purposes.",
  };

  try {
    const response = await fetch(`${API_BASE}/api/blogs/${testBlogSlug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Cookie": authCookie,
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (data.success && data.blog) {
      logSuccess(`Updated blog: "${data.blog.title}"`);
      console.log(`New excerpt: ${data.blog.excerpt.substring(0, 50)}...`);
      incrementTest(true);
      return true;
    } else {
      logError(`Failed: ${data.message}`);
      incrementTest(false);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    incrementTest(false);
    return false;
  }
}

async function testPublishBlog() {
  logTest(`PUT /api/blogs/${testBlogSlug} - Publish draft blog`);

  if (!testBlogSlug) {
    logWarning("Skipping: No blog slug available");
    incrementTest(false);
    return false;
  }

  try {
    const response = await fetch(`${API_BASE}/api/blogs/${testBlogSlug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Cookie": authCookie,
      },
      body: JSON.stringify({ isPublished: true }),
    });

    const data = await response.json();

    if (data.success && data.blog && data.blog.isPublished) {
      logSuccess(`Blog published successfully`);
      console.log(`Published at: ${data.blog.publishedAt}`);
      incrementTest(true);
      return true;
    } else {
      logError(`Failed to publish: ${data.message}`);
      incrementTest(false);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    incrementTest(false);
    return false;
  }
}

async function testUnpublishBlog() {
  logTest(`PUT /api/blogs/${testBlogSlug2} - Unpublish blog`);

  if (!testBlogSlug2) {
    logWarning("Skipping: No second blog slug available");
    incrementTest(false);
    return false;
  }

  try {
    const response = await fetch(`${API_BASE}/api/blogs/${testBlogSlug2}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Cookie": authCookie,
      },
      body: JSON.stringify({ isPublished: false }),
    });

    const data = await response.json();

    if (data.success && data.blog && !data.blog.isPublished) {
      logSuccess(`Blog unpublished successfully`);
      incrementTest(true);
      return true;
    } else {
      logError(`Failed to unpublish: ${data.message}`);
      incrementTest(false);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    incrementTest(false);
    return false;
  }
}

async function testDeleteBlog() {
  logTest(`DELETE /api/blogs/${testBlogSlug} - Delete blog`);

  if (!testBlogSlug) {
    logWarning("Skipping: No blog slug available");
    incrementTest(false);
    return false;
  }

  try {
    const response = await fetch(`${API_BASE}/api/blogs/${testBlogSlug}`, {
      method: "DELETE",
      headers: {
        "Cookie": authCookie,
      },
    });

    const data = await response.json();

    if (data.success) {
      logSuccess(`Deleted blog successfully`);
      incrementTest(true);
      return true;
    } else {
      logError(`Failed: ${data.message}`);
      console.log(`Response status: ${response.status}`);
      console.log(`Response body:`, JSON.stringify(data, null, 2));
      incrementTest(false);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    incrementTest(false);
    return false;
  }
}

async function testDeleteSecondBlog() {
  logTest(`DELETE /api/blogs/${testBlogSlug2} - Delete second blog`);

  if (!testBlogSlug2) {
    logWarning("Skipping: No second blog slug available");
    incrementTest(false);
    return false;
  }

  try {
    const response = await fetch(`${API_BASE}/api/blogs/${testBlogSlug2}`, {
      method: "DELETE",
      headers: {
        "Cookie": authCookie,
      },
    });

    const data = await response.json();

    if (data.success) {
      logSuccess(`Deleted second blog successfully`);
      incrementTest(true);
      return true;
    } else {
      logError(`Failed: ${data.message}`);
      incrementTest(false);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    incrementTest(false);
    return false;
  }
}

async function testUnauthorizedCreate() {
  logTest("POST /api/blogs - Create without authentication (should fail)");

  try {
    const response = await fetch(`${API_BASE}/api/blogs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Unauthorized Blog",
        content: "{}",
        excerpt: "Test",
      }),
    });

    const data = await response.json();

    if (!data.success && response.status === 401) {
      logSuccess(`Correctly rejected unauthorized request`);
      incrementTest(true);
      return true;
    } else {
      logError(`Should have rejected but didn't`);
      incrementTest(false);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    incrementTest(false);
    return false;
  }
}

async function testGetNonExistentBlog() {
  logTest("GET /api/blogs/non-existent-slug - Get non-existent blog");

  try {
    const response = await fetch(`${API_BASE}/api/blogs/non-existent-slug-${Date.now()}`);
    const data = await response.json();

    if (!data.success && response.status === 404) {
      logSuccess(`Correctly returned 404 for non-existent blog`);
      incrementTest(true);
      return true;
    } else {
      logError(`Should have returned 404`);
      incrementTest(false);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    incrementTest(false);
    return false;
  }
}

async function testGetDraftBlogWithoutAuth() {
  logTest("GET /api/blogs/:slug - Get draft blog without auth (should fail)");

  if (!testBlogSlug) {
    logWarning("Skipping: No blog slug available");
    return;
  }

  try {
    // Try to fetch the draft blog without authentication
    const response = await fetch(`${API_BASE}/api/blogs/${testBlogSlug}`);
    const data = await response.json();

    if (!data.success && response.status === 404) {
      logSuccess(`Correctly returned 404 for draft blog without auth`);
      incrementTest(true);
      return true;
    } else {
      logError(`Should have returned 404 for draft blog`);
      incrementTest(false);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    incrementTest(false);
    return false;
  }
}

async function testCreateBlogWithoutTitle() {
  logTest("POST /api/blogs - Create blog without title (should fail)");

  try {
    const response = await fetch(`${API_BASE}/api/blogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": authCookie,
      },
      body: JSON.stringify({
        content: "{}",
        excerpt: "Test without title",
      }),
    });

    const data = await response.json();

    if (!data.success && response.status === 400) {
      logSuccess(`Correctly rejected blog without title`);
      incrementTest(true);
      return true;
    } else {
      logError(`Should have rejected but didn't`);
      incrementTest(false);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    incrementTest(false);
    return false;
  }
}

// Main test runner
async function runTests() {
  logSection("🧪 BLOG API TESTING SUITE");
  log(`API Base URL: ${API_BASE}\n`);

  // Authentication
  logSection("1. AUTHENTICATION");
  const isAuthenticated = await loginAsAdmin();
  
  if (!isAuthenticated) {
    logError("Cannot continue without authentication");
    return;
  }

  // Read Operations
  logSection("2. READ OPERATIONS (GET)");
  await testGetAllBlogs();
  await testGetPublishedBlogs();
  await testSearchBlogs();
  await testPagination();

  // Create Operations
  logSection("3. CREATE OPERATIONS (POST)");
  await testCreateBlog();
  await testCreatePublishedBlog();

  // Single Blog Read
  logSection("4. SINGLE BLOG READ");
  await testGetBlogBySlug();

  // Update Operations
  logSection("5. UPDATE OPERATIONS (PUT)");
  await testUpdateBlog();
  await testPublishBlog();
  await testUnpublishBlog();

  // Delete Operations
  logSection("6. DELETE OPERATIONS (DELETE)");
  await testDeleteBlog();
  await testDeleteSecondBlog();

  // Error Handling
  logSection("7. ERROR HANDLING");
  await testUnauthorizedCreate();
  await testGetNonExistentBlog();
  await testGetDraftBlogWithoutAuth();
  await testCreateBlogWithoutTitle();

  // Summary
  logSection("📊 TEST RESULTS SUMMARY");
  log(`Total Tests: ${totalTests}`);
  log(`✓ Passed: ${passedTests}`, colors.green);
  log(`✗ Failed: ${totalTests - passedTests}`, colors.red);
  log(`\nSuccess Rate: ${((passedTests / totalTests) * 100).toFixed(2)}%\n`);

  logSuccess("Testing complete!");
}

// Run the tests
runTests().catch(console.error);
