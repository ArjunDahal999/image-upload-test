import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    // Convert NextRequest to Node.js request-like object for formidable
    const formData = await request.formData();

    // Create a temporary file handling approach
    const uploadDir = path.join(process.cwd(), "public", "uploads", "salons");

    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploadedImages: any[] = [];
    let fileIndex = 0;

    // Process each file from formData
    for (const [key, value] of formData.entries()) {
      if (key === "images" && value instanceof File) {
        const file = value as File;
        const buffer = Buffer.from(await file.arrayBuffer());

        // Generate a unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const extension = path.extname(file.name);
        const newFilename = `${timestamp}-${randomString}${extension}`;
        const filepath = path.join(uploadDir, newFilename);

        // Write file to disk
        fs.writeFileSync(filepath, buffer);

        uploadedImages.push({
          url: `/uploads/salons/${newFilename}`,
          filename: newFilename,
          isFeatured: fileIndex === 0,
        });

        fileIndex++;
      }
    }

    if (uploadedImages.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
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
