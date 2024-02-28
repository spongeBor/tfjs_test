export async function getTF() {
  const tf = await import("@tensorflow/tfjs");
  return tf;
}
export async function getMobileNet() {
  const mobilenet = await import("@tensorflow-models/mobilenet");
  return mobilenet;
}
export async function getTFVis() {
  const vis = import("@tensorflow/tfjs-vis");
  return vis;
}
