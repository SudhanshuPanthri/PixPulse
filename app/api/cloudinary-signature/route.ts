import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const { folder, public_id, timestamp } = await req.json();
    const signature = cloudinary.utils.api_sign_request(
      { folder, public_id, timestamp },
      process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!
    );
    return NextResponse.json({ signature, timestamp });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate signature" },
      { status: 500 }
    );
  }
}
