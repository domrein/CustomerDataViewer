var validate = require("../common/validate.js");
var customer = require("../controllers/customer.js");

exports.init = function(app) {
  // curl -i --data '{"params": {"page":0, "pageLength": 50}}' -H "Content-Type: application/json;charset=UTF-8" localhost:3000/customer/list
  // curl -i --data '{"params": {"page":0, "pageLength": 50, "filters": [{"field": "email", "value": "domrein"}]}}' -H "Content-Type: application/json;charset=UTF-8" localhost:3000/customer/list
  app.post("/customer/list", validate.authLevel(0), validate.params({
    page: "number",
    pageLength: "number",
    ":filters": [{
      field: "string",
      value: "string"
    }]
  }), function(req, res) {
    console.log("/customer/list");
    var filters = req.body.params.filters || [];
    customer.list(req.body.params.page, req.body.params.pageLength, filters, function(result) {
      if (result.status)
        res.send(JSON.stringify({status: true, users: result.users}));
      else
        res.send(JSON.stringify({status: false}));
    });
  });

  app.post("/customer/details", validate.authLevel(0), validate.params({
    userIds: ["number"]
  }), function(req, res) {
    customer.details(req.body.params.userIds, function(result) {
      if (result.status)
        res.send(JSON.stringify({status: true, users: result.users}));
      else
        res.send(JSON.stringify({status: false}));
    });
  });

  // convenience method for getting a single user's details
  app.post("/customer/details_single", validate.authLevel(0), validate.params({
    userId: "number"
  }), function(req, res) {
    customer.details([req.body.params.userId], function(result) {
      if (result.status && result.users.length)
        res.send(JSON.stringify({status: true, user: result.users[0]}));
      else
        res.send(JSON.stringify({status: false}));
    });
  });

  // update user data
  app.post("/customer/update", validate.authLevel(1), validate.params({
    "users": [{
      "id": "number",
      ":firstName": "string",
      ":lastName": "string",
      ":email": "string",
      ":phone": "string",
      ":birthdate": "string"
    }]
  }), function(req, res) {
    customer.update(users, function(result) {
    if (result.status)
      res.send(JSON.stringify({status: true}));
    else
      res.send(JSON.stringify({status: false}));
    });
  });

  // convenience method for updating a single user
  app.post("/customer/update_single", validate.authLevel(1), validate.params({
    "user": {
      "id": "number",
      ":firstName": "string",
      ":lastName": "string",
      ":email": "string",
      ":phone": "string",
      ":birthdate": "string"
    }
  }), function(req, res) {
    customer.update([user], function(result) {
    if (result.status)
      res.send(JSON.stringify({status: true}));
    else
      res.send(JSON.stringify({status: false}));
    });
  });
};