/**
 * Category API Testing Script
 * Tests all category CRUD operations
 * 
 * Run with: npx tsx scripts/test-categories-api.ts
 */

import mongoose from "mongoose";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

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
let testCategorySlug: string = "";
let testSubcategorySlug: string = "";
let testSubSubcategorySlug: string = "";

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
      // Extract token from Set-Cookie header
      const setCookie = response.headers.get("set-cookie");
      if (setCookie) {
        const tokenMatch = setCookie.match(/auth-token=([^;]+)/);
        if (tokenMatch) {
          authCookie = `auth-token=${tokenMatch[1]}`;
          logSuccess(`Logged in successfully. Cookie extracted.`);
          return true;
        }
      }
      
      logWarning(`Login successful but no token found in cookie.`);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));
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

async function testGetAllCategories() {
  logTest("GET /api/categories - Get all categories");

  try {
    const response = await fetch(`${API_BASE}/api/categories`);
    const data = await response.json();

    if (data.success) {
      logSuccess(`Fetched ${data.categories.length} categories`);
      console.log(JSON.stringify(data.categories.slice(0, 2), null, 2));
      return true;
    } else {
      logError(`Failed: ${data.message}`);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    return false;
  }
}

async function testGetAllCategoriesWithProductCount() {
  logTest("GET /api/categories?includeProductCount=true - With product counts");

  try {
    const response = await fetch(`${API_BASE}/api/categories?includeProductCount=true`);
    const data = await response.json();

    if (data.success) {
      logSuccess(`Fetched ${data.categories.length} categories with product counts`);
      console.log(
        data.categories.slice(0, 2).map((c: any) => ({
          name: c.name,
          productCount: c.productCount,
        }))
      );
      return true;
    } else {
      logError(`Failed: ${data.message}`);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    return false;
  }
}

async function testGetActiveCategories() {
  logTest("GET /api/categories?isActive=true - Get only active categories");

  try {
    const response = await fetch(`${API_BASE}/api/categories?isActive=true`);
    const data = await response.json();

    if (data.success) {
      const activeCount = data.categories.filter((c: any) => c.isActive).length;
      logSuccess(`Fetched ${activeCount} active categories out of ${data.categories.length} total`);
      return true;
    } else {
      logError(`Failed: ${data.message}`);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    return false;
  }
}

async function testCreateMainCategory() {
  logTest("POST /api/categories - Create main category");

  const categoryData = {
    name: `Test Main Category ${Date.now()}`,
    description: "This is a test main category",
    order: 999,
    isActive: true,
  };

  try {
    const response = await fetch(`${API_BASE}/api/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": authCookie,
      },
      body: JSON.stringify(categoryData),
    });

    const data = await response.json();

    if (data.success && data.category) {
      testCategorySlug = data.category.slug;
      logSuccess(`Created category: ${data.category.name} (slug: ${testCategorySlug})`);
      console.log(JSON.stringify(data.category, null, 2));
      return true;
    } else {
      logError(`Failed: ${data.message}`);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    return false;
  }
}

async function testCreateSubcategory() {
  logTest("POST /api/categories - Create subcategory");

  if (!testCategorySlug) {
    logWarning("Skipping: No parent category slug available");
    return false;
  }

  // First get the parent category ID
  const parentResponse = await fetch(`${API_BASE}/api/categories/${testCategorySlug}`);
  const parentData = await parentResponse.json();

  if (!parentData.success) {
    logError("Failed to fetch parent category");
    return false;
  }

  const subcategoryData = {
    name: `Test Subcategory ${Date.now()}`,
    description: "This is a test subcategory",
    parent: parentData.category._id,
    order: 1,
    isActive: true,
  };

  try {
    const response = await fetch(`${API_BASE}/api/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": authCookie,
      },
      body: JSON.stringify(subcategoryData),
    });

    const data = await response.json();

    if (data.success && data.category) {
      testSubcategorySlug = data.category.slug;
      logSuccess(`Created subcategory: ${data.category.name} (slug: ${testSubcategorySlug})`);
      console.log(JSON.stringify(data.category, null, 2));
      return true;
    } else {
      logError(`Failed: ${data.message}`);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    return false;
  }
}

async function testCreateSubSubcategory() {
  logTest("POST /api/categories - Create sub-subcategory");

  if (!testSubcategorySlug) {
    logWarning("Skipping: No parent subcategory slug available");
    return false;
  }

  // First get the parent subcategory ID
  const parentResponse = await fetch(`${API_BASE}/api/categories/${testSubcategorySlug}`);
  const parentData = await parentResponse.json();

  if (!parentData.success) {
    logError("Failed to fetch parent subcategory");
    return false;
  }

  const subSubcategoryData = {
    name: `Test Sub-subcategory ${Date.now()}`,
    description: "This is a test sub-subcategory",
    parent: parentData.category._id,
    order: 1,
    isActive: true,
  };

  try {
    const response = await fetch(`${API_BASE}/api/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": authCookie,
      },
      body: JSON.stringify(subSubcategoryData),
    });

    const data = await response.json();

    if (data.success && data.category) {
      testSubSubcategorySlug = data.category.slug;
      logSuccess(`Created sub-subcategory: ${data.category.name} (slug: ${testSubSubcategorySlug})`);
      console.log(JSON.stringify(data.category, null, 2));
      return true;
    } else {
      logError(`Failed: ${data.message}`);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    return false;
  }
}

async function testGetCategoryBySlug() {
  logTest(`GET /api/categories/${testCategorySlug} - Get category by slug`);

  if (!testCategorySlug) {
    logWarning("Skipping: No category slug available");
    return false;
  }

  try {
    const response = await fetch(`${API_BASE}/api/categories/${testCategorySlug}`);
    const data = await response.json();

    if (data.success && data.category) {
      logSuccess(`Fetched category: ${data.category.name}`);
      console.log(JSON.stringify(data.category, null, 2));
      return true;
    } else {
      logError(`Failed: ${data.message}`);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    return false;
  }
}

async function testUpdateCategory() {
  logTest(`PUT /api/categories/${testCategorySlug} - Update category`);

  if (!testCategorySlug) {
    logWarning("Skipping: No category slug available");
    return false;
  }

  const updateData = {
    description: "Updated description " + Date.now(),
    isActive: false,
  };

  try {
    const response = await fetch(`${API_BASE}/api/categories/${testCategorySlug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Cookie": authCookie,
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (data.success && data.category) {
      logSuccess(`Updated category: ${data.category.name}`);
      console.log(JSON.stringify(data.category, null, 2));
      return true;
    } else {
      logError(`Failed: ${data.message}`);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    return false;
  }
}

async function testDeleteSubSubcategory() {
  logTest(`DELETE /api/categories/${testSubSubcategorySlug} - Delete sub-subcategory`);

  if (!testSubSubcategorySlug) {
    logWarning("Skipping: No sub-subcategory slug available");
    return false;
  }

  try {
    const response = await fetch(`${API_BASE}/api/categories/${testSubSubcategorySlug}`, {
      method: "DELETE",
      headers: {
        "Cookie": authCookie,
      },
    });

    const data = await response.json();

    if (data.success) {
      logSuccess(`Deleted sub-subcategory successfully`);
      return true;
    } else {
      logError(`Failed: ${data.message} (Status: ${response.status})`);
      console.log("Full response:", JSON.stringify(data, null, 2));
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    return false;
  }
}

async function testDeleteSubcategory() {
  logTest(`DELETE /api/categories/${testSubcategorySlug} - Delete subcategory`);

  if (!testSubcategorySlug) {
    logWarning("Skipping: No subcategory slug available");
    return false;
  }

  try {
    const response = await fetch(`${API_BASE}/api/categories/${testSubcategorySlug}`, {
      method: "DELETE",
      headers: {
        "Cookie": authCookie,
      },
    });

    const data = await response.json();

    if (data.success) {
      logSuccess(`Deleted subcategory successfully`);
      return true;
    } else {
      logError(`Failed: ${data.message} (Status: ${response.status})`);
      console.log("Full response:", JSON.stringify(data, null, 2));
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    return false;
  }
}

async function testDeleteMainCategory() {
  logTest(`DELETE /api/categories/${testCategorySlug} - Delete main category`);

  if (!testCategorySlug) {
    logWarning("Skipping: No category slug available");
    return false;
  }

  try {
    const response = await fetch(`${API_BASE}/api/categories/${testCategorySlug}`, {
      method: "DELETE",
      headers: {
        "Cookie": authCookie,
      },
    });

    const data = await response.json();

    if (data.success) {
      logSuccess(`Deleted main category successfully`);
      return true;
    } else {
      logError(`Failed: ${data.message} (Status: ${response.status})`);
      console.log("Full response:", JSON.stringify(data, null, 2));
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    return false;
  }
}

async function testCreateCategoryWithoutAuth() {
  logTest("POST /api/categories - Create category without authentication");

  const categoryData = {
    name: "Unauthorized Category",
    description: "This should fail",
  };

  try {
    const response = await fetch(`${API_BASE}/api/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
    });

    const data = await response.json();

    if (!data.success && response.status === 401) {
      logSuccess(`Correctly rejected unauthorized request`);
      return true;
    } else {
      logError(`Should have rejected unauthorized request`);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    return false;
  }
}

async function testCreateDuplicateCategory() {
  logTest("POST /api/categories - Create duplicate category (should fail)");

  const categoryData = {
    name: "Duplicate Test Category",
    description: "First creation",
  };

  try {
    // Create first category
    await fetch(`${API_BASE}/api/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": authCookie,
      },
      body: JSON.stringify(categoryData),
    });

    // Try to create duplicate
    const response = await fetch(`${API_BASE}/api/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": authCookie,
      },
      body: JSON.stringify(categoryData),
    });

    const data = await response.json();

    if (!data.success && response.status === 409) {
      logSuccess(`Correctly rejected duplicate category`);
      return true;
    } else {
      logError(`Should have rejected duplicate category`);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    return false;
  }
}

async function testGetNonExistentCategory() {
  logTest("GET /api/categories/non-existent-slug - Get non-existent category");

  try {
    const response = await fetch(`${API_BASE}/api/categories/non-existent-slug-${Date.now()}`);
    const data = await response.json();

    if (!data.success && response.status === 404) {
      logSuccess(`Correctly returned 404 for non-existent category`);
      return true;
    } else {
      logError(`Should have returned 404`);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    return false;
  }
}

async function runAllTests() {
  logSection("🧪 CATEGORY API TESTING SUITE");
  log(`API Base URL: ${API_BASE}`, colors.cyan);

  const results = {
    passed: 0,
    failed: 0,
    skipped: 0,
  };

  // Authentication
  logSection("1. AUTHENTICATION");
  if (await loginAsAdmin()) {
    results.passed++;
  } else {
    results.failed++;
    logError("Cannot continue without authentication");
    return;
  }

  // Read Operations
  logSection("2. READ OPERATIONS (GET)");
  (await testGetAllCategories()) ? results.passed++ : results.failed++;
  (await testGetAllCategoriesWithProductCount()) ? results.passed++ : results.failed++;
  (await testGetActiveCategories()) ? results.passed++ : results.failed++;

  // Create Operations
  logSection("3. CREATE OPERATIONS (POST)");
  (await testCreateMainCategory()) ? results.passed++ : results.failed++;
  (await testCreateSubcategory()) ? results.passed++ : results.failed++;
  (await testCreateSubSubcategory()) ? results.passed++ : results.failed++;

  // Single Category Read
  logSection("4. SINGLE CATEGORY READ");
  (await testGetCategoryBySlug()) ? results.passed++ : results.failed++;

  // Update Operations
  logSection("5. UPDATE OPERATIONS (PUT)");
  (await testUpdateCategory()) ? results.passed++ : results.failed++;

  // Delete Operations
  logSection("6. DELETE OPERATIONS (DELETE)");
  (await testDeleteSubSubcategory()) ? results.passed++ : results.failed++;
  (await testDeleteSubcategory()) ? results.passed++ : results.failed++;
  (await testDeleteMainCategory()) ? results.passed++ : results.failed++;

  // Error Handling
  logSection("7. ERROR HANDLING");
  (await testCreateCategoryWithoutAuth()) ? results.passed++ : results.failed++;
  (await testCreateDuplicateCategory()) ? results.passed++ : results.failed++;
  (await testGetNonExistentCategory()) ? results.passed++ : results.failed++;

  // Summary
  logSection("📊 TEST RESULTS SUMMARY");
  log(`Total Tests: ${results.passed + results.failed}`, colors.bright);
  logSuccess(`Passed: ${results.passed}`);
  if (results.failed > 0) {
    logError(`Failed: ${results.failed}`);
  }
  log(`\nSuccess Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(2)}%`, colors.bright);
}

// Run tests
runAllTests()
  .then(() => {
    log("\n✅ Testing complete!", colors.green + colors.bright);
    process.exit(0);
  })
  .catch((error) => {
    logError(`\n❌ Testing failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  });
