"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Phone, MapPin, X, MessageSquareText } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

export default function ContactFloat() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useSettings();

  // Dynamic values from backend settings
  const phoneNumber = settings?.contact?.primaryPhone || "9851235637";
  const whatsappNumber = settings?.contact?.secondaryPhone || phoneNumber; // Fallback to primary if whatsapp not set
  const cleanWhatsapp = whatsappNumber.replace(/\D/g, "");
  const mapLink = settings?.contact?.googleMapsLink || "https://maps.app.goo.gl/jRWqSiE9fjLfv45r8";

  // WhatsApp Link
  const whatsappLink = `https://wa.me/${cleanWhatsapp}`;

  const toggleOpen = () => setIsOpen(!isOpen);

  // Button Variants for Staggered Animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1, // Wait for main button to start opening
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    show: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 10, scale: 0.8 }
  };

  // WhatsApp Icon SVG (Lucide doesn't have brand icons)
  const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="fill-white stroke-white">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );

  return (
    <div className="fixed bottom-24 right-5 md:bottom-8 md:right-8 z-[100] flex flex-col items-end gap-3 print:hidden">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="flex flex-col gap-3 items-end mb-2"
          >
            {/* WhatsApp Button */}
            <motion.a
              key="whatsapp"
              variants={itemVariants}
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group"
            >
              <span className="bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden md:block">
                WhatsApp
              </span>
              <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:bg-[#128C7E] text-white transition-colors">
                <WhatsAppIcon />
              </div>
            </motion.a>



            {/* Phone Button */}
            <motion.a
              key="phone"
              variants={itemVariants}
              href={`tel:${phoneNumber}`}
              className="flex items-center gap-3 group"
            >
              <span className="bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden md:block">
                Call Us
              </span>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 text-white transition-colors">
                <Phone className="w-5 h-5" />
              </div>
            </motion.a>

            {/* Map Button */}
            <motion.a
              key="map"
              variants={itemVariants}
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group"
            >
              <span className="bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden md:block">
                Get Directions
              </span>
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 text-white transition-colors">
                <MapPin className="w-5 h-5" />
              </div>
            </motion.a>


          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toggle Button */}
      <motion.button
        onClick={toggleOpen}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all focus:outline-none z-[101] ${isOpen ? "bg-gray-800 hover:bg-gray-900 text-white rotate-0" : "bg-primary-600 hover:bg-primary-700 text-white"
          }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Contact Us"
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          {isOpen ? <X className="w-7 h-7" /> : <MessageSquareText className="w-7 h-7" />}
        </motion.div>
      </motion.button>
    </div>
  );
}
