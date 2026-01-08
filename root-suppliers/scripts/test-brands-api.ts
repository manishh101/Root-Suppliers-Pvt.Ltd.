/**
 * Brand API Testing Script
 * Tests brand creation and validation
 * 
 * Run with: npx tsx scripts/test-brands-api.ts
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

let authCookie: string = "";
let createdBrandSlug: string = "";

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
    }
    return false;
  } catch (error: any) {
    logError(`Login error: ${error.message}`);
    return false;
  }
}

async function testCreateInvalidBrand() {
  logTest("POST /api/brands - Create invalid brand (missing logo fields)");

  try {
    const response = await fetch(`${API_BASE}/api/brands`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": authCookie,
      },
      body: JSON.stringify({
        name: "Invalid Brand",
        logo: {} // Empty logo object, missing url and publicId
      }),
    });

    const data = await response.json();
    console.log(`Response Status: ${response.status}`);
    console.log(`Response Message: ${data.message}`);

    if (!data.success && response.status === 400) {
      logSuccess(`Correctly rejected invalid brand with 400`);
      return true;
    } else {
      logError(`Expected 400 but got ${response.status}`);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    return false;
  }
}

async function testCreateValidBrand() {
  logTest("POST /api/brands - Create valid brand");

  try {
    const response = await fetch(`${API_BASE}/api/brands`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": authCookie,
      },
      body: JSON.stringify({
        name: `Test Brand ${Date.now()}`,
        logo: {
          url: "https://example.com/logo.png",
          publicId: "brands/test-logo"
        },
        description: "Test brand description"
      }),
    });

    const data = await response.json();

    if (data.success && data.brand) {
      createdBrandSlug = data.brand.slug;
      logSuccess(`Created brand: ${data.brand.name}`);
      return true;
    } else {
      logError(`Failed to create brand: ${data.message}`);
      return false;
    }
  } catch (error: any) {
    logError(`Error: ${error.message}`);
    return false;
  }
}

async function testDeleteBrand() {
  logTest("DELETE /api/brands - Delete created brand");
  // Note: Use generic delete or specific endpoint if available. 
  // Assuming standard REST or just cleanup if possible. 
  // Actually, looking at previous files, deletion might need ID or slug. 
  // This script is mainly to verify creation validation, so I'll skip delete if no easy endpoint found 
  // or unimplemented. But let's check if we can delete to keep clean.

  // Check if delete endpoint exists? Brands usually do.
  // Let's assume standard /api/brands/[id] or [slug] exists.
  if (!createdBrandSlug) return;

  try {
    // Attempt delete by slug (guessing route structure based on products/blogs)
    const response = await fetch(`${API_BASE}/api/brands/${createdBrandSlug}`, {
      method: "DELETE",
      headers: { "Cookie": authCookie }
    });
    if (response.ok) logSuccess("Cleaned up test brand");
  } catch (e) { console.log("Cleanup failed (optional)"); }
}

async function runTests() {
  logSection("🧪 BRAND API VALIDATION TEST");
  if (!await loginAsAdmin()) return;

  await testCreateInvalidBrand();
  await testCreateValidBrand();
  await testDeleteBrand();
}

runTests().catch(console.error);
