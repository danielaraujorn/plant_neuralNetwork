var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
// var { Layer, Network, Trainer } = require("synaptic");
var NeuralNetwork = require("./nn");
var Trainer = require("./trainer");
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
var myNet = new NeuralNetwork(2, 6, 1);
var myTrainer = new Trainer(myNet);
// const xorDS = [
//   { input: [1, 1], output: [0] },
//   { input: [1, 0], output: [1] },
//   { input: [0, 1], output: [1] },
//   { input: [0, 0], output: [0] }
// ];
Dataset.run().then(myDataset => myTrainer.train(myDataset));

io.on("connection", function(socket) {
  socket.on("sendsensor", data => {
    lastData[data.serial] = data.value;
    let saida = predict(lastData.umd, lastData.luz);
    saida > 0.8 ? (saida = 1) : saida < 0.2 && (saida = 0);
    io.emit("returnvalue", saida);
    if (saida !== lastData.bmb) console.log("novo estado:" + saida, new Date());
    // console.log(data, `saindo: ${saida}`);
    lastData.bmb = saida;
  });
  socket.on("getvalue", data => {
    // console.log("retornando", lastData.bmb);
    socket.emit("returnvalue", lastData.bmb);
  });
  // console.log("a user is connected");
});
var port = process.env.PORT || 3001;
http.listen(port, function() {
  console.log("listening on *:" + port);
});
var lastData = {
  luz: 0.7,
  umd: 0,
  bmb: 1
};
const intervalo = () =>
  setInterval(() => {
    if (lastData.umd > 1) lastData.umd = 0;
    else lastData.umd += 0.05;

    console.log(
      lastData.umd,
      lastData.luz,
      predict(lastData.umd, lastData.luz)
    );
  }, 400);

const predict = (umidade, luminosidade) =>
  myNet.predict([umidade, luminosidade]);

var trainingSet = [
  {
    input: [0, 0.7],
    output: [0]
  },
  {
    input: [0.1, 0.4],
    output: [0]
  },
  {
    input: [0.2, 0.8],
    output: [0]
  },
  {
    input: [0.3, 0.74],
    output: [0.5]
  },
  {
    input: [0.35, 0.7],
    output: [0.5]
  },
  {
    input: [0.4, 0.7],
    output: [1]
  },
  {
    input: [0.5, 0.7],
    output: [1]
  },
  {
    input: [0.6, 0.7],
    output: [1]
  },
  {
    input: [0.7, 0.7],
    output: [1]
  },
  {
    input: [0.8, 0.7],
    output: [1]
  },
  {
    input: [0.9, 0.7],
    output: [1]
  },
  {
    input: [1, 0.7],
    output: [1]
  },
  {
    input: [0.8, 0.85],
    output: [0]
  },
  {
    input: [0.3, 0.85],
    output: [0]
  },
  {
    input: [0.8, 0.2],
    output: [0]
  },
  {
    input: [0.8, 0.6],
    output: [1]
  }
];
// trainingSet.forEach(item =>
//   Dataset.save({
//     input: item.input,
//     output: item.output
//   }).then(data => console.log(data))
// );
