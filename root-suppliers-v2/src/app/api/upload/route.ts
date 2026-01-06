import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

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
 * 
 * Accepts multipart/form-data with:
 * - file: The image file to upload
 * - folder: Optional folder name (default: 'root-suppliers')
 * 
 * @returns { success: boolean, url: string, publicId: string, ... }
 */
export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "root-suppliers";

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
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
      return NextResponse.json(
        {
          success: false,
          message: "Invalid file type. Allowed: JPEG, PNG, GIF, WebP, SVG",
        },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: "File size exceeds 10MB limit" },
        { status: 400 }
      );
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

    return NextResponse.json(
      {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        message: "Image uploaded successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("POST /api/upload error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to upload image",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/upload
 * 
 * Delete an image from Cloudinary.
 * Requires authentication (admin only).
 * 
 * @body { publicId: string }
 * @returns { success: boolean, message: string }
 */
export async function DELETE(req: NextRequest) {
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

    const body = await req.json();

    if (!body.publicId) {
      return NextResponse.json(
        { success: false, message: "Public ID is required" },
        { status: 400 }
      );
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(body.publicId);

    if (result.result !== "ok") {
      return NextResponse.json(
        { success: false, message: "Failed to delete image" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Image deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE /api/upload error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to delete image",
      },
      { status: 500 }
    );
  }
}
