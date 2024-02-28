import { getTF, getTFVis } from "@/util";
import { Sequential, Tensor } from "@tensorflow/tfjs";

interface IData {
  horsepower: number;
  mpg: number;
}
interface INormalizationData {
  inputMax: Tensor;
  inputMin: Tensor;
  labelMax: Tensor;
  labelMin: Tensor;
}
export async function getData() {
  const carsDataResponse = await fetch(
    "https://storage.googleapis.com/tfjs-tutorials/carsData.json",
  );
  const carsData = await carsDataResponse.json();
  const cleaned: IData[] = carsData
    .map((car: any) => ({
      mpg: car.Miles_per_Gallon,
      horsepower: car.Horsepower,
    }))
    .filter((car: any) => car.mpg != null && car.horsepower != null);

  return cleaned;
}
export async function run() {
  // Load and plot the original input data that we are going to train on.
  const data = await getData();
  const values = data.map((d) => ({
    x: d.horsepower,
    y: d.mpg,
  }));
  const { render, show } = await getTFVis();
  // 画图用的
  render.scatterplot(
    { name: "Horsepower v MPG" },
    { values },
    {
      xLabel: "Horsepower",
      yLabel: "MPG",
      height: 300,
    },
  );

  const model = await createModel();
  // 在图中显示模型的摘要
  show.modelSummary({ name: "Model Summary" }, model);
  // Convert the data to a form we can use for training.
  const tensorData = await convertToTensor(data);
  const { inputs, labels } = tensorData;
  // Train the model
  await trainModel(model, inputs, labels);
  console.log("Done Training");
  // Make some predictions using the model and compare them to the
  // original data
  await testModel(model, data, tensorData);
}

/**
 * 创建模型
 * @returns model
 */
async function createModel() {
  // Create a sequential model
  const tf = await import("@tensorflow/tfjs");
  // 顺序模型，只支持线性堆叠的层
  const model = tf.sequential();

  // Add a single input layer
  // 添加全连接层：
  // 该层只有 1个输入，1个输出， inputShape 对应输入的Tensor形状，[1]意思是形状如[, 1]的Tensor,即n行1列
  model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true })); // useBias 是否使用偏置，这个值有没有都行，类型于函数 ax + b 中的b
  //   model.add(tf.layers.dense({ units: 25, activation: "sigmoid" })); // 激活函数 sigmoid 是一个非线形的激活函数，可以用于分类问题
  // 激活函数 relu 是一个非线形的激活函数，相比sigmoid的优点是计算量小，训练速度快，还能预防梯度消失
  // 梯度消失：在深度学习中，梯度消失是指在反向传播过程中，梯度值不断减小，最终趋于0，导致权重无法更新，模型无法训练
  //   model.add(tf.layers.dense({ units: 50, activation: "relu" }));
  //   model.add(tf.layers.dense({ units: 25, activation: "relu" }));

  // 添加输出层，只有一个输出
  model.add(tf.layers.dense({ units: 1, useBias: true }));

  return model;
}

async function convertToTensor(data: IData[]) {
  const tf = await getTF();
  return tf.tidy(() => {
    // 1. 打乱数据
    tf.util.shuffle(data);

    // 2. 把数据转成Tensor
    const inputs = data.map((d) => d.horsepower);
    const labels = data.map((d) => d.mpg);
    // [inputs.length, 1] 的意思是tensor的形状是inputs.length行，1列
    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
    const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

    // 归一化
    // (每个元素-最小值)/（最大值-最小值）
    // 优点： 保留了数据的分布形状，不会改变原始数据的分布， 如果都是正数就分布于0-1之间，如果有负数就分布于-1-1之间
    const inputMax = inputTensor.max();
    const inputMin = inputTensor.min();
    const labelMax = labelTensor.max();
    const labelMin = labelTensor.min();

    const normalizedInputs = inputTensor
      .sub(inputMin)
      .div(inputMax.sub(inputMin));
    const normalizedLabels = labelTensor
      .sub(labelMin)
      .div(labelMax.sub(labelMin));

    return {
      inputs: normalizedInputs,
      labels: normalizedLabels,
      // Return the min/max bounds so we can use them later.
      inputMax,
      inputMin,
      labelMax,
      labelMin,
    };
  });
}

