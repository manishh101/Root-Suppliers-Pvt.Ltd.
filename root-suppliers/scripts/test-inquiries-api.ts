/**
 * Inquiry API Testing Script
 * Tests all inquiry CRUD operations
 * 
 * Run with: npx tsx scripts/test-inquiries-api.ts
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
let testInquiryId: string = "";
let testInquiryId2: string = "";
let testProductId: string = "";

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

async function getTestProduct() {
  logTest("Get test product for inquiries (optional)");
  
  try {
    const response = await fetch(`${API_BASE}/api/products`);
    const data = await response.json();

    if (data.success && data.products && data.products.length > 0) {
      testProductId = data.products[0]._id;
      logSuccess(`Using product: ${data.products[0].name} (ID: ${testProductId})`);
      return true;
    } else {
      logWarning(`No products found. Will test without product.`);
      return true; // Not critical
    }
  } catch (error: any) {
    logWarning(`Error getting product: ${error.message}`);
    return true; // Not critical
  }
}

async function testCreateInquiryPublic() {
  logTest("POST /api/inquiries - Create inquiry (public/contact form)");

  const inquiryData = {
    fullName: "Test User " + Date.now(),
    email: "test@example.com",
    phone: "+1234567890",
    message: "This is a test inquiry from the contact form.",
    source: "contact_form",
  };

  try {
    const response = await fetch(`${API_BASE}/api/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inquiryData),
    });

    const data = await response.json();

    if (data.success && data.inquiry) {
      testInquiryId = data.inquiry.id;
      logSuccess(`Created inquiry (ID: ${testInquiryId})`);
      console.log(`Source: ${data.inquiry.source}`);
      console.log(`Message: "${inquiryData.message.substring(0, 40)}..."`);
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

async function testCreateProductInquiry() {
  logTest("POST /api/inquiries - Create product inquiry");

  const inquiryData = {
    fullName: "Product Inquirer " + Date.now(),
    email: "inquirer@example.com",
    phone: "+9876543210",
    message: "I'm interested in this product. Can you provide more details?",
    product: testProductId || undefined,
    source: "product_inquiry",
  };

  try {
    const response = await fetch(`${API_BASE}/api/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inquiryData),
    });

    const data = await response.json();

    if (data.success && data.inquiry) {
      testInquiryId2 = data.inquiry.id;
      logSuccess(`Created product inquiry (ID: ${testInquiryId2})`);
      console.log(`Source: ${data.inquiry.source}`);
      console.log(`Message: "${inquiryData.message.substring(0, 40)}..."`);
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

async function testGetAllInquiries() {
  logTest("GET /api/inquiries - Get all inquiries (admin)");

  try {
    const response = await fetch(`${API_BASE}/api/inquiries`, {
      headers: {
        "Cookie": authCookie,
      },
    });
    const data = await response.json();

    if (data.success) {
      logSuccess(`Fetched ${data.inquiries.length} inquiries (Page ${data.pagination.page}/${data.pagination.totalPages})`);
      console.log(`Total: ${data.pagination.total} inquiries`);
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

async function testGetInquiriesByStatus() {
  logTest("GET /api/inquiries?status=new - Get inquiries by status");

  try {
    const response = await fetch(`${API_BASE}/api/inquiries?status=new`, {
      headers: {
        "Cookie": authCookie,
      },
    });
    const data = await response.json();

    if (data.success) {
      const allNew = data.inquiries.every((i: any) => i.status === "new");
      if (allNew || data.inquiries.length === 0) {
        logSuccess(`Fetched ${data.inquiries.length} new inquiries`);
        incrementTest(true);
        return true;
      } else {
        logError(`Some inquiries are not new`);
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

async function testGetInquiriesBySource() {
  logTest("GET /api/inquiries?source=contact_form - Get inquiries by source");

  try {
    const response = await fetch(`${API_BASE}/api/inquiries?source=contact_form`, {
      headers: {
        "Cookie": authCookie,
      },
    });
    const data = await response.json();

    if (data.success) {
      const allContactForm = data.inquiries.every((i: any) => i.source === "contact_form");
      if (allContactForm || data.inquiries.length === 0) {
        logSuccess(`Fetched ${data.inquiries.length} contact form inquiries`);
        incrementTest(true);
        return true;
      } else {
        logError(`Some inquiries are not from contact form`);
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
  logTest("GET /api/inquiries?page=1&limit=5 - Test pagination");

  try {
    const response = await fetch(`${API_BASE}/api/inquiries?page=1&limit=5`, {
      headers: {
        "Cookie": authCookie,
      },
    });
    const data = await response.json();

    if (data.success) {
      const correctLimit = data.inquiries.length <= 5;
      if (correctLimit) {
        logSuccess(`Pagination working: ${data.inquiries.length} inquiries on page 1`);
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

async function testGetInquiryById() {
  logTest(`GET /api/inquiries/${testInquiryId} - Get inquiry by ID`);

  if (!testInquiryId) {
    logWarning("Skipping: No inquiry ID available");
    incrementTest(false);
    return false;
  }

  try {
    const response = await fetch(`${API_BASE}/api/inquiries/${testInquiryId}`, {
      headers: {
        "Cookie": authCookie,
      },
    });
    const data = await response.json();

    if (data.success && data.inquiry) {
      logSuccess(`Fetched inquiry: "${data.inquiry.fullName}"`);
      console.log(`Status: ${data.inquiry.status}`);
      console.log(`Source: ${data.inquiry.source}`);
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

async function testUpdateInquiryStatus() {
  logTest(`PUT /api/inquiries/${testInquiryId} - Update inquiry status`);

  if (!testInquiryId) {
    logWarning("Skipping: No inquiry ID available");
    incrementTest(false);
    return false;
  }

  const updateData = {
    status: "contacted",
    notes: "Customer contacted via phone on " + new Date().toLocaleDateString(),
  };

  try {
    const response = await fetch(`${API_BASE}/api/inquiries/${testInquiryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Cookie": authCookie,
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (data.success && data.inquiry) {
      logSuccess(`Updated inquiry status: ${data.inquiry.status}`);
      console.log(`Notes: ${data.inquiry.notes?.substring(0, 40)}...`);
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

async function testCloseInquiry() {
  logTest(`PUT /api/inquiries/${testInquiryId2} - Close inquiry`);

  if (!testInquiryId2) {
    logWarning("Skipping: No second inquiry ID available");
    incrementTest(false);
    return false;
  }

  try {
    const response = await fetch(`${API_BASE}/api/inquiries/${testInquiryId2}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Cookie": authCookie,
      },
      body: JSON.stringify({ status: "closed" }),
    });

    const data = await response.json();

    if (data.success && data.inquiry && data.inquiry.status === "closed") {
      logSuccess(`Inquiry closed successfully`);
      incrementTest(true);
      return true;
    } else {
      logError(`Failed to close: ${data.message}`);
      incrementTest(false);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    incrementTest(false);
    return false;
  }
}

async function testDeleteInquiry() {
  logTest(`DELETE /api/inquiries/${testInquiryId} - Delete inquiry`);

  if (!testInquiryId) {
    logWarning("Skipping: No inquiry ID available");
    incrementTest(false);
    return false;
  }

  try {
    const response = await fetch(`${API_BASE}/api/inquiries/${testInquiryId}`, {
      method: "DELETE",
      headers: {
        "Cookie": authCookie,
      },
    });

    const data = await response.json();

    if (data.success) {
      logSuccess(`Deleted inquiry successfully`);
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

async function testDeleteSecondInquiry() {
  logTest(`DELETE /api/inquiries/${testInquiryId2} - Delete second inquiry`);

  if (!testInquiryId2) {
    logWarning("Skipping: No second inquiry ID available");
    incrementTest(false);
    return false;
  }

  try {
    const response = await fetch(`${API_BASE}/api/inquiries/${testInquiryId2}`, {
      method: "DELETE",
      headers: {
        "Cookie": authCookie,
      },
    });

    const data = await response.json();

    if (data.success) {
      logSuccess(`Deleted second inquiry successfully`);
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

async function testGetInquiriesWithoutAuth() {
  logTest("GET /api/inquiries - Get inquiries without auth (should fail)");

  try {
    const response = await fetch(`${API_BASE}/api/inquiries`);
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

async function testGetNonExistentInquiry() {
  logTest("GET /api/inquiries/000000000000000000000000 - Get non-existent inquiry");

  try {
    const response = await fetch(`${API_BASE}/api/inquiries/000000000000000000000000`, {
      headers: {
        "Cookie": authCookie,
      },
    });
    const data = await response.json();

    if (!data.success && response.status === 404) {
      logSuccess(`Correctly returned 404 for non-existent inquiry`);
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

async function testCreateInquiryWithoutRequiredFields() {
  logTest("POST /api/inquiries - Create inquiry without required fields (should fail)");

  try {
    const response = await fetch(`${API_BASE}/api/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: "Incomplete User",
        // Missing phone and message
      }),
    });

    const data = await response.json();

    if (!data.success && response.status === 400) {
      logSuccess(`Correctly rejected inquiry without required fields`);
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
  logSection("🧪 INQUIRY API TESTING SUITE");
  log(`API Base URL: ${API_BASE}\n`);

  // Authentication
  logSection("1. AUTHENTICATION");
  const isAuthenticated = await loginAsAdmin();
  
  if (!isAuthenticated) {
    logError("Cannot continue without authentication");
    return;
  }

  // Get test product (optional)
  logSection("2. SETUP - GET TEST PRODUCT (OPTIONAL)");
  await getTestProduct();

  // Create Operations (Public)
  logSection("3. CREATE OPERATIONS (POST) - PUBLIC");
  await testCreateInquiryPublic();
  await testCreateProductInquiry();

  // Read Operations (Admin)
  logSection("4. READ OPERATIONS (GET) - ADMIN");
  await testGetAllInquiries();
  await testGetInquiriesByStatus();
  await testGetInquiriesBySource();
  await testPagination();

  // Single Inquiry Read
  logSection("5. SINGLE INQUIRY READ");
  await testGetInquiryById();

  // Update Operations
  logSection("6. UPDATE OPERATIONS (PUT)");
  await testUpdateInquiryStatus();
  await testCloseInquiry();

  // Delete Operations
  logSection("7. DELETE OPERATIONS (DELETE)");
  await testDeleteInquiry();
  await testDeleteSecondInquiry();

  // Error Handling
  logSection("8. ERROR HANDLING");
  await testGetInquiriesWithoutAuth();
  await testGetNonExistentInquiry();
  await testCreateInquiryWithoutRequiredFields();

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
