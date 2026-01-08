import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInquiry extends Document {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  email?: string;
  phone: string;
  message: string;
  product?: mongoose.Types.ObjectId;
  source: "contact_form" | "product_inquiry" | "whatsapp";
  status: "new" | "contacted" | "converted" | "closed";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    source: {
      type: String,
      enum: ["contact_form", "product_inquiry", "whatsapp"],
      default: "contact_form",
    },
    status: {
      type: String,
      enum: ["new", "contacted", "converted", "closed"],
      default: "new",
      index: true,
    },
    notes: {
      type: String,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for sorting by newest
InquirySchema.index({ createdAt: -1 });

const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", InquirySchema);

export default Inquiry;
