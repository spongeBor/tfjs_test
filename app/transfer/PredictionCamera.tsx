"use client";

import { useStore } from "@/store";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { useRef } from "react";
import Result from "./Result";

const CameraResult = observer(() => {
  const { videoPrediction, videoProbability } = useStore().transferModelStore;
  return <Result prediction={videoPrediction} probability={videoProbability} />;
});
function PredictionCamera() {
  const {
    hasInit,
    startCamera,
    startIdentifyWithCamera,
    stopIdentifyWithCamera,
  } = useStore().transferModelStore;
  const onOpen = () => {
    if (startCamera) {
      stopIdentifyWithCamera();
    } else {
      startIdentifyWithCamera(videoRef.current!);
      videoRef.current;
    }
  };
  const videoRef = useRef<HTMLVideoElement>(null);

  const Group = observer(() => {
    return (
      <div className='flex h-full flex-col justify-evenly'>
        <button
          onClick={onOpen}
          className={clsx("btn btn-primary", { "btn-disabled": !hasInit })}
        >
          {startCamera ? "关闭摄像头识别" : "开启摄像头识别"}
        </button>
        <CameraResult />
      </div>
    );
  });
  return (
    <div className='flex size-1/2 flex-col items-center justify-center'>
      <video
        autoPlay
        playsInline
        muted
        width='224'
        height='224'
        ref={videoRef}
      ></video>
      <Group />
    </div>
  );
}
export default observer(PredictionCamera);
