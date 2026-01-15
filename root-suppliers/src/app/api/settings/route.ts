import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Settings from "@/lib/db/models/Settings";
import { verifyAdmin } from "@/lib/auth";
import { handleApiError, successResponse } from "@/lib/errors";
import { DEFAULT_STATS } from "@/lib/constants";
import { recordAuditLog } from "@/lib/audit";

/**
 * GET /api/settings
 * 
 * Fetch site settings.
 * Public endpoint (cached for performance).
 * 
 * @returns { success: boolean, settings: object }
 */
export async function GET() {
  try {
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

    return NextResponse.json(
      {
        success: true,
        settings,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/settings
 * 
 * Update site settings.
 * Requires authentication (admin only).
 * 
 * @body Partial<Settings>
 * @returns { success: boolean, settings: object }
 */
export async function PUT(req: NextRequest) {
  try {
    const user = await verifyAdmin(req);

    await connectDB();

    const body = await req.json();

    // Don't allow changing _id
    delete body._id;

    // Find existing settings or create new
    let settings = await Settings.findOne();

    if (!settings) {
      // Create new settings with the provided data
      settings = await Settings.create(body);
    } else {
      // Update existing settings
      const updateData: any = {};

      // Helper to flatten nested objects for $set, EXCEPT for arrays which we want to replace
      const flatten = (obj: any, prefix = '') => {
        Object.keys(obj).forEach(key => {
          const val = obj[key];
          const type = typeof val;
          if (val !== null && type === 'object' && !Array.isArray(val)) {
            flatten(val, prefix + key + '.');
          } else {
            updateData[prefix + key] = val;
          }
        });
      };

      // We only want to flatten specific top-level fields that map to nested schemas
      // 'homepage' contains 'stats' (array) and 'heroSlides' (array).
      // If we flatten 'homepage', 'homepage.stats' will be treated as value.

      const topLevel = ["site", "contact", "social", "seo"];
      topLevel.forEach(field => {
        if (body[field]) {
          flatten(body[field], `${field}.`);
        }
      });

      // For homepage, we might want to be careful. 
      // If the body sends the whole homepage object, we can flatten it to update specific fields
      // but arrays like stats need to be set as a whole.
      if (body.homepage) {
        // We can just rely on the body being structured correctly.
        // If we use $set with "homepage.stats": [...], it replaces the array.
        // If we use $set with "homepage.featuredProductsTitle": "...", it updates string.
        flatten(body.homepage, "homepage.");
      }

      // For businessHours, it's an array of objects. We replace the whole array.
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
      userId: (user as any).userId,
      action: "UPDATE",
      resource: "Settings",
      resourceId: settings?._id.toString(),
      req,
    });

    return successResponse({ settings }, 200, "Settings updated successfully");
  } catch (error: any) {
    return handleApiError(error);
  }
}
