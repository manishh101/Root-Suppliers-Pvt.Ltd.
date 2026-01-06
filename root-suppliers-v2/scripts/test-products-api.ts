/**
 * Product API Testing Script
 * Tests all product CRUD operations
 * 
 * Run with: npx tsx scripts/test-products-api.ts
 */

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
let testCategoryId: string = "";
let testProductSlug: string = "";
let testProductSlug2: string = "";

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

async function getTestCategory() {
  logTest("Get test category for products");
  
  try {
    const response = await fetch(`${API_BASE}/api/categories`);
    const data = await response.json();

    if (data.success && data.categories && data.categories.length > 0) {
      testCategoryId = data.categories[0]._id;
      logSuccess(`Using category: ${data.categories[0].name} (ID: ${testCategoryId})`);
      return true;
    } else {
      logError(`No categories found. Create a category first.`);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    return false;
  }
}

async function testGetAllProducts() {
  logTest("GET /api/products - Get all products");

  try {
    const response = await fetch(`${API_BASE}/api/products`);
    const data = await response.json();

    if (data.success) {
      logSuccess(`Fetched ${data.products.length} products (Page ${data.pagination.page}/${data.pagination.totalPages})`);
      console.log(`Total: ${data.pagination.total} products`);
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

async function testGetProductsByCategory() {
  logTest("GET /api/products?category=:id - Get products by category");

  if (!testCategoryId) {
    logWarning("Skipping: No category ID available");
    incrementTest(false);
    return false;
  }

  try {
    const response = await fetch(`${API_BASE}/api/products?category=${testCategoryId}`);
    const data = await response.json();

    if (data.success) {
      logSuccess(`Fetched ${data.products.length} products in category`);
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

async function testSearchProducts() {
  logTest("GET /api/products?search=test - Search products");

  try {
    const response = await fetch(`${API_BASE}/api/products?search=test`);
    const data = await response.json();

    if (data.success) {
      logSuccess(`Found ${data.products.length} products matching "test"`);
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

async function testGetActiveProducts() {
  logTest("GET /api/products?isActive=true - Get active products only");

  try {
    const response = await fetch(`${API_BASE}/api/products?isActive=true`);
    const data = await response.json();

    if (data.success) {
      const allActive = data.products.every((p: any) => p.isActive);
      if (allActive) {
        logSuccess(`Fetched ${data.products.length} active products`);
        incrementTest(true);
        return true;
      } else {
        logError(`Some products are not active`);
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

async function testPagination() {
  logTest("GET /api/products?page=1&limit=5 - Test pagination");

  try {
    const response = await fetch(`${API_BASE}/api/products?page=1&limit=5`);
    const data = await response.json();

    if (data.success) {
      const correctLimit = data.products.length <= 5;
      if (correctLimit) {
        logSuccess(`Pagination working: ${data.products.length} products on page 1`);
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

async function testCreateProduct() {
  logTest("POST /api/products - Create new product");

  if (!testCategoryId) {
    logWarning("Skipping: No category ID available");
    incrementTest(false);
    return false;
  }

  const productData = {
    name: `Test Product ${Date.now()}`,
    shortDescription: "This is a short description for testing",
    description: "This is a detailed description of the test product for testing purposes.",
    category: testCategoryId,
    images: [
      {
        url: "https://example.com/test-image.jpg",
        publicId: "test-image-id",
        alt: "Test product image"
      }
    ],
    specifications: [
      { key: "Material", value: "Test Material" },
      { key: "Size", value: "Test Size" }
    ],
    isActive: true,
    isFeatured: false,
    isTopSelling: false,
  };

  try {
    const response = await fetch(`${API_BASE}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": authCookie,
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();

    if (data.success && data.product) {
      testProductSlug = data.product.slug;
      logSuccess(`Created product: "${data.product.name}" (slug: ${testProductSlug})`);
      console.log(`Category: ${data.product.category?.name || 'Unknown'}`);
      incrementTest(true);
      return true;
    } else {
      logError(`Failed: ${data.message}`);
      console.log(`Response status: ${response.status}`);
      incrementTest(false);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    incrementTest(false);
    return false;
  }
}

async function testCreateFeaturedProduct() {
  logTest("POST /api/products - Create featured product");

  if (!testCategoryId) {
    logWarning("Skipping: No category ID available");
    incrementTest(false);
    return false;
  }

  const productData = {
    name: `Featured Product ${Date.now()}`,
    shortDescription: "This is a featured product",
    description: "This is a detailed description of the featured test product.",
    category: testCategoryId,
    images: [],
    isFeatured: true,
    isActive: true,
  };

  try {
    const response = await fetch(`${API_BASE}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": authCookie,
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();

    if (data.success && data.product) {
      testProductSlug2 = data.product.slug;
      logSuccess(`Created featured product: "${data.product.name}"`);
      console.log(`Featured: ${data.product.isFeatured}`);
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

async function testGetProductBySlug() {
  logTest(`GET /api/products/${testProductSlug} - Get product by slug`);

  if (!testProductSlug) {
    logWarning("Skipping: No product slug available");
    incrementTest(false);
    return false;
  }

  try {
    const response = await fetch(`${API_BASE}/api/products/${testProductSlug}`);
    const data = await response.json();

    if (data.success && data.product) {
      logSuccess(`Fetched product: "${data.product.name}"`);
      console.log(`Category: ${data.product.category?.name || 'Unknown'}`);
      console.log(`Active: ${data.product.isActive}`);
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

async function testUpdateProduct() {
  logTest(`PUT /api/products/${testProductSlug} - Update product`);

  if (!testProductSlug) {
    logWarning("Skipping: No product slug available");
    incrementTest(false);
    return false;
  }

  const updateData = {
    shortDescription: "Updated short description " + Date.now(),
    isTopSelling: true,
  };

  try {
    const response = await fetch(`${API_BASE}/api/products/${testProductSlug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Cookie": authCookie,
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (data.success && data.product) {
      logSuccess(`Updated product: "${data.product.name}"`);
      console.log(`New short desc: ${data.product.shortDescription.substring(0, 40)}...`);
      console.log(`Top Selling: ${data.product.isTopSelling}`);
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

async function testDeactivateProduct() {
  logTest(`PUT /api/products/${testProductSlug2} - Deactivate product`);

  if (!testProductSlug2) {
    logWarning("Skipping: No second product slug available");
    incrementTest(false);
    return false;
  }

  try {
    const response = await fetch(`${API_BASE}/api/products/${testProductSlug2}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Cookie": authCookie,
      },
      body: JSON.stringify({ isActive: false }),
    });

    const data = await response.json();

    if (data.success && data.product && !data.product.isActive) {
      logSuccess(`Product deactivated successfully`);
      incrementTest(true);
      return true;
    } else {
      logError(`Failed to deactivate: ${data.message}`);
      incrementTest(false);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    incrementTest(false);
    return false;
  }
}

async function testDeleteProduct() {
  logTest(`DELETE /api/products/${testProductSlug} - Delete product`);

  if (!testProductSlug) {
    logWarning("Skipping: No product slug available");
    incrementTest(false);
    return false;
  }

  try {
    const response = await fetch(`${API_BASE}/api/products/${testProductSlug}`, {
      method: "DELETE",
      headers: {
        "Cookie": authCookie,
      },
    });

    const data = await response.json();

    if (data.success) {
      logSuccess(`Deleted product successfully`);
      incrementTest(true);
      return true;
    } else {
      logError(`Failed: ${data.message}`);
      console.log(`Response status: ${response.status}`);
      incrementTest(false);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    incrementTest(false);
    return false;
  }
}

async function testDeleteSecondProduct() {
  logTest(`DELETE /api/products/${testProductSlug2} - Delete second product`);

  if (!testProductSlug2) {
    logWarning("Skipping: No second product slug available");
    incrementTest(false);
    return false;
  }

  try {
    const response = await fetch(`${API_BASE}/api/products/${testProductSlug2}`, {
      method: "DELETE",
      headers: {
        "Cookie": authCookie,
      },
    });

    const data = await response.json();

    if (data.success) {
      logSuccess(`Deleted second product successfully`);
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
  logTest("POST /api/products - Create without authentication (should fail)");

  try {
    const response = await fetch(`${API_BASE}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Unauthorized Product",
        description: "Test",
        shortDescription: "Test",
        category: testCategoryId,
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

async function testGetNonExistentProduct() {
  logTest("GET /api/products/non-existent-slug - Get non-existent product");

  try {
    const response = await fetch(`${API_BASE}/api/products/non-existent-slug-${Date.now()}`);
    const data = await response.json();

    if (!data.success && response.status === 404) {
      logSuccess(`Correctly returned 404 for non-existent product`);
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

async function testCreateProductWithoutRequiredFields() {
  logTest("POST /api/products - Create product without required fields (should fail)");

  try {
    const response = await fetch(`${API_BASE}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": authCookie,
      },
      body: JSON.stringify({
        name: "Incomplete Product",
        // Missing description, shortDescription, and category
      }),
    });

    const data = await response.json();

    if (!data.success && response.status === 400) {
      logSuccess(`Correctly rejected product without required fields`);
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
  logSection("🧪 PRODUCT API TESTING SUITE");
  log(`API Base URL: ${API_BASE}\n`);

  // Authentication
  logSection("1. AUTHENTICATION");
  const isAuthenticated = await loginAsAdmin();
  
  if (!isAuthenticated) {
    logError("Cannot continue without authentication");
    return;
  }

  // Get test category
  logSection("2. SETUP - GET TEST CATEGORY");
  const hasCategory = await getTestCategory();
  
  if (!hasCategory) {
    logError("Cannot continue without a category. Please create a category first.");
    return;
  }

  // Read Operations
  logSection("3. READ OPERATIONS (GET)");
  await testGetAllProducts();
  await testGetProductsByCategory();
  await testSearchProducts();
  await testGetActiveProducts();
  await testPagination();

  // Create Operations
  logSection("4. CREATE OPERATIONS (POST)");
  await testCreateProduct();
  await testCreateFeaturedProduct();

  // Single Product Read
  logSection("5. SINGLE PRODUCT READ");
  await testGetProductBySlug();

  // Update Operations
  logSection("6. UPDATE OPERATIONS (PUT)");
  await testUpdateProduct();
  await testDeactivateProduct();

  // Delete Operations
  logSection("7. DELETE OPERATIONS (DELETE)");
  await testDeleteProduct();
  await testDeleteSecondProduct();

  // Error Handling
  logSection("8. ERROR HANDLING");
  await testUnauthorizedCreate();
  await testGetNonExistentProduct();
  await testCreateProductWithoutRequiredFields();

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
