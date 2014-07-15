var db = require("./database.js");

// validate auth token for every request
exports.userAuth = function(req, res, next) {
  // skip user auth for now and just set to admin
  req.body.username = 'snappCar';
  req.body.authToken = 'snappCarAuthToken';
  req.body.authLevel = 10;
  next();

  // if (req.body.username && req.body.authToken) {
  //   db.authTokenDb.query("SELECT * FROM snappCar.tokens WHERE username=? AND authToken=?", [req.body.username, req.body.authToken], function(err, rows, fields) {
  //     if (err) {
  //       console.log("Error running authenticate query: " + err);
  //       res.send(500);
  //       return;
  //     }
  //     if (rows.length) {
  //       var userLevels = rows[0].userLevels.split(",");
  //       req.body.authLevel = userLevels[userLevels.length - 1];
  //       next();
  //     }
  //     else {
  //       console.log("No matching authToken found in database: " + req.body.username + ", " + req.body.authToken);
  //       res.send(401);
  //     }
  //   });
  // }
  // else {
  //   console.log("No username and/or authToken in req.body");
  //   res.send(401); // send 401 for invalid auth
  // }
};

// 10 - admin
// 0 - guest
// validate authorization level for each call
exports.authLevel = function(requiredLevel) {
  return function(req, res, next) {
    if (req.body.authLevel >= requiredLevel)
      next();
    else {
      console.log("Authorization level insufficient: " + req.body.username + " - " + req.body.authLevel);
      res.send(401);
    }
  };
};

exports.params = function(paramMap) {
  return function(req, res, next) {
    // set default params
    var params = req.body.params = req.body.params || {};

    function validateProp(type, value, isOptional) {
      var valid = true;
      var valueType = typeof value;
      // if it's an optional param and it doesn't have it, that's okay
      if (valueType === "undefined" || (valueType === "object" && value === null)) {
        if (!isOptional)
          valid = false;
      }
      else if (valueType === "boolean" && type === "boolean") {}
      else if (valueType === "string" && type === "string") {}
      else if (valueType === "number" && type === "number") {
        if (isNaN(value))
          valid = false;
      }
      else if (Array.isArray(value) && Array.isArray(type)) {
        // if the array isn't optional, it must have at least one item
        if (!isOptional && !value.length)
          valid = false;
        else {
          // hit every element of the array with the map at 0
          for (var i = 0; i < value.length; i ++) {
            if (!validateProp(type[0], value[i], false))
              valid = false;
          }
        }
      }
      else if (valueType === "object" && typeof type === "object") {
        for (var rawProp in type) {
          var propIsOptional = false;
          if (rawProp[0] === ":")
            propIsOptional = true;

          if (!validateProp(type[rawProp], value[rawProp.replace(":", "")], propIsOptional))
            valid = false;
        }
      }
      else {
        valid = false;
      }

      return valid;
    }

    var valid = validateProp(paramMap, params, false);

    if (valid) {
      next();

    }
    else {
      console.log("Invalid parameters supplied.");
      console.log("Expecting: " + JSON.stringify(paramMap));
      console.log("Received: " + JSON.stringify(req.body.params));
      res.send(400);
    }
  };
};
