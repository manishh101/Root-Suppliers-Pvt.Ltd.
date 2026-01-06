/**
 * Users API Testing Script
 * Tests all user CRUD operations
 * 
 * Run with: npx tsx scripts/test-users-api.ts
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
let adminUserId: string = "";
let createdUserId: string = "";
const testUserEmail = `testuser_${Date.now()}@example.com`;

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
        adminUserId = data.user.id;
      }

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

async function testGetAllUsers() {
  logTest("GET /api/users - Get all users");

  try {
    const response = await fetch(`${API_BASE}/api/users`, {
      headers: {
        "Cookie": authCookie,
      },
    });
    const data = await response.json();

    if (data.success) {
      logSuccess(`Fetched ${data.users.length} users (Page ${data.pagination.page}/${data.pagination.pages})`);
      console.log(`Total: ${data.pagination.total} users`);
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

async function testCreateUser() {
  logTest("POST /api/users - Create new user");

  const userData = {
    name: "Test User",
    email: testUserEmail,
    password: "Password123!",
    role: "editor",
    isActive: true
  };

  try {
    const response = await fetch(`${API_BASE}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": authCookie,
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (data.success && data.user) {
      createdUserId = data.user._id || data.user.id;
      logSuccess(`Created user: "${data.user.name}" (${data.user.email})`);
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

async function testGetUserById() {
  logTest(`GET /api/users/${createdUserId} - Get user by ID`);

  if (!createdUserId) {
    logWarning("Skipping: No user ID available");
    incrementTest(false);
    return false;
  }

  try {
    const response = await fetch(`${API_BASE}/api/users/${createdUserId}`, {
      headers: {
        "Cookie": authCookie,
      },
    });
    const data = await response.json();

    if (data.success && data.user) {
      logSuccess(`Fetched user: "${data.user.name}"`);
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

async function testUpdateUser() {
  logTest(`PUT /api/users/${createdUserId} - Update user`);

  if (!createdUserId) {
    logWarning("Skipping: No user ID available");
    incrementTest(false);
    return false;
  }

  const updateData = {
    name: "Updated Test User",
    role: "admin"
  };

  try {
    const response = await fetch(`${API_BASE}/api/users/${createdUserId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Cookie": authCookie,
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (data.success && data.user) {
      logSuccess(`Updated user: "${data.user.name}" (Role: ${data.user.role})`);
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

async function testDeleteUser() {
  logTest(`DELETE /api/users/${createdUserId} - Delete user`);

  if (!createdUserId) {
    logWarning("Skipping: No user ID available");
    incrementTest(false);
    return false;
  }

  try {
    const response = await fetch(`${API_BASE}/api/users/${createdUserId}`, {
      method: "DELETE",
      headers: {
        "Cookie": authCookie,
      },
    });

    const data = await response.json();

    if (data.success) {
      logSuccess(`Deleted user successfully`);
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

async function testUnauthorizedAccess() {
  logTest("GET /api/users - Unauthorized access (should fail)");

  try {
    const response = await fetch(`${API_BASE}/api/users`);
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

// Main test runner
async function runTests() {
  logSection("🧪 USERS API TESTING SUITE");
  log(`API Base URL: ${API_BASE}\n`);

  // Authentication
  logSection("1. AUTHENTICATION");
  const isAuthenticated = await loginAsAdmin();

  if (!isAuthenticated) {
    logError("Cannot continue without authentication");
    return;
  }

  // Read Operations
  logSection("2. READ OPERATIONS");
  await testGetAllUsers();

  // Create Operations
  logSection("3. CREATE OPERATIONS");
  await testCreateUser();

  // Single User Read
  logSection("4. SINGLE USER READ");
  await testGetUserById();

  // Update Operations
  logSection("5. UPDATE OPERATIONS");
  await testUpdateUser();

  // Delete Operations
  logSection("6. DELETE OPERATIONS");
  await testDeleteUser();

  // Error Handling
  logSection("7. ERROR HANDLING");
  await testUnauthorizedAccess();

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
