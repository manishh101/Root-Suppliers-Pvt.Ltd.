import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISettings extends Document {
  _id: mongoose.Types.ObjectId;
  site: {
    name: string;
    tagline: string;
    logo?: { url: string; publicId: string };
    favicon?: { url: string; publicId: string };
  };
  contact: {
    primaryPhone: string;
    secondaryPhone?: string;
    primaryEmail: string;
    secondaryEmail?: string;
    address: string;
    googleMapsEmbed?: string;
    googleMapsLink?: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
  };
  businessHours: {
    day: string;
    hours: string;
  }[];
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    googleAnalyticsId?: string;
  };
  homepage: {
    heroSlides: {
      image: { url: string; publicId: string };
      title: string;
      subtitle?: string;
      ctaText?: string;
      ctaLink?: string;
    }[];
    featuredProductsTitle: string;
    featuredProductsSubtitle?: string;
    aboutSectionContent?: string;
    stats: {
      label: string;
      value: number;
      suffix?: string;
    }[];
  };
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    site: {
      name: { type: String, default: "Root Suppliers" },
      tagline: {
        type: String,
        default: "All Construction Solutions Under One Roof",
      },
      logo: {
        url: String,
        publicId: String,
      },
      favicon: {
        url: String,
        publicId: String,
      },
    },
    contact: {
      primaryPhone: { type: String, default: "+977-XXX-XXXXXXX" },
      secondaryPhone: String,
      primaryEmail: { type: String, default: "info@rootsuppliers.com.np" },
      secondaryEmail: String,
      address: { type: String, default: "Biratnagar, Nepal" },
      googleMapsEmbed: String,
      googleMapsLink: String,
    },
    social: {
      facebook: String,
      instagram: String,
      youtube: String,
      linkedin: String,
    },
    businessHours: [
      {
        day: String,
        hours: String,
      },
    ],
    seo: {
      defaultTitle: {
        type: String,
        default: "Root Suppliers - All Construction Solutions Under One Roof",
      },
      defaultDescription: {
        type: String,
        default:
          "Your trusted hardware partner in Biratnagar, Nepal. Wide range of construction materials, tools, and equipment.",
      },
      googleAnalyticsId: String,
    },
    homepage: {
      heroSlides: [
        {
          image: {
            url: String,
            publicId: String,
          },
          title: String,
          subtitle: String,
          ctaText: String,
          ctaLink: String,
        },
      ],
      featuredProductsTitle: {
        type: String,
        default: "Featured Products",
      },
      featuredProductsSubtitle: String,
      aboutSectionContent: String,
      stats: [
        {
          label: String,
          value: Number,
          suffix: String,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;
