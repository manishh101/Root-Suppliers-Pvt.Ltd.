import mongoose, { Schema, Document, Model } from "mongoose";
import slugify from "slugify";

export interface IBrand extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  logo: {
    url: string;
    publicId: string;
  };
  website?: string;
  description?: string;
  isFeatured: boolean;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const BrandSchema = new Schema<IBrand>(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      trim: true,
      maxlength: [100, "Brand name cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    logo: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    website: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      maxlength: [300, "Description cannot exceed 300 characters"],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug before saving
BrandSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const Brand: Model<IBrand> =
  mongoose.models.Brand || mongoose.model<IBrand>("Brand", BrandSchema);

export default Brand;
