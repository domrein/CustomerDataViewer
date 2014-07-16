var validate = require("../common/validate.js");

exports.init = function(app) {
  // curl -i --data '{"username":"paul","authToken": "0V1SKLMFZZE2NPBF"}' -H "Content-Type: application/json;charset=UTF-8" localhost:3000/system/ping
  app.post("/system/ping", validate.authLevel(0), validate.params({
  }), function(req, res) {
    console.log("/system/ping");
    res.send(JSON.stringify({status: true, msg: "pong"}));
  });
};
