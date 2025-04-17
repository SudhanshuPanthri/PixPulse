"use client";

import Image from "next/image";
import { Tabs } from "@/components/ui/tabs";

export function StepByStepSection() {
  const tabs = [
    {
      title: "Step 1",
      value: "step1",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          <p>Upload Image</p>
          <DummyContent src="/image.png" />
        </div>
      ),
    },
    {
      title: "Step 2",
      value: "step2",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          <p>Open AI processes the image</p>
          <DummyContent src="/image-1.png" />
        </div>
      ),
    },
    {
      title: "Step 3",
      value: "step3",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          <p>Facebook detr-resnet-50 detect contents</p>
          <DummyContent src="/image-2.png" />
        </div>
      ),
    },
  ];

  return (
    <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full items-start justify-start my-20">
      <Tabs tabs={tabs} />
    </div>
  );
}

//TODO-Pass imageurl as prop to this component
const DummyContent = ({ src }: { src: string }) => {
  return (
    <Image
      src={src}
      alt="dummy image"
      width="1000"
      height="1000"
      className="object-contain object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
    />
  );
};
