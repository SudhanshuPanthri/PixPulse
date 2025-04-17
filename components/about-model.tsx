import React from "react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import Image from "next/image";

export function AboutModel() {
  return (
    <BackgroundGradientAnimation>
      <div className="absolute z-50 inset-0 flex flex-col items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl">
        <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20">
          About The Model
        </p>
        <p className="text-md my-4">Facebook DETR-RESNET-50</p>
        <p className="text-[20px] tracking-tight leading-[1.5] w-[60%] my-10">
          The DETR model is an encoder-decoder transformer with a convolutional
          backbone. Two heads are added on top of the decoder outputs in order
          to perform object detection: a linear layer for the class labels and a
          MLP (multi-layer perceptron) for the bounding boxes. The model uses
          so-called object queries to detect objects in an image. Each object
          query looks for a particular object in the image.
        </p>
        <Image src="/About.png" alt="model-image" width={900} height={900} />
      </div>
    </BackgroundGradientAnimation>
  );
}
