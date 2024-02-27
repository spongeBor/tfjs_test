"use client";

import { useStore } from "@/store";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
const Result = observer(() => {
  const { prediction, probability } = useStore().modelStore;

  return (
    <div className='fixed bottom-10 left-10 size-1/5 rounded-lg border-2 border-primary p-4'>
      <div>prediction: {prediction}</div>
      <div>probability: {probability}</div>
    </div>
  );
});
export default function PredictionImage() {
  const { init, identifyImage } = useStore().modelStore;
  useEffect(() => {
    if (countRef.current === 1) {
      return;
    }
    init().then(() => setHasInit(true));
    countRef.current = 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const countRef = useRef(0);
  const [hasInit, setHasInit] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);

  return (
    <div className='flex h-1/2 w-1/2 flex-col items-center justify-center'>
      <Image
        ref={imageRef}
        id='img'
        src='https://i.imgur.com/JlUvsxa.jpg'
        width='227'
        height='227'
        alt={""}
      />

      <div className='flex flex-col justify-center'>
        {!hasInit && (
          <div className='mb-8 flex'>
            <div className='text-3xl text-primary'>正在加载模型</div>
            <div className='loading loading-dots text-primary'></div>
          </div>
        )}
        <button
          className={clsx("btn btn-primary btn-sm", {
            "btn-disabled": !hasInit,
          })}
          onClick={() => {
            identifyImage(imageRef.current!);
          }}
        >
          验证图片
        </button>
      </div>
      <Result />
    </div>
  );
}
