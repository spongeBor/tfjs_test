"use client";
import { useEffect, useRef } from "react";
import ReBack from "../component/ReBack";
import { useStore } from "../store";
import LoadingModel from "./LoadingModel";
import PredictionCamera from "./PredictionCamera";
import PredictionImage from "./PredictionImage";

export default function TransferPage() {
  const { init } = useStore().transferModelStore;
  useEffect(() => {
    if (countRef.current === 1) {
      return;
    }
    setTimeout(() => {
      init();
    }, 1000);
    countRef.current = 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const countRef = useRef(0);
  return (
    <main className='relative flex h-screen w-screen items-center justify-center'>
      <div className='absolute top-20'>
        <LoadingModel />
      </div>
      <PredictionImage />
      <PredictionCamera />
      <div className='absolute left-4 top-4'>
        <ReBack />
      </div>
    </main>
  );
}
