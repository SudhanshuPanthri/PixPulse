"use client";
import React, { useState } from "react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { IconLoader } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

type buttonProps = {
  file: File | null;
};

export function Button({ file }: buttonProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const router = useRouter();
  const handleUpload = async () => {
    if (!file) {
      console.log("No file selected");
      return;
    }
    setUploading(true);

    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const response = await fetch("/api/cloudinary-signature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          folder: "pixpulse",
          timestamp,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get signature");
      }

      const { signature } = await response.json();
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", "pixpulse");
      formData.append("expiration", (timestamp + 3600).toString());

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/dnlajhb7q/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (cloudinaryResponse.ok) {
        const data = await cloudinaryResponse.json();
        setUploadUrl(data.secure_url);

        const openAIResponse = await fetch("/api/open-ai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileUrl: data.secure_url }),
        });

        if (!openAIResponse.ok) {
          throw new Error("Failed to detect image");
        }

        const { message } = await openAIResponse.json();
        let labels: string[];
        labels = message.content;

        const replicateResponse = await fetch("/api/detect", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileUrl: data.secure_url }),
        });

        if (!replicateResponse.ok) {
          throw new Error("Failed to process image with Replicate");
        }
        const detections = await replicateResponse.json();
        //set the result in localstorage => TODO - delete immediately when user went back
        localStorage.setItem("detections", JSON.stringify(detections.result));
        router.push(
          `/result?imageUrl=${encodeURIComponent(data.secure_url)}&public_id=${
            data.public_id
          }`
        );
      } else {
        console.log("Failed to upload file", cloudinaryResponse.statusText);
      }
    } catch (error) {
      console.log("ERROR UPLOADING FILE", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="m-40 flex justify-center text-center">
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 cursor-pointer w-40 justify-center"
        onClick={handleUpload}
      >
        {uploading ? (
          <IconLoader className="h-4 w-4 animate-spin" />
        ) : (
          <span>Upload</span>
        )}
      </HoverBorderGradient>
    </div>
  );
}
