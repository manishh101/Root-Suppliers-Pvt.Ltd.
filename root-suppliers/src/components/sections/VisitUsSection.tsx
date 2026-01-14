"use client";

import React from "react";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";

export const VisitUsSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary-100/30 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-100/30 to-transparent rounded-full blur-3xl" />

      <div className="container-main relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary-600"></div>
            <MapPin className="w-6 h-6 text-primary-600" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary-600"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Visit Our Store
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Come discover our comprehensive collection of construction materials and hardware supplies in person
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left Side - Contact Info */}
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              Contact Information
            </h3>

            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-center gap-5 group">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 flex-1">
                  <h4 className="font-semibold text-gray-900 text-base md:min-w-[120px]">Our Location:</h4>
                  <p className="text-gray-600 text-base flex-1">
                    Main Road, Biratnagar-4, Morang, Nepal
                  </p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-sm group/link whitespace-nowrap"
                  >
                    Get Directions
                    <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-5 group">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 flex-1">
                  <h4 className="font-semibold text-gray-900 text-base md:min-w-[120px]">Call Us:</h4>
                  <a
                    href="tel:+9779851235637"
                    className="text-gray-600 text-base hover:text-primary-600 transition-colors font-medium"
                  >
                    9851235637
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-5 group">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 flex-1">
                  <h4 className="font-semibold text-gray-900 text-base md:min-w-[120px]">Email Us:</h4>
                  <a
                    href="mailto:info@rootsuppliers.com"
                    className="text-gray-600 text-base hover:text-primary-600 transition-colors font-medium break-all"
                  >
                    info@rootsuppliers.com
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-center gap-5 group">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 flex-1">
                  <h4 className="font-semibold text-gray-900 text-base md:min-w-[120px]">Business Hours:</h4>
                  <p className="text-gray-600 text-base">
                    Sun - Fri: <span className="font-semibold text-gray-700">7AM - 7PM</span> | Saturday: <span className="font-semibold text-gray-700">7AM - 5PM</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Map */}
          <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-gray-200/50 h-[400px] lg:h-auto relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"></div>
            <iframe
              src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Root+Suppliers+Pvt+Ltd,Biratnagar,Nepal&zoom=17"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '400px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Root Suppliers Location"
              className="grayscale-[20%] hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisitUsSection;

