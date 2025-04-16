import { NextResponse } from "next/server";
import OpenAI from "openai";
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.NEXT_PUBLIC_OPEN_ROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { fileUrl } = await req.json();
    if (!fileUrl) {
      return NextResponse.json(
        { error: "File URL is required" },
        { status: 400 }
      );
    }
    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-4-maverick:free",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Identify all objects in this image and provide their names in an array format. Remember only in array format. Do not include any other text.",
            },
            {
              type: "image_url",
              image_url: {
                url: fileUrl,
              },
            },
          ],
        },
      ],
    });
    return NextResponse.json({ message: completion.choices[0].message });
  } catch (error) {
    console.error("Error detecting image:", error);
    return NextResponse.json(
      { error: "Failed to process the image" },
      { status: 500 }
    );
  }
}
