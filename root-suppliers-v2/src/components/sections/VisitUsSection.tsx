"use client";

import React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const VisitUsSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container-main">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-wide">
            Visit Us
          </h2>
          <div className="w-16 h-1 bg-primary-600 mx-auto mt-3" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="relative rounded-lg overflow-hidden shadow-md h-[350px] lg:h-[400px] bg-gray-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57172.76508082051!2d87.2501847!3d26.4545024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef745400000001%3A0xb7eda7d66c4d68a0!2sBiratnagar!5e0!3m2!1sen!2snp!4v1704567890123!5m2!1sen!2snp"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Root Suppliers Location"
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 h-full">
              <h3 className="font-bold text-lg text-gray-900 mb-6 uppercase">
                Contact Information
              </h3>

              <div className="space-y-5">
                {/* Address */}
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Address</h4>
                    <p className="text-gray-600 text-sm">
                      Main Road, Biratnagar-4
                      <br />
                      Morang, Nepal
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Phone</h4>
                    <a
                      href="tel:+9779851235637"
                      className="text-gray-600 text-sm hover:text-primary-600"
                    >
                      9851235637
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Email</h4>
                    <a
                      href="mailto:info@rootsuppliers.com"
                      className="text-gray-600 text-sm hover:text-primary-600"
                    >
                      info@rootsuppliers.com
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Hours</h4>
                    <p className="text-gray-600 text-sm">
                      Sun-Fri: 7AM - 7PM
                      <br />
                      Sat: 7AM - 5PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisitUsSection;
