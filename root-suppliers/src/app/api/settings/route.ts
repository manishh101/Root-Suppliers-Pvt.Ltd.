import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Settings from "@/lib/db/models/Settings";
import { verifyAdmin } from "@/lib/auth";
import { handleApiError, successResponse } from "@/lib/errors";
import { DEFAULT_STATS } from "@/lib/constants";
import { recordAuditLog } from "@/lib/audit";
import { withValidate } from "@/lib/api-middleware";
import { publicApiLimiter } from "@/lib/rate-limit";

/**
 * GET /api/settings
 * 
 * Fetch site settings.
 * Public endpoint (cached for performance).
 * 
 * @returns { success: boolean, settings: object }
 */
export const GET = withValidate(
  async () => {
    await connectDB();

    // There should only be one settings document
    let settings: any = await Settings.findOne().lean();

    // If no settings exist, create default
    if (!settings) {
      const newSettings = await Settings.create({
        site: {
          name: "Root Suppliers",
          tagline: "All Construction Solutions Under One Roof",
          logo: { url: "", publicId: "" },
          favicon: { url: "", publicId: "" },
        },
        contact: {
          primaryPhone: "+977-XXX-XXXXXXX",
          secondaryPhone: "",
          primaryEmail: "info@rootsuppliers.com.np",
          secondaryEmail: "",
          address: "Biratnagar, Nepal",
          googleMapsEmbed: "",
          googleMapsLink: "",
        },
        social: {
          facebook: "",
          instagram: "",
          youtube: "",
          linkedin: "",
        },
        businessHours: [
          { day: "monday", hours: "9:00 AM - 7:00 PM" },
          { day: "tuesday", hours: "9:00 AM - 7:00 PM" },
          { day: "wednesday", hours: "9:00 AM - 7:00 PM" },
          { day: "thursday", hours: "9:00 AM - 7:00 PM" },
          { day: "friday", hours: "9:00 AM - 7:00 PM" },
          { day: "saturday", hours: "10:00 AM - 5:00 PM" },
          { day: "sunday", hours: "Closed" },
        ],
        seo: {
          defaultTitle: "Root Suppliers - All Construction Solutions Under One Roof",
          defaultDescription: "Your trusted hardware partner in Biratnagar, Nepal. Wide range of construction materials, tools, and equipment.",
          googleAnalyticsId: "",
        },
        homepage: {
          heroSlides: [],
          featuredProductsTitle: "Featured Products",
          featuredProductsSubtitle: "",
          aboutSectionContent: "",
          stats: DEFAULT_STATS,
        },
      });
      settings = newSettings.toObject();
    }

    return successResponse({ settings });
  },
  { limiter: publicApiLimiter }
);

/**
 * PUT /api/settings
 * 
 * Update site settings.
 * Requires authentication (admin only).
 * 
 * @body Partial<Settings>
 * @returns { success: boolean, settings: object }
 */
export const PUT = withValidate(
  async (req: NextRequest, validatedData: any) => {
    // We already have verifyAdmin in withValidate, but we need the user object for audit log
    const user: any = await verifyAdmin(req);
    await connectDB();

    const body = validatedData;

    // Don't allow changing _id
    delete body._id;

    // ... same update logic ...
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(body);
    } else {
      const updateData: any = {};
      const flatten = (obj: any, prefix = "") => {
        Object.keys(obj).forEach(key => {
          const val = obj[key];
          const type = typeof val;
          if (val !== null && type === "object" && !Array.isArray(val)) {
            flatten(val, prefix + key + ".");
          } else {
            updateData[prefix + key] = val;
          }
        });
      };

      const topLevel = ["site", "contact", "social", "seo"];
      topLevel.forEach(field => {
        if (body[field]) {
          flatten(body[field], `${field}.`);
        }
      });

      if (body.homepage) {
        flatten(body.homepage, "homepage.");
      }

      if (body.businessHours) {
        updateData.businessHours = body.businessHours;
      }

      if (body.enableInquiryNotifications !== undefined) updateData.enableInquiryNotifications = body.enableInquiryNotifications;
      if (body.inquiryEmailRecipients !== undefined) updateData.inquiryEmailRecipients = body.inquiryEmailRecipients;

      settings = await Settings.findOneAndUpdate(
        {},
        { $set: updateData },
        { new: true, runValidators: true }
      );
    }

    // Record audit log
    await recordAuditLog({
      userId: user.userId,
      action: "UPDATE",
      resource: "Settings",
      resourceId: settings?._id.toString(),
      req,
    });

    return successResponse({ settings }, 200, "Settings updated successfully");
  },
  { requireAdmin: true }
);
