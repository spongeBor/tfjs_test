"use client";

import { run } from "./service";

export default function Container() {
  return <div className='size-1/2' ref={run}></div>;
}
