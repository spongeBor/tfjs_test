import { getMobileNet, getTF } from "@/util";
import { MobileNet } from "@tensorflow-models/mobilenet";
import { makeAutoObservable, runInAction } from "mobx";
import("@tensorflow/tfjs-backend-webgl");
class TransferModelStore {
  net!: MobileNet;
  imagePrediction = "";
  imageProbability = 0;
  videoPrediction = "";
  videoProbability = 0;
  customVideoPrediction = "";
  customVideoProbability = 0;
  startCamera = false;
  hasInit = false;
  webcamElement: HTMLVideoElement | null = null;
  webcam: any = null;
  classifier!: ReturnType<
    typeof import("@tensorflow-models/knn-classifier").create
  >;
  constructor() {
    makeAutoObservable(
      this,
      { net: false, webcamElement: false },
      { autoBind: true },
    );
  }
  async init() {
    if (this.net || this.hasInit) {
      return;
    }
    console.log("Loading mobilenet..");
    this.net = await (await getMobileNet()).load();

    this.hasInit = true;
    console.log("Successfully loaded model");
  }
  async identifyImage(
    ele: ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
  ) {
    const result = await this.net.classify(ele);
    runInAction(() => {
      this.imagePrediction = result[0].className;
      this.imageProbability = result[0].probability;
    });
  }
  async startIdentifyWithCamera(webcamElement: HTMLVideoElement) {
    if (!this.classifier) {
      this.classifier = (
        await import("@tensorflow-models/knn-classifier")
      ).create();
    }

    runInAction(() => {
      this.startCamera = true;
    });
    this.webcamElement = webcamElement;
    const tf = await getTF();
    this.webcam = await tf.data.webcam(this.webcamElement);
    while (this.startCamera) {
      const img = await this.webcam.capture();
      const result = await this.net.classify(img);
      if (this.classifier.getNumClasses() > 0) {
        const activation = this.net.infer(img, true);
        const result = await this.classifier.predictClass(activation);
        runInAction(() => {
          this.customVideoPrediction = result.label;
          this.customVideoProbability = result.confidences[result.label];
        });
      }
      runInAction(() => {
        this.videoPrediction = result[0].className;
        this.videoProbability = result[0].probability;
      });
      img.dispose();

      await tf.nextFrame();
    }
  }
  stopIdentifyWithCamera() {
    this.startCamera = false;
    // 暂停视频播放
    this.webcamElement!.pause();
    if (this.webcamElement?.srcObject) {
      const stream = this.webcamElement.srcObject;
      const tracks = (stream as any).getTracks();

      tracks.forEach((track: any) => {
        track.stop(); // 停止轨道（关闭摄像头或音频流）
      });

      // 清空媒体流
      this.webcamElement.srcObject = null;
      this.classifier.clearAllClasses();
      this.videoPrediction = "";
      this.videoProbability = 0;
      this.customVideoPrediction = "";
      this.customVideoProbability = 0;
    }
  }
  async addExample(classId: string) {
    if (!this.classifier) {
      this.classifier = (
        await import("@tensorflow-models/knn-classifier")
      ).create();
    }
    if (!this.webcam) return;

    // Capture an image from the web camera.
    const img = await this.webcam.capture();
    // Get the intermediate activation of MobileNet 'conv_preds' and pass that
    // to the KNN classifier.
    const activation = this.net.infer(img, true);

    // Pass the intermediate activation to the classifier.
    this.classifier.addExample(activation, classId);

    // Dispose the tensor to release the memory.
    img.dispose();
  }
}

const transferModelStore = new TransferModelStore();
export default transferModelStore;
