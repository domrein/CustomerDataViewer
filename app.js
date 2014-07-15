var config = require("./config.json");

var express = require("express");
var bodyParser = require("body-parser");

var validate = require("./common/validate.js");

var app = express();
app.use("/", express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.engine("jade", require("jade").__express);

app.get("/", function(req, res) {
  res.render("index.jade");
});

// make sure user is authorized
app.use(validate.userAuth);

// load routes
[
  "customer.js",
  "system.js",
].forEach(function(route) {
  var routeModule = require("./routes/" + route);
  routeModule.init(app);
});

console.log("App listening on port " + config.port);
app.listen(config.port);
