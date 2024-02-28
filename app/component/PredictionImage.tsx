"use client";

import { useStore } from "@/store";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import Image from "next/image";
import { useRef } from "react";
import Result from "./Result";

function PredictionImage() {
  const { identifyImage, hasInit, imagePrediction, imageProbability } =
    useStore().modelStore;
  const imageRef = useRef<HTMLImageElement>(null);
  const Group = observer(() => {
    return (
      <div className='flex h-full flex-col justify-evenly'>
        <button
          className={clsx("btn btn-primary", {
            "btn-disabled": !hasInit,
          })}
          onClick={() => {
            identifyImage(imageRef.current!);
          }}
        >
          验证图片
        </button>
        <Result prediction={imagePrediction} probability={imageProbability} />
      </div>
    );
  });

  return (
    <div className='flex size-2/3 flex-col items-center justify-between'>
      <Image
        ref={imageRef}
        id='img'
        src='https://i.imgur.com/JlUvsxa.jpg'
        width='227'
        height='227'
        alt={""}
      />
      <Group />
    </div>
  );
}
export default observer(PredictionImage);
