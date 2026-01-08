import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Settings from "@/lib/db/models/Settings";
import { verifyAuth } from "@/lib/auth";

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
        siteName: "Root Suppliers",
        siteDescription: "Your Trusted Partner for Quality Hardware & Building Materials",
        logo: "",
        favicon: "",
        email: "info@rootsuppliers.com",
        phone: "+91 9876543210",
        whatsapp: "+91 9876543210",
        address: "123 Hardware Street, Industrial Area, Delhi, India - 110001",
        mapUrl: "",
        socialLinks: {
          facebook: "",
          twitter: "",
          instagram: "",
          linkedin: "",
          youtube: "",
        },
        seo: {
          metaTitle: "Root Suppliers | Quality Hardware & Building Materials",
          metaDescription: "Root Suppliers is your trusted partner for quality hardware, tools, and building materials. Serving professionals and DIY enthusiasts since 2010.",
          metaKeywords: "hardware, tools, building materials, construction, plumbing, electrical",
          ogImage: "",
        },
        businessHours: {
          monday: "9:00 AM - 7:00 PM",
          tuesday: "9:00 AM - 7:00 PM",
          wednesday: "9:00 AM - 7:00 PM",
          thursday: "9:00 AM - 7:00 PM",
          friday: "9:00 AM - 7:00 PM",
          saturday: "10:00 AM - 5:00 PM",
          sunday: "Closed",
        },
        enableInquiryNotifications: true,
        inquiryEmailRecipients: [],
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
    console.error("GET /api/settings error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch settings" },
      { status: 500 }
    );
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
    // Verify authentication
    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

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
      // Use $set for top-level fields
      // Handle nested objects specially to allow partial updates

      const updateData: any = {};

      // Handle nested updates
      const nestedFields = ["site", "contact", "social", "seo", "homepage"];

      nestedFields.forEach((field) => {
        if (body[field]) {
          // Special handling for homepage to include deep merge for 'about' if needed, 
          // but for now simple top-level merge within 'homepage' object is tricky with dot notation loop.
          // Correct approach for 'homepage' which has mixed direct and nested fields:
          if (field === "homepage") {
            Object.keys(body.homepage).forEach((key) => {
              // If it's the 'about' object, we might want to merge it too, but replacing the whole 'about' object is safer/easier for now if sent complete.
              // Or we can just let it set `homepage.about` = new object.
              // Given the loop below, it does `homepage.about` = body.homepage.about, which replaces the whole object. This is fine.
              updateData[`homepage.${key}`] = body.homepage[key];
            });
          } else {
            Object.keys(body[field]).forEach((key) => {
              updateData[`${field}.${key}`] = body[field][key];
            });
          }
        }
      });

      // Handle businessHours (array replacement or deep update - here assuming replacement for simplicity or specific logic)
      if (body.businessHours) {
        updateData.businessHours = body.businessHours;
      }

      // Handle top-level fields that might be direct (if any remain, but Settings schema seems fully nested except timestamps)
      if (body.enableInquiryNotifications !== undefined) updateData.enableInquiryNotifications = body.enableInquiryNotifications;
      if (body.inquiryEmailRecipients !== undefined) updateData.inquiryEmailRecipients = body.inquiryEmailRecipients;

      settings = await Settings.findOneAndUpdate(
        {},
        { $set: updateData },
        { new: true, runValidators: true }
      );
    }

    return NextResponse.json(
      {
        success: true,
        settings,
        message: "Settings updated successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PUT /api/settings error:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to update settings" },
      { status: 500 }
    );
  }
}
