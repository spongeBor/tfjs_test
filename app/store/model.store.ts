import { MobileNet, load } from "@tensorflow-models/mobilenet";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import { makeAutoObservable } from "mobx";
class ModelStore {
  net!: MobileNet;
  prediction = "";
  probability = 0;
  startCamera = false;
  constructor() {
    makeAutoObservable(this, { startCamera: false }, { autoBind: true });
  }
  async init() {
    if (this.net) {
      return;
    }
    console.log("Loading mobilenet..");
    this.net = await load();
    console.log("Successfully loaded model");
  }
  async identifyImage(
    ele: ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
  ) {
    const result = await this.net.classify(ele);
    this.prediction = result[0].className;
    this.probability = result[0].probability;
  }
  async startIdentifyWithCamera(webcamElement: HTMLVideoElement) {
    this.startCamera = true;
    const webcam = await tf.data.webcam(webcamElement);
    while (this.startCamera) {
      const img = await webcam.capture();
      const result = await this.net.classify(img);
      this.prediction = result[0].className;
      this.probability = result[0].probability;
      img.dispose();
      await tf.nextFrame();
    }
  }
  stopIdentifyWithCamera() {
    this.startCamera = false;
  }
}

const model = new ModelStore();
export default model;
