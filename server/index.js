const { local_port } = require("./appConfig");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.set("port", process.env.PORT || local_port);

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(function (req, res, next) {
  res.header("Content-Type", "application/json");
  next();
});

let router = require("./router")(app);

app.listen(app.get("port"), function () {
  console.log(
    "Express started on port " +
      app.get("port") +
      "; press Ctrl-C to terminate."
  );
});
