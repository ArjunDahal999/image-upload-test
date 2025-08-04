// app/uploads/salons/[imageName]/route.ts

import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { imageName: string } }
) {
  const imageName = params.imageName;
  const imagePath = path.join(
    process.cwd(),
    "public",
    "uploads",
    "salons",
    imageName
  );

  try {
    const imageBuffer = await fs.readFile(imagePath);

    // Determine the content type based on the file extension
    const contentType = `image/${path.extname(imageName).slice(1)}`;

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable", // Add caching headers for performance
      },
    });
  } catch (error) {
    console.error(`Error serving image: ${imageName}`, error);
    return new NextResponse("Image not found", { status: 404 });
  }
}
