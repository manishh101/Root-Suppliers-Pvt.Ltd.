
import { cookies } from "next/headers";

async function loginAsAdmin() {
  console.log('Logging in as admin...');
  const res = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@rootsuppliers.com',
      password: 'admin123' // Assuming default dev password
    })
  });

  if (!res.ok) {
    console.error('Failed to login:', await res.text());
    process.exit(1);
  }

  const data = await res.json();
  const cookieHeader = res.headers.get('set-cookie');
  console.log('Login successful');
  return cookieHeader;
}

async function testCreateTestimonial(cookie: string) {
  console.log('\nTesting Create Testimonial...');

  // Payload matching existing code logic (before my fix) vs new fix
  const payload = {
    customerName: "Test Customer",
    customerDesignation: "CEO",
    reviewText: "Great service!",
    rating: 5,
    customerImage: null,
    isActive: true,
    isFeatured: false
  };

  console.log('Sending payload:', JSON.stringify(payload, null, 2));

  const res = await fetch('http://localhost:3000/api/testimonials', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookie
    },
    body: JSON.stringify(payload)
  });

  const text = await res.text();
  console.log(`Status: ${res.status}`);
  console.log(`Response: ${text}`);

  if (res.status === 400) {
    console.log("Validation Error Detected. Trying alternative payload...");
    // Try payload with mismatched fields just to see
    const payload2 = {
      customerName: "Test Customer 2",
      reviewText: "Great service!",
      rating: 5,
      // Missing designation, simple string image?
      customerImage: "http://string-url.com"
    };

    const res2 = await fetch('http://localhost:3000/api/testimonials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie
      },
      body: JSON.stringify(payload2)
    });
    console.log(`Payload 2 Status: ${res2.status}`);
    console.log(`Payload 2 Response: ${await res2.text()}`);
  }
}

async function main() {
  try {
    const cookie = await loginAsAdmin();
    if (cookie) {
      await testCreateTestimonial(cookie);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

main();
