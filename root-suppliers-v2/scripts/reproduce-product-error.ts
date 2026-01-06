
/**
 * Reproduction Script for Product Creation Error
 * Tries to create a product without shortDescription
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function runTest() {
  console.log("Reproducing product creation error...");

  // 1. Login
  const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@rootsuppliers.com",
      password: "Admin@2024!",
    }),
  });

  const loginData = await loginRes.json();
  if (!loginData.success) {
    console.error("Login failed");
    return;
  }

  const cookie = loginRes.headers.get("set-cookie");
  const tokenMatch = cookie?.match(/auth-token=([^;]+)/);
  const authCookie = tokenMatch ? `auth-token=${tokenMatch[1]}` : "";

  // 2. Get a category
  const catRes = await fetch(`${API_BASE}/api/categories`);
  const catData = await catRes.json();
  const categoryId = catData.categories?.[0]?._id;

  if (!categoryId) {
    console.error("No category found");
    return;
  }

  // 3. Create Product WITHOUT shortDescription
  console.log("Sending request without shortDescription...");
  const res = await fetch(`${API_BASE}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": authCookie,
    },
    body: JSON.stringify({
      name: `Reproduction Product ${Date.now()}`,
      description: "Description exists",
      // shortDescription IS MISSING
      category: categoryId,
      images: [],
    }),
  });

  const data = await res.json();
  console.log(`Response Status: ${res.status}`);
  console.log("Response Body:", JSON.stringify(data, null, 2));

  if (res.status === 500) {
    console.log("✅ Reproduction Successful: Got 500 Error");
  } else if (res.status === 400) {
    console.log("❌ Reproduction Failed: Got 400 (Already handled?)");
  } else {
    console.log(`❌ Reproduction Failed: Got ${res.status}`);
  }
}

runTest().catch(console.error);
