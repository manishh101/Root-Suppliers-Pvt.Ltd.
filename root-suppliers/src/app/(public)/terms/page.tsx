import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and Conditions for our company",
};

export default function TermsPage() {
  return (
    <div className="container-main py-16 md:py-24 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-5xl font-bold mb-8">Terms & Conditions</h1>

      <div className="prose prose-slate max-w-none space-y-6 text-gray-700">
        <p className="text-lg">
          Please read these terms and conditions carefully before using our website or engaging with our services.
        </p>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
          <p>
            By accessing or using the our website, you agree to be bound by these Terms and Conditions
            and our Privacy Policy. If you do not agree, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use of the Website</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You must be at least 18 years old to use this website.</li>
            <li>You agree to use the website only for lawful purposes.</li>
            <li>You are responsible for maintaining the confidentiality of any account information.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Product Information</h2>
          <p>
            While we strive for accuracy, we do not warrant that product descriptions, prices, or other content
            on the website are error-free. We reserve the right to correct any errors and to change or update information
            at any time without prior notice.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Orders and Inquiries</h2>
          <p>
            Submitting an inquiry does not constitute a binding contract. Prices and availability are subject to
            confirmation by our sales team. We reserve the right to refuse any inquiry at our sole discretion.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Intellectual Property</h2>
          <p>
            All content on this website, including text, images, logos, and software, is the property of
            our company and protected by copyright laws. You may not reproduce or reuse any content without
            explicit permission.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h2>
          <p>
            our company shall not be liable for any direct, indirect, incidental, or consequential damages
            resulting from the use or inability to use our website or products.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Governing Law</h2>
          <p>
            These terms are governed by and construed in accordance with the laws of Nepal. Any disputes shall be
            subject to the exclusive jurisdiction of the courts in Biratnagar/Kathmandu.
          </p>
        </section>

        <p className="text-sm text-gray-500 pt-8 border-t border-gray-100">
          Last updated: January 20, 2026
        </p>
      </div>
    </div>
  );
}
