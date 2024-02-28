"use client";
import { useEffect, useRef } from "react";
import LoadingModel from "./component/LoadingModel";
import PredictionCamera from "./component/PredictionCamera";
import PredictionImage from "./component/PredictionImage";
import { useStore } from "./store";

export default function Home() {
  const { init } = useStore().modelStore;
  useEffect(() => {
    if (countRef.current === 1) {
      return;
    }
    init();
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
    </main>
  );
}
