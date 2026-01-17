import { NextRequest } from "next/server";
import { verifyAuth, verifyAdmin } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";
import { handleApiError, successResponse, ValidationError } from "@/lib/errors";
import { withValidate } from "@/lib/api-middleware";
import { z } from "zod";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * POST /api/upload
 * 
 * Upload an image to Cloudinary.
 * Requires authentication.
 */
export const POST = withValidate(
  async (req: NextRequest) => {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "root-suppliers";

    if (!file) {
      throw new ValidationError("No file provided");
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new ValidationError("Invalid file type. Allowed: JPEG, PNG, GIF, WebP, SVG");
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new ValidationError("File size exceeds 10MB limit");
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: "image",
          transformation: [
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(buffer);
    });

    return successResponse({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    }, 200, "Image uploaded successfully");
  },
  { requireAuth: true }
);

/**
 * DELETE /api/upload
 * 
 * Delete an image from Cloudinary.
 * Requires authentication (admin only).
 */
export const DELETE = withValidate(
  async (req: NextRequest, validatedData: any) => {
    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(validatedData.publicId);

    if (result.result !== "ok") {
      throw new ValidationError("Failed to delete image from Cloudinary");
    }

    return successResponse({}, 200, "Image deleted successfully");
  },
  {
    schema: z.object({ publicId: z.string().min(1) }),
    requireAdmin: true,
  }
);

