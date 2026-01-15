import mongoose, { Schema, Document, Model } from "mongoose";
import slugify from "slugify";

export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  image?: {
    url: string;
    publicId: string;
    alt: string;
  };
  icon?: string;
  parent?: mongoose.Types.ObjectId;
  isFeatured: boolean;
  isActive: boolean;
  orderIndex: number;
  meta: {
    title?: string;
    description?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: [100, "Category name cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    image: {
      url: String,
      publicId: String,
      alt: String,
    },
    icon: {
      type: String,
      default: "Package",
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
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
CategorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Create indexes for performance
CategorySchema.index({ parent: 1 });
CategorySchema.index({ orderIndex: 1, name: 1 });

// Prevent mongoose from recompiling the model
const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