async function trainModel(model: Sequential, inputs: Tensor, labels: Tensor) {
  const tf = await getTF();
  const { show } = await getTFVis();
  // Prepare the model for training.
  /**
   * optimizer（优化器）：优化器用于指定模型的训练方式。它决定了如何调整模型的参数（例如权重）以最小化损失函数。在这段代码中，tf.train.adam()表示使用Adam优化器进行模型训练。Adam是一种常用的优化算法，它基于梯度的一阶矩估计和二阶矩估计来自适应地调整每个参数的学习率。
   * loss（损失函数）：损失函数用于衡量模型预测结果与真实标签之间的差异或误差程度。在这段代码中，tf.losses.meanSquaredError表示使用均方误差（Mean Squared Error，MSE）作为损失函数。均方误差是回归任务中常用的损失函数，它计算模型预测结果与真实标签之间的平方差，并将所有样本的平方差取平均作为损失值。
   * metrics（评估指标）：评估指标用于衡量模型在训练过程中的性能。在这段代码中，["mse"]表示使用均方误差作为评估指标。这意味着在每个训练周期结束时，模型将计算并输出训练集上的均方误差，以便开发者监控模型的训练情况。
   */
  // tensorflow中的compile方法用于配置模型的训练方式
  model.compile({
    optimizer: tf.train.adam(),
    loss: tf.losses.meanSquaredError,
    metrics: ["mse"],
  });

  const batchSize = 32; // 每次训练的数据量， 即每次tensor的行数为32行，可以理解为每次输入上面定义的神经网络的tensor形状为[32, 1]
  const epochs = 200; // 迭代轮次，即训练200次，可以理解为32组数据为一组，一共训练200次
  // 开始训练
  return await model.fit(inputs, labels, {
    batchSize,
    epochs,
    shuffle: true, // 每轮训练是否打乱数据
    callbacks: show.fitCallbacks(
      { name: "Training Performance" },
      ["loss", "mse"],
      { height: 200, callbacks: ["onEpochEnd"] }, // callbacks指的是回调时机，onEpochEnd表示在每轮（全部数据集过一次）训练结束时调用
    ),
  });
}

async function testModel(
  model: Sequential,
  inputData: IData[],
  normalizationData: INormalizationData,
) {
  const { inputMax, inputMin, labelMin, labelMax } = normalizationData;

  const tf = await getTF();
  const { render } = await getTFVis();
  const [xs, preds] = tf.tidy(() => {
    const xs = tf.linspace(0, 1, 100); // 生成100个 0-1 之间的等差数列
    const preds = model.predict(xs.reshape([100, 1])); // 升维并进行预测

    // 反归一化
    const unNormXs = xs.mul(inputMax.sub(inputMin)).add(inputMin);
    const unNormPreds = (preds as any)
      .mul(labelMax.sub(labelMin))
      .add(labelMin);

    // Un-normalize the data
    return [unNormXs.dataSync(), unNormPreds.dataSync()]; // 从tensor中提取数据
  });

  const predictedPoints = Array.from(xs).map((val, i) => {
    return { x: val, y: preds[i] };
  });

  const originalPoints = inputData.map((d) => ({
    x: d.horsepower,
    y: d.mpg,
  }));

  render.scatterplot(
    { name: "Model Predictions vs Original Data" },
    {
      values: [originalPoints, predictedPoints],
      series: ["original", "predicted"],
    },
    {
      xLabel: "Horsepower",
      yLabel: "MPG",
      height: 300,
    },
  );
}
