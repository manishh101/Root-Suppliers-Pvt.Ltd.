/**
 * Testimonials API Testing Script
 * Run with: npx tsx scripts/test-testimonials-api.ts
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

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
  console.log('\n' + '='.repeat(60));
  log(title, colors.bright + colors.blue);
  console.log('='.repeat(60));
}

function logTest(title: string) { log(`\n▶ ${title}`, colors.cyan); }
function logSuccess(msg: string) { log(`✓ ${msg}`, colors.green); }
function logError(msg: string) { log(`✗ ${msg}`, colors.red); }
function logWarning(msg: string) { log(`⚠ ${msg}`, colors.yellow); }

let authCookie = "";
let createdId = "";
let totalTests = 0;
let passedTests = 0;
function inc(p: boolean) { totalTests++; if (p) passedTests++; }

async function loginAsAdmin() {
  logTest('Login as Admin');
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@rootsuppliers.com', password: 'Admin@2024!' }),
    });
    const data = await res.json();
    if (data.success) {
      const setCookie = res.headers.get('set-cookie');
      if (setCookie) {
        const m = setCookie.match(/auth-token=([^;]+)/);
        if (m) { authCookie = `auth-token=${m[1]}`; logSuccess('Logged in and cookie extracted'); inc(true); return true; }
      }
      logWarning('Logged in but cookie not found'); inc(false); return false;
    }
    logError(`Login failed: ${data.message}`); inc(false); return false;
  } catch (e: any) { logError(`Login error: ${e.message}`); inc(false); return false; }
}

async function testGetPublicTestimonials() {
  logTest('GET /api/testimonials (public) - should return active only');
  try {
    const res = await fetch(`${API_BASE}/api/testimonials`);
    const data = await res.json();
    if (data.success && Array.isArray(data.testimonials)) {
      logSuccess(`Fetched ${data.testimonials.length} testimonials (public)`);
      inc(true); return true;
    }
    logError(`Failed: ${data.message || 'unexpected response'}`); inc(false); return false;
  } catch (e: any) { logError(e.message); inc(false); return false; }
}

async function testCreateTestimonial() {
  logTest('POST /api/testimonials - Create testimonial (admin)');
  const payload = {
    customerName: `Tester ${Date.now()}`,
    customerDesignation: 'QA Engineer',
    reviewText: 'This is an automated testimonial for testing.',
    rating: 5,
    isActive: true,
    isFeatured: false,
  };
  try {
    const res = await fetch(`${API_BASE}/api/testimonials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': authCookie },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success && data.testimonial && data.testimonial._id) {
      createdId = data.testimonial._id;
      logSuccess(`Created testimonial id=${createdId}`);
      inc(true); return true;
    }
    logError(`Create failed: ${data.message}`); inc(false); return false;
  } catch (e: any) { logError(e.message); inc(false); return false; }
}

async function testGetTestimonialById() {
  logTest('GET /api/testimonials/:id - fetch created testimonial (public and admin)');
  if (!createdId) { logWarning('No id to fetch'); inc(false); return false; }
  try {
    // Public fetch (should see it because we created with isActive=true)
    const publicRes = await fetch(`${API_BASE}/api/testimonials/${createdId}`);
    const publicData = await publicRes.json();
    if (!(publicData.success && publicData.testimonial)) { logError('Public GET failed'); inc(false); return false; }

    // Admin fetch
    const adminRes = await fetch(`${API_BASE}/api/testimonials/${createdId}`, { headers: { 'Cookie': authCookie } });
    const adminData = await adminRes.json();
    if (adminData.success && adminData.testimonial) {
      logSuccess('GET by id succeeded (public & admin)'); inc(true); return true;
    }
    logError('Admin GET failed'); inc(false); return false;
  } catch (e: any) { logError(e.message); inc(false); return false; }
}

async function testUpdateTestimonial() {
  logTest('PUT /api/testimonials/:id - update testimonial (admin)');
  if (!createdId) { logWarning('No id to update'); inc(false); return false; }
  try {
    const res = await fetch(`${API_BASE}/api/testimonials/${createdId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Cookie': authCookie },
      body: JSON.stringify({ reviewText: 'Updated message by automated test', isFeatured: true }),
    });
    const data = await res.json();
    if (data.success && data.testimonial && data.testimonial.isFeatured) {
      logSuccess('Update succeeded'); inc(true); return true;
    }
    logError(`Update failed: ${data.message}`); inc(false); return false;
  } catch (e: any) { logError(e.message); inc(false); return false; }
}

async function testDeleteTestimonial() {
  logTest('DELETE /api/testimonials/:id - delete testimonial (admin)');
  if (!createdId) { logWarning('No id to delete'); inc(false); return false; }
  try {
    const res = await fetch(`${API_BASE}/api/testimonials/${createdId}`, { method: 'DELETE', headers: { 'Cookie': authCookie } });
    const data = await res.json();
    if (data.success) { logSuccess('Delete succeeded'); inc(true); return true; }
    logError(`Delete failed: ${data.message}`); inc(false); return false;
  } catch (e: any) { logError(e.message); inc(false); return false; }
}

async function run() {
  logSection('🧪 TESTIMONIALS API TEST SUITE');
  log(`API Base: ${API_BASE}\n`);

  await testGetPublicTestimonials();
  const auth = await loginAsAdmin();
  if (!auth) { logError('Authentication failed - aborting admin tests'); }
  else {
    await testCreateTestimonial();
    await testGetTestimonialById();
    await testUpdateTestimonial();
    await testDeleteTestimonial();
  }

  logSection('📊 SUMMARY');
  log(`Total tests: ${totalTests}`);
  log(`Passed: ${passedTests}`, colors.green);
  log(`Failed: ${totalTests - passedTests}`, colors.red);
  log(`Success Rate: ${((passedTests/totalTests) * 100).toFixed(2)}%\n`);
}

run().catch(err => console.error(err));
