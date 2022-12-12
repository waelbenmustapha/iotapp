const express = require("express");
const mqtt = require("mqtt");
const {
  getAllResults,
  getByDates,
  getTableResults,
} = require("./requests/getSpecificResults");
const {
  insertTemperature,
  inserto2,
  insertFrequence,
  insertPression,
  insertSteps,
} = require("./requests/insertion");

const app = express();


var client = mqtt.connect("mqtt://broker.mqttdashboard.com", {
  protocolId: "MQIsdp",
  protocolVersion: 3,
});

client.on("connect", function () {
  console.log("Connected to mqtt broker");
});


client.subscribe("hc/temp");
client.subscribe("hc/o2");
client.subscribe("hc/freq");
client.subscribe("hc/pres");
client.subscribe("hc/steps");


client.on("message", function (topic, message) {
  switch (topic) {
    case "hc/temp":
      insertTemperature(message.toString());
      break;
    case "hc/o2":
      inserto2(message.toString());
      break;
    case "hc/freq":
      insertFrequence(message.toString());
      break;
    case "hc/pres":
      insertPression(message.toString());
      break;
    case "hc/steps":
      insertSteps(message.toString());
      break;
  }
});



app.use(express.json());

app.get("/", function (req, res) {
  res.send("Hello World!");
});
// GET method route
app.get("/tab/:name", async (req, res) => {
  res.send(await getTableResults(req.params.name));
});
app.post("/specific/:name", async (req, res) => {
  res.send(await getByDates(req.body.start_date, req.body.end_date,req.params.name));
});

app.listen(3000, () => console.log("Server started"));
