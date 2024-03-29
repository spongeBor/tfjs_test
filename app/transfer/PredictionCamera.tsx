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
const CustomCameraResult = observer(() => {
  const { customVideoPrediction, customVideoProbability } =
    useStore().transferModelStore;
  return (
    <Result
      prediction={customVideoPrediction}
      probability={customVideoProbability}
    />
  );
});
function PredictionCamera() {
  const {
    hasInit,
    startCamera,
    startIdentifyWithCamera,
    stopIdentifyWithCamera,
    addExample,
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
        <div className='flex justify-center *:btn-sm *:m-1'>
          <button
            className='btn btn-primary'
            onClick={() => addExample("石头")}
          >
            标记为石头
          </button>
          <button
            className='btn btn-primary'
            onClick={() => addExample("剪刀")}
          >
            标记为剪刀
          </button>
          <button className='btn btn-primary' onClick={() => addExample("布")}>
            标记为布
          </button>
        </div>
        <div className='flex *:m-2'>
          <div className='flex flex-col'>
            <div>原模型预测：</div>
            <CameraResult />
          </div>
          <div className='flex flex-col'>
            <div>自定义模型预测：</div>
            <CustomCameraResult />
          </div>
        </div>
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
