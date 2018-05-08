var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var { Layer, Network, Trainer } = require("synaptic");
var Blob = require("blob");
// var trainingSet = [
//   {
//     input: [0 / 1024, 200 / 1024],
//     output: [1]
//   },
//   {
//     input: [100 / 1024, 200 / 1024],
//     output: [1]
//   },
//   {
//     input: [200 / 1024, 200 / 1024],
//     output: [1]
//   },
//   {
//     input: [300 / 1024, 200 / 1024],
//     output: [1]
//   },
//   {
//     input: [400 / 1024, 200 / 1024],
//     output: [1]
//   },
//   {
//     input: [500 / 1024, 200 / 1024],
//     output: [0]
//   },
//   {
//     input: [600 / 1024, 200 / 1024],
//     output: [0]
//   },
//   {
//     input: [700 / 1024, 200 / 1024],
//     output: [0]
//   },
//   {
//     input: [800 / 1024, 200 / 1024],
//     output: [0]
//   },
//   {
//     input: [900 / 1024, 200 / 1024],
//     output: [0]
//   },
//   {
//     input: [1024 / 1024, 200 / 1024],
//     output: [0]
//   }
// ];
function MLP(input, hidden, output) {
  // create the layers
  var inputLayer = new Layer(input);
  var hiddenLayer = new Layer(hidden);
  var outputLayer = new Layer(output);

  // connect the layers
  inputLayer.project(hiddenLayer);
  hiddenLayer.project(outputLayer);

  // set the layers
  return {
    input: inputLayer,
    hidden: [hiddenLayer],
    output: outputLayer
  };
}

var thinky = require("thinky")({
  db: "plant_dataset",
  host: "localhost",
  port: 28015
});
var type = thinky.type;

var Dataset = thinky.createModel("dataset", {
  input: type.array().required(),
  output: type.array().required()
});
function getValue(analog, d) {
  return analog / d;
}
var myNet = new Network(MLP(2, 10, 1));
var myTrainer = new Trainer(myNet);
Dataset.run().then(myDataset =>
  myTrainer.train(myDataset, {
    rate: 0.1,
    iterations: 10000,
    error: 0.01,
    shuffle: true,
    cost: Trainer.cost.CROSS_ENTROPY
  })
);

io.on("connection", function(socket) {
  console.log("a user is connected");
});
var port = process.env.PORT || 3001;

var lastData = {
  luminosidade: 200,
  umidade: 0,
  valvula: 0
};
// trainingSet.forEach(item =>
//   Dataset.save({
//     input: item.input,
//     output: item.output
//   }).then(data => console.log(data))
// );

setInterval(() => {
  if (lastData.umidade > 1024 - 30) lastData.umidade = 0;
  else lastData.umidade += 30;

  predict(lastData.umidade, lastData.luminosidade);
}, 400);

function predict(umidade, luminosidade) {
  let saida = myNet.activate([umidade / 1024, luminosidade / 1024])[0];
  console.log(
    `umi: ${(umidade / 1024).toFixed(2)}, lum: ${(luminosidade / 1024).toFixed(
      2
    )}, saída: ${saida.toFixed(2)}, conclusão: ${
      Math.round(saida.toFixed(2)) ? "ligar" : "desligar"
    } a bomba de agua`
  );
}

// predict(400, 200);
// predict(700, 200);
