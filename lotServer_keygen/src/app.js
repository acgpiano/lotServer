const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("./config.json"));
const app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.all("/ac.do", require("./Actions/AcServlet"));
app.all("/regenspeeder/lic", require("./Actions/Lic"));

app.listen(config.ServicePort, () => {
  console.log("Listening port:" + config.ServicePort);
});
