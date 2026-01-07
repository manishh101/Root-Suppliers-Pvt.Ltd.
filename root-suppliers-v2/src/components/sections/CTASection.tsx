"use client";

import React from "react";
import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";

export const CTASection: React.FC = () => {
  return (
    <section className="py-16 bg-primary-600">
      <div className="container-main">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-primary-100 text-lg mb-8">
            Contact us today for personalized recommendations and competitive pricing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors group"
            >
              Get in Touch
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="tel:+9779851235637"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
            >
              <Phone className="h-4 w-4" />
              Call Us Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
