"use client";
import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import Header from "@/components/header";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const handleFileUpload = (file: File) => {
    setFile(file);
    console.log(file);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
      <Header />
      <FileUpload onChange={handleFileUpload} />
    </div>
  );
}
