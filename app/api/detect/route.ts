import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { fileUrl } = await req.json();
  const response = await fetch(
    "https://api-inference.huggingface.co/models/facebook/detr-resnet-50",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: fileUrl,
      }),
    }
  );

  if (!response.ok) {
    console.log("Error in response:", response);
  }
  const result = await response.json();
  if (result.length < 0) {
    console.log("wtf");
  }
  console.log("RESULTTTTT", result);
  return NextResponse.json({ result: result });
}
