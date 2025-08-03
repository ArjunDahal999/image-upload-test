import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { validateFile } from "@/app/upload/utils/fileValidation";
import { UploadedImage } from "@/types/image";

export async function POST(request: NextRequest) {
  try {
    // Check authentication

    const formData = await request.formData();
    const files = formData.getAll("images") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Validate all files
    const validationErrors: string[] = [];
    files.forEach((file, index) => {
      const validation = validateFile(file);
      if (!validation.isValid) {
        validationErrors.push(
          `File ${index + 1}: ${validation.errors.join(", ")}`
        );
      }
    });

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      );
    }

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", "salons");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Process and save files
    const uploadedImages: UploadedImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = path.extname(file.name);
      const filename = `${timestamp}-${randomString}${extension}`;
      const filepath = path.join(uploadDir, filename);

      // Write file to disk
      await writeFile(filepath, buffer);

      // Create response object
      const uploadedImage: UploadedImage = {
        url: `/uploads/salons/${filename}`,
        filename: filename,
        isFeatured: i === 0, // First image is featured
      };

      uploadedImages.push(uploadedImage);
    }

    return NextResponse.json({
      success: true,
      images: uploadedImages,
      message: `Successfully uploaded ${uploadedImages.length} image(s)`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
