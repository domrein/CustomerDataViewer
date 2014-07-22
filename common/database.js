var config = require("../config.json");
var mysql = require("mysql");

// connect to mysql databases
exports.customer_manager = mysql.createPool({
  user: config.databases.customer_manager.customer,
  password: config.databases.customer_manager.password,
  host: config.databases.customer_manager.host,
  port: config.databases.customer_manager.port
});
