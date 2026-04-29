import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for our company",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container-main py-16 md:py-24 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-5xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose prose-slate max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
          <p>
            Welcome to our company We value your privacy and are committed to protecting your personal data.
            This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
          <p>We may collect information in several ways, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Personal data:</strong> Name, email address, phone number, and location provided when you make an inquiry.</li>
            <li><strong>Usage data:</strong> Information about your interactions with our website (e.g., pages visited, time spent).</li>
            <li><strong>Cookies:</strong> Small files stored on your device that help us improve user experience.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
          <p>We use the collected data for various purposes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and maintain our services.</li>
            <li>To respond to your inquiries and support requests.</li>
            <li>To analyze usage trends and improve website performance.</li>
            <li>To send promotional materials, if you've opted in.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Protection</h2>
          <p>
            We implement industry-standard security measures to ensure your data remains secure. However, no method of
            electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Third-Party Services</h2>
          <p>
            We may use third-party tools such as Google Analytics to monitor and analyze web traffic.
            These third parties have their own privacy policies regarding how they handle data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Changes to This Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting
            the new Privacy Policy on this page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at
            <a href="mailto:info@rootsuppliers.com.np" className="text-primary-600 ml-1">info@rootsuppliers.com.np</a>.
          </p>
        </section>

        <p className="text-sm text-gray-500 pt-8 border-t border-gray-100">
          Last updated: January 20, 2026
        </p>
      </div>
    </div>
  );
}
