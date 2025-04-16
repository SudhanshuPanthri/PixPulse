"use client";
import React, { useState } from "react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

type buttonProps = {
  file: File | null;
};

export function Button({ file }: buttonProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
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
        console.log("File uploaded successfully", data);
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
        className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 cursor-pointer"
        onClick={handleUpload}
      >
        <AceternityLogo />
        <span>Upload</span>
      </HoverBorderGradient>
    </div>
  );
}

const AceternityLogo = () => {
  return (
    <svg
      width="66"
      height="65"
      viewBox="0 0 66 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-3 w-3 text-black dark:text-white"
    >
      <path
        d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
        stroke="currentColor"
        strokeWidth="15"
        strokeMiterlimit="3.86874"
        strokeLinecap="round"
      />
    </svg>
  );
};
