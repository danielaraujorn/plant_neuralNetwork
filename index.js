var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var { Layer, Network, Trainer } = require("synaptic");
var Blob = require("blob");
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
  myTrainer.train(trainingSet, {
    rate: 0.1,
    iterations: 10000,
    error: 0.01,
    shuffle: true,
    cost: Trainer.cost.CROSS_ENTROPY
  })
);

io.on("connection", function(socket) {
  socket.on("sendsensor", data => {
    lastData[data.serial] = data.value;
    let saida = predict(lastData.umd, lastData.luz);
    console.log(data, `saindo: ${saida}`);
    saida > 0.9
      ? socket.emit("returnvalue", 1)
      : saida < 0.1 && socket.emit("returnvalue", 0);
  });
  socket.on("getvalue", data => {
    console.log("get value", data);
    socket.emit("returnvalue", 1);
  });
  console.log("a user is connected");
});
var port = process.env.PORT || 3001;
http.listen(port, function() {
  console.log("listening on *:" + port);
});
var lastData = {
  luz: 0.2,
  umd: 0,
  bmb: 0
};

// setInterval(() => {
//   if (lastData.umd > 1) lastData.umd = 0;
//   else lastData.umd += 0.05;

//   predict(lastData.umd, lastData.luz);
// }, 400);

const predict = (umidade, luminosidade) =>
  myNet.activate([umidade, luminosidade]);

var trainingSet = [
  {
    input: [0, 200 / 1023],
    output: [0]
  },
  {
    input: [0.1, 200 / 1023],
    output: [0]
  },
  {
    input: [0.2, 200 / 1023],
    output: [0]
  },
  {
    input: [0.3, 200 / 1023],
    output: [0.5]
  },
  {
    input: [0.35, 200 / 1023],
    output: [0.5]
  },
  {
    input: [0.4, 200 / 1023],
    output: [1]
  },
  {
    input: [0.5, 200 / 1023],
    output: [1]
  },
  {
    input: [0.6, 200 / 1023],
    output: [1]
  },
  {
    input: [0.7, 200 / 1023],
    output: [1]
  },
  {
    input: [0.8, 200 / 1023],
    output: [1]
  },
  {
    input: [0.9, 200 / 1023],
    output: [1]
  },
  {
    input: [1, 200 / 1023],
    output: [1]
  }
];
// trainingSet.forEach(item =>
//   Dataset.save({
//     input: item.input,
//     output: item.output
//   }).then(data => console.log(data))
// );
