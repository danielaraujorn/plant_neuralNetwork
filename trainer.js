class Trainer {
  // TODO: document what a, b, c are
  constructor(nn) {
    this.nn = nn;
  }
  train(dataset, iterations = 10000, learningRate = 0.05) {
    // console.log(dataset);
    return new Promise(resolve => {
      this.nn.setLearningRate(learningRate);
      for (let i = 0; i < iterations; i++) {
        for (let j = 0; j < dataset.length; j++) {
          this.nn.train(dataset[j].input, dataset[j].output);
        }
      }
      resolve();
    });
  }
}

module.exports = Trainer;
