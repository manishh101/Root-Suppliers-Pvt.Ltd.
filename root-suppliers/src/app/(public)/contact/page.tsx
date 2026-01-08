"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { VisitUsSection } from "@/components/sections";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form with data:", formData);
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);

      if (data.success) {
        setStatus("success");
        setFormData({ fullName: "", phone: "", email: "", message: "" });
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Failed to submit inquiry");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };
  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gray-50 border-b border-gray-100">
        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-50 z-0" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-gray-100 rounded-full blur-3xl opacity-50 z-0" />

        <div className="container-main relative z-10">
          <div className="mb-12 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
                CONTACT <span className="text-primary-600 block sm:inline">ROOT SUPPLIERS</span>
              </h1>
              <div className="h-1.5 w-24 bg-primary-600 mt-6 rounded-full mx-auto md:mx-0" />
              <p className="text-gray-500 mt-6 text-lg font-medium max-w-lg leading-relaxed">
                Have questions? Need a quote? We're here to help you build your next project with confidence.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Get in Touch With Us</h2>
            <form className="space-y-6 bg-gray-50 p-8 md:p-10 rounded-2xl border border-gray-100" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 9841234567"
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email Address (Optional)</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. john@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="How can we help you?"
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none"
                />
              </div>

              {status === "error" && (
                <div className="p-4 rounded-lg bg-red-50 text-red-600 border border-red-200 text-sm">
                  {errorMessage}
                </div>
              )}

              {status === "success" && (
                <div className="p-4 rounded-lg bg-green-50 text-green-600 border border-green-200 text-sm">
                  Thank you! Your message has been sent successfully. We will contact you shortly.
                </div>
              )}

              {status === "success" ? (
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary-600 text-white font-bold rounded-lg hover:bg-secondary-700 transition-colors uppercase tracking-wide group"
                >
                  Send Another Message
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary-600 text-white font-bold rounded-lg hover:bg-secondary-700 transition-colors uppercase tracking-wide group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <>Processing...</>
                  ) : (
                    <>
                      Submit Message
                      <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              )}
            </form>
          </motion.div>
        </div>
      </section>

      {/* Visit Us Section */}
      <VisitUsSection />
    </div>
  );
}
