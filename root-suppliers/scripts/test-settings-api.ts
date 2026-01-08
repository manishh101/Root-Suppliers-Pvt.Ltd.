/**
 * Settings API Testing Script
 * Tests fetching and updating site settings
 * 
 * Run with: npx tsx scripts/test-settings-api.ts
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

// Test data
let authCookie: string = "";
let originalSiteName: string = "";

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
          logSuccess(`Logged in successfully.`);
          return true;
        }
      }
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

async function testGetSettings() {
  logTest("GET /api/settings - Fetch settings");

  try {
    const response = await fetch(`${API_BASE}/api/settings`);
    const data = await response.json();

    if (data.success && data.settings) {
      // Handle nested site name according to schema
      const siteName = data.settings.site?.name || data.settings.siteName;
      originalSiteName = siteName;

      logSuccess(`Fetched settings. Site Name: "${siteName}"`);
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

async function testUpdateSettings() {
  logTest("PUT /api/settings - Update settings");

  const updateData = {
    site: {
      name: `Root Suppliers (Updated ${Date.now()})`
    },
    social: {
      facebook: "https://facebook.com/rootsuppliers-updated",
      twitter: "https://twitter.com/rootsuppliers-updated"
    }
  };

  try {
    const response = await fetch(`${API_BASE}/api/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Cookie": authCookie,
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (data.success && data.settings) {
      const newName = data.settings.site?.name;
      logSuccess(`Updated settings. New Site Name: "${newName}"`);
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

async function testRevertSettings() {
  logTest("PUT /api/settings - Revert settings");

  if (!originalSiteName) {
    logError("Skipping: Original site name not saved");
    incrementTest(false);
    return false;
  }

  const updateData = {
    site: {
      name: originalSiteName
    }
  };

  try {
    const response = await fetch(`${API_BASE}/api/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Cookie": authCookie,
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (data.success && data.settings) {
      const newName = data.settings.site?.name;
      logSuccess(`Reverted settings. Site Name: "${newName}"`);
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

// Main test runner
async function runTests() {
  logSection("🧪 SETTINGS API TESTING SUITE");
  log(`API Base URL: ${API_BASE}\n`);

  // Authentication
  logSection("1. AUTHENTICATION");
  const isAuthenticated = await loginAsAdmin();

  if (!isAuthenticated) {
    logError("Cannot continue without authentication");
    return;
  }

  // Get Settings
  logSection("2. READ OPERATIONS");
  await testGetSettings();

  // Update Settings
  logSection("3. UPDATE OPERATIONS");
  await testUpdateSettings();

  // Revert Settings
  logSection("4. REVERT OPERATIONS");
  await testRevertSettings();

  // Summary
  logSection("📊 TEST RESULTS SUMMARY");
  log(`Total Tests: ${totalTests}`);
  log(`✓ Passed: ${passedTests}`, colors.green);
  log(`✗ Failed: ${totalTests - passedTests}`, colors.red);
  log(`\nSuccess Rate: ${((passedTests / totalTests) * 100).toFixed(2)}%\n`);
}

// Run the tests
runTests().catch(console.error);
