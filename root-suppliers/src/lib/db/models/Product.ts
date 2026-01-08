import mongoose, { Schema, Document, Model } from "mongoose";
import slugify from "slugify";

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: mongoose.Types.ObjectId;
  images: {
    url: string;
    publicId: string;
    alt: string;
  }[];
  specifications: {
    key: string;
    value: string;
  }[];
  price: number;
  discountPrice?: number;
  stock: number;
  brand?: mongoose.Types.ObjectId;
  modelName?: string;
  unit?: string;
  features: string[];
  tags: string[];
  isFeatured: boolean;
  isTopSelling: boolean;
  isActive: boolean;
  orderIndex: number;
  meta: {
    title?: string;
    description?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      maxlength: [300, "Short description cannot exceed 300 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
      index: true,
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        alt: String,
      },
    ],
    specifications: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    discountPrice: {
      type: Number,
      min: [0, "Discount price cannot be negative"],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
    },
    unit: String,
    features: [String],
    tags: [String],
    modelName: String,
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isTopSelling: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    orderIndex: {
      type: Number,
      default: 0,
    },
    meta: {
      title: String,
      description: String,
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug before saving
ProductSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Create text index for search
ProductSchema.index({ name: "text", shortDescription: "text", tags: "text" });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
