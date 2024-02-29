import { Sequential, Tensor } from "@tensorflow/tfjs";

interface IData {
  horsepower: number;
  mpg: number;
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
  const { render, show } = await import("@tensorflow/tfjs-vis");
  render.scatterplot(
    { name: "Horsepower v MPG" },
    { values },
    {
      xLabel: "Horsepower",
      yLabel: "MPG",
      height: 300,
    },
  );

  // More code will be added below
  const model = await createModel();
  show.modelSummary({ name: "Model Summary" }, model);
  // Convert the data to a form we can use for training.
  const tensorData = await convertToTensor(data);
  const { inputs, labels } = tensorData;

  // Train the model
  await trainModel(model, inputs, labels);
  console.log("Done Training");
}
export async function createModel() {
  // Create a sequential model
  const tf = await import("@tensorflow/tfjs");
  const model = tf.sequential();

  // Add a single input layer
  model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true }));

  // Add an output layer
  model.add(tf.layers.dense({ units: 1, useBias: true }));

  return model;
}

/**
 * Convert the input data to tensors that we can use for machine
 * learning. We will also do the important best practices of _shuffling_
 * the data and _normalizing_ the data
 * MPG on the y-axis.
 */
async function convertToTensor(data: IData[]) {
  // Wrapping these calculations in a tidy will dispose any
  // intermediate tensors .hn
  const tf = await import("@tensorflow/tfjs");
  return tf.tidy(() => {
    // Step 1. Shuffle the data
    tf.util.shuffle(data);

    // Step 2. Convert data to Tensor
    const inputs = data.map((d) => d.horsepower);
    const labels = data.map((d) => d.mpg);

    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
    const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

    //Step 3. Normalize the data to the range 0 - 1 using min-max scaling
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
  const tf = await import("@tensorflow/tfjs");
  const { show } = await import("@tensorflow/tfjs-vis");
  // Prepare the model for training.
  model.compile({
    optimizer: tf.train.adam(),
    loss: tf.losses.meanSquaredError,
    metrics: ["mse"],
  });

  const batchSize = 32;
  const epochs = 50;

  return await model.fit(inputs, labels, {
    batchSize,
    epochs,
    shuffle: true,
    callbacks: show.fitCallbacks(
      { name: "Training Performance" },
      ["loss", "mse"],
      { height: 200, callbacks: ["onEpochEnd"] },
    ),
  });
}
