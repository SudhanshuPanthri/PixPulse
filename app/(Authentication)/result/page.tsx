"use client";
import { SparkleCard } from "@/components/card";
import Header from "@/components/header";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Stage, Layer, Rect, Image as KonvaImage, Text } from "react-konva";
import useImage from "use-image";

const ImagePage = () => {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl");
  const publicId = searchParams.get("public_id");
  const [display, setDisplay] = useState(false);
  const router = useRouter();
  if (!imageUrl) {
    router.push("/upload");
    return null;
  }
  const [image] = useImage(imageUrl || "");
  const detections = JSON.parse(localStorage.getItem("detections") || "[]");
  const [imageDimensions, setImageDimensions] = useState({
    width: 800,
    height: 600,
  });
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleDelete = async () => {
    const deleteResponse = await fetch("/api/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId: publicId }),
    });
    console.log(deleteResponse);
  };

  useEffect(() => {
    console.log(publicId);
    if (image) {
      const img = new Image();
      img.src = imageUrl!;
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };

      const handleAsyncTimeouts = async () => {
        await delay(5000);
        setDisplay(true);
        await delay(2000);
        await handleDelete();
      };
      handleAsyncTimeouts();
    }
  }, [image]);
  if (!detections) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <h1 className="text-2xl font-bold text-slate-700 dark:text-slate-300">
          No image detected
        </h1>
      </div>
    );
  }

  const scaleX = 800 / imageDimensions.width;
  const scaleY = 600 / imageDimensions.height;

  if (!display) {
    return (
      <>
        <Header />
        <div className="h-[80vh] w-full flex flex-col items-center justify-center">
          <SparkleCard fileUrl={imageUrl} />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="h-[90vh] w-full flex items-center justify-center">
        <div className="w-[50%] flex items-center justify-center">
          <Stage width={800} height={600} className="border-4 rounded-lg p-4">
            <Layer>
              <KonvaImage image={image} width={800} height={600} />
              {detections.map((detection: any, index: number) => (
                <>
                  <Rect
                    key={index}
                    x={detection.box.xmin * scaleX}
                    y={detection.box.ymin * scaleY}
                    width={(detection.box.xmax - detection.box.xmin) * scaleX}
                    height={(detection.box.ymax - detection.box.ymin) * scaleY}
                    stroke="red"
                    strokeWidth={2}
                    cornerRadius={8}
                    fill="rgba(255, 0, 0, 0.05)"
                    shadowColor="black"
                    shadowBlur={10}
                    shadowOffset={{ x: 2, y: 2 }}
                    shadowOpacity={0.5}
                  />
                  <Text
                    key={index + 100}
                    x={detection.box.xmin * scaleX + 5}
                    y={detection.box.ymin * scaleY - 20}
                    text={`${detection.label} (${(
                      detection.score * 100
                    ).toFixed(1)}%)`}
                    fontSize={14}
                    fill="red"
                    fontStyle="bold"
                    wrap="word"
                  />
                </>
              ))}
            </Layer>
          </Stage>
        </div>
        <div className="w-[60%] h-full flex flex-col justify-start items-center">
          <h2 className="mb-10 mt-8 text-2xl font-bold">
            Identified Objects and their score
          </h2>
          <div className="w-full h-full flex items-center justify-center flex-wrap px-4 py-2 gap-2">
            {detections.map((detection: any, index: number) => (
              <div
                className={`w-[45%] h-[8%] flex items-center justify-center rounded-md bg-gray-100 ${
                  detection.score > 0.7 ? "text-green-900" : "text-red-900"
                }`}
                key={index}
              >
                {detection.label} - {detection.score.toFixed(2) * 100}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ImagePage;
