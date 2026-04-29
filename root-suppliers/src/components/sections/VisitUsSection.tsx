"use client";

import React from "react";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { formatBusinessHours } from "@/lib/formatBusinessHours";

interface VisitUsSectionProps {
  settings?: any;
}

export const VisitUsSection: React.FC<VisitUsSectionProps> = ({ settings: propSettings }) => {
  const { settings: contextSettings } = useSettings();
  const settings = propSettings || contextSettings;

  // Format business hours for display
  const hours = formatBusinessHours(settings?.businessHours);

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container-main">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight mb-3">
            Visit Our Store
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto text-xs md:text-sm">
            Find quality construction materials and hardware supplies in person.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Info */}
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Contact Information
            </h3>

            <div className="space-y-5">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 border border-gray-100">
                  <MapPin className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-xs mb-1">Address</h4>
                  <p className="text-gray-600 text-xs">
                    {settings?.contact?.address || "Main Road, Biratnagar-4, Morang, Nepal"}
                  </p>
                  <a
                    href={settings?.contact?.googleMapsLink || "https://maps.app.goo.gl/jRWqSiE9fjLfv45r8"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-xs mt-1"
                  >
                    Get Directions
                    <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 border border-gray-100">
                  <Phone className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-xs mb-1">Phone</h4>
                  <a
                    href={`tel:${settings?.contact?.primaryPhone || "9851235637"}`}
                    className="text-gray-600 text-xs hover:text-primary-600 transition-colors"
                  >
                    {settings?.contact?.primaryPhone || "9851235637"}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 border border-gray-100">
                  <Mail className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-xs mb-1">Email</h4>
                  <a
                    href={`mailto:${settings?.contact?.primaryEmail || "info@rootsuppliers.com"}`}
                    className="text-gray-600 text-xs hover:text-primary-600 transition-colors break-all"
                  >
                    {settings?.contact?.primaryEmail || "info@rootsuppliers.com"}
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 border border-gray-100">
                  <Clock className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-xs mb-1">Hours</h4>
                  <p className="text-gray-600 text-xs">
                    {hours.map((line, i) => (
                      <span key={i} className="block">{line}</span>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden h-[350px] lg:h-auto border border-gray-100">
            <iframe
              src={settings?.contact?.googleMapsEmbed || "https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Root+Suppliers+Pvt+Ltd,Biratnagar,Nepal&zoom=17"}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '350px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${settings?.site?.name || "Our Company"} Location`}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisitUsSection;

