const sensores = [{ dispvalue: 100 }];

var Neuron = synaptic.Neuron,
  Layer = synaptic.Layer,
  Network = synaptic.Network,
  Trainer = synaptic.Trainer,
  Architect = synaptic.Architect;
function Perceptron(input, hidden, output) {
  // create the layers
  var inputLayer = new Layer(input);
  var hiddenLayer = new Layer(hidden);
  var outputLayer = new Layer(output);

  // connect the layers
  inputLayer.project(hiddenLayer);
  hiddenLayer.project(outputLayer);

  // set the layers
  this.set({
    input: inputLayer,
    hidden: [hiddenLayer],
    output: outputLayer
  });
}

// extend the prototype chain
Perceptron.prototype = new Network();
Perceptron.prototype.constructor = Perceptron;
var myPerceptron = new Perceptron(2, 20, 1);
var myTrainer = new Trainer(myPerceptron);
function getValue(analog, d) {
  return analog / d;
}
var trainingSet = [
  {
    input: [getValue(15, 24), getValue(0, 1024)],
    output: [1]
  },
  {
    input: [getValue(15, 24), getValue(100, 1024)],
    output: [1]
  },
  {
    input: [getValue(15, 24), getValue(200, 1024)],
    output: [1]
  },
  {
    input: [getValue(15, 24), getValue(300, 1024)],
    output: [1]
  },
  {
    input: [getValue(15, 24), getValue(400, 1024)],
    output: [1]
  },
  {
    input: [getValue(16, 24), getValue(200, 1024)],
    output: [1]
  },
  {
    input: [getValue(16, 24), getValue(300, 1024)],
    output: [1]
  },
  {
    input: [getValue(16, 24), getValue(500, 1024)],
    output: [0]
  },
  {
    input: [getValue(16, 24), getValue(600, 1024)],
    output: [0]
  },
  {
    input: [getValue(16, 24), getValue(700, 1024)],
    output: [0]
  },
  {
    input: [getValue(16, 24), getValue(1000, 1024)],
    output: [0]
  },
  {
    input: [getValue(16, 24), getValue(1024, 1024)],
    output: [0]
  },
  {
    input: [getValue(15, 24), getValue(800, 1024)],
    output: [0]
  },
  {
    input: [getValue(15, 24), getValue(900, 1024)],
    output: [0]
  }
];

myTrainer.train(trainingSet, {
  rate: 0.05,
  iterations: 10000,
  error: 0.01,
  shuffle: true,
  log: 500,
  cost: Trainer.cost.CROSS_ENTROPY
});

function predict(array) {
  console.log("input:", array, "\noutput:", myPerceptron.activate(array));
}
predict([getValue(16, 24), getValue(700, 1024)]);
predict([getValue(15, 24), getValue(1000, 1024)]);
