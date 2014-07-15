var config = require("../config.json");
var mysql = require("mysql");

// connect to mysql databases
exports.snappCar = mysql.createPool({
  host: config.databases.snapp_car.host,
  user: config.databases.snapp_car.user,
  password: config.databases.snapp_car.password
});
