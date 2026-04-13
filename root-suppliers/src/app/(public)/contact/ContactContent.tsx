"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle } from "lucide-react";
import { VisitUsSection } from "@/components/sections";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inquirySchema, type InquiryFormData } from "@/lib/validations";

export default function ContactContent({ settings }: { settings: any }) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      message: "",
      source: "contact_form",
    },
  });

  const onSubmit = async (data: InquiryFormData) => {
    setStatus("idle");
    setErrorMessage("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setStatus("success");
        reset();
        // Auto hide success message after 3 seconds
        setTimeout(() => {
          setStatus("idle");
        }, 3000);
      } else {
        setStatus("error");
        setErrorMessage(result.message || "Failed to submit inquiry");
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
      <section className="relative pt-12 pb-8 md:pt-20 md:pb-12 overflow-hidden bg-gray-50 border-b border-gray-100">
        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-50 z-0" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-gray-100 rounded-full blur-3xl opacity-50 z-0" />

        <div className="container-main relative z-10">
          <div className="mb-0 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                CONTACT <span className="text-primary-600 block sm:inline">ROOT SUPPLIERS</span>
              </h1>
              <div className="h-1.5 w-24 bg-primary-600 mt-4 md:mt-6 rounded-full mx-auto md:mx-0" />
              <p className="text-gray-500 mt-4 md:mt-6 text-sm md:text-base font-medium max-w-lg leading-relaxed">
                Have questions? Need a quote? We're here to help you build your next project with confidence.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Get in Touch With Us</h2>
            
            {/* Success Modal Overlay */}
            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                <div className="relative bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md mx-auto">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for reaching out! We&apos;ll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="px-6 py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            )}

            <form className="space-y-6 bg-gray-50 p-8 md:p-10 rounded-2xl border border-gray-100" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  {...register("fullName")}
                  placeholder=""
                  className={`w-full px-4 py-3 rounded-lg bg-white border focus:ring-2 outline-none transition-all ${errors.fullName ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-primary-500 focus:ring-primary-200"
                    }`}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  {...register("phone")}
                  placeholder=""
                  className={`w-full px-4 py-3 rounded-lg bg-white border focus:ring-2 outline-none transition-all ${errors.phone ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-primary-500 focus:ring-primary-200"
                    }`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email Address (Optional)</label>
                <input
                  type="text"
                  id="email"
                  {...register("email")}
                  placeholder=""
                  className={`w-full px-4 py-3 rounded-lg bg-white border focus:ring-2 outline-none transition-all ${errors.email ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-primary-500 focus:ring-primary-200"
                    }`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700">Message *</label>
                <textarea
                  id="message"
                  {...register("message")}
                  rows={5}
                  placeholder="How can we help you?"
                  className={`w-full px-4 py-3 rounded-lg bg-white border focus:ring-2 outline-none transition-all resize-none ${errors.message ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-primary-500 focus:ring-primary-200"
                    }`}
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>

              {status === "error" && (
                <div className="p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm flex items-start gap-2">
                  <span className="text-red-600 font-bold text-lg">⚠</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 text-white hover:text-white font-bold rounded-lg hover:bg-primary-700 transition-all capitalize tracking-wide group disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Submit Message
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Visit Us Section */}
      <VisitUsSection settings={settings} />
    </div>
  );
}
