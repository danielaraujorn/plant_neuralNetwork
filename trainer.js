class Trainer {
  // TODO: document what a, b, c are
  constructor(nn) {
    this.nn = nn;
  }
  train(dataset, { iterations, learningRate }) {
    new Promise(resolve => {
      this.nn.setLearningRate(learningRate);
      for (let i = 0; i < iterations; i++) {
        nn.train(dataset.input, dataset.output);
      }
      resolve();
    });
  }
}
