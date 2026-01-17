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

    const body = validatedData || await req.json();
    delete body._id;

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(body);
    } else {
      // Use explicit update instead of aggressive flattening to prevent crashes
      const updateData: any = {};

      // Site
      if (body.site) {
        if (body.site.name !== undefined) updateData["site.name"] = body.site.name;
        if (body.site.tagline !== undefined) updateData["site.tagline"] = body.site.tagline;
        if (body.site.logo) {
          if (body.site.logo.url !== undefined) updateData["site.logo.url"] = body.site.logo.url;
          if (body.site.logo.publicId !== undefined) updateData["site.logo.publicId"] = body.site.logo.publicId;
        }
        if (body.site.favicon) {
          if (body.site.favicon.url !== undefined) updateData["site.favicon.url"] = body.site.favicon.url;
          if (body.site.favicon.publicId !== undefined) updateData["site.favicon.publicId"] = body.site.favicon.publicId;
        }
      }

      // Contact
      if (body.contact) {
        if (body.contact.primaryPhone !== undefined) updateData["contact.primaryPhone"] = body.contact.primaryPhone;
        if (body.contact.secondaryPhone !== undefined) updateData["contact.secondaryPhone"] = body.contact.secondaryPhone;
        if (body.contact.primaryEmail !== undefined) updateData["contact.primaryEmail"] = body.contact.primaryEmail;
        if (body.contact.secondaryEmail !== undefined) updateData["contact.secondaryEmail"] = body.contact.secondaryEmail;
        if (body.contact.address !== undefined) updateData["contact.address"] = body.contact.address;
        if (body.contact.googleMapsEmbed !== undefined) updateData["contact.googleMapsEmbed"] = body.contact.googleMapsEmbed;
        if (body.contact.googleMapsLink !== undefined) updateData["contact.googleMapsLink"] = body.contact.googleMapsLink;
      }

      // Social
      if (body.social) {
        if (body.social.facebook !== undefined) updateData["social.facebook"] = body.social.facebook;
        if (body.social.instagram !== undefined) updateData["social.instagram"] = body.social.instagram;
        if (body.social.youtube !== undefined) updateData["social.youtube"] = body.social.youtube;
        if (body.social.linkedin !== undefined) updateData["social.linkedin"] = body.social.linkedin;
        if (body.social.twitter !== undefined) updateData["social.twitter"] = body.social.twitter;
      }

      // SEO
      if (body.seo) {
        if (body.seo.defaultTitle !== undefined) updateData["seo.defaultTitle"] = body.seo.defaultTitle;
        if (body.seo.defaultDescription !== undefined) updateData["seo.defaultDescription"] = body.seo.defaultDescription;
        if (body.seo.googleAnalyticsId !== undefined) updateData["seo.googleAnalyticsId"] = body.seo.googleAnalyticsId;
      }

      // Homepage
      if (body.homepage) {
        if (body.homepage.featuredProductsTitle !== undefined) updateData["homepage.featuredProductsTitle"] = body.homepage.featuredProductsTitle;
        if (body.homepage.featuredProductsSubtitle !== undefined) updateData["homepage.featuredProductsSubtitle"] = body.homepage.featuredProductsSubtitle;
        if (body.homepage.aboutSectionContent !== undefined) updateData["homepage.aboutSectionContent"] = body.homepage.aboutSectionContent;
        if (body.homepage.stats) updateData["homepage.stats"] = body.homepage.stats;
        if (body.homepage.heroSlides) updateData["homepage.heroSlides"] = body.homepage.heroSlides;
        if (body.homepage.about) updateData["homepage.about"] = body.homepage.about;
      }

      // Arrays & Others
      if (body.businessHours) updateData.businessHours = body.businessHours;
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
