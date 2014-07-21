var config = require("../config.json");
var mysql = require("mysql");

// connect to mysql databases
exports.business = mysql.createPool({
  user: config.databases.business.user,
  password: config.databases.business.password,
  host: config.databases.business.host,
  port: config.databases.business.port
});
