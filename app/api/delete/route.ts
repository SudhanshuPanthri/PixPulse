import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const { publicId } = await req.json();

  if (!publicId) {
    return NextResponse.json(
      { error: "Public ID is required" },
      { status: 400 }
    );
  }

  try {
    const result = await cloudinary.v2.uploader.destroy(publicId);
    return NextResponse.json(
      { message: "Image deleted successfully", result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { message: "Error deleting Image", error },
      { status: 400 }
    );
  }
}
