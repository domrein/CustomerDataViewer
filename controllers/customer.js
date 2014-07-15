var async = require("async");

var db = require("../common/database.js");

// returns list of users with basic details
exports.list = function(page, pageLength, filters, callback) {
  var whereClause = "";
  if (filters.length) {
    var whereFilters = [];
    filters.forEach(function(filter) {
      // make sure we're filtering on valid columns (ignore invalid field requests)
      var fieldName = null;
      switch (filter.field) {
        case "firstName": fieldName = "first_name"; break;
        case "lastName": fieldName = "last_name"; break;
        case "email": fieldName = "email"; break;
      }
      if (!fieldName)
        return;
      whereFilters.push(fieldName + " LIKE " + db.snappCar.escape(filter.value + "%"));
    });
    whereClause = "WHERE " + whereFilters.join(" AND ");
  }
  db.snappCar.query("SELECT id, first_name, last_name, email FROM snapp_car.customer " + whereClause + " LIMIT ?, ?", [page * pageLength, page * pageLength + pageLength], function(err, rows, fields) {
    if (err) {
      console.log(err);
      callback({status: false});
    }
    else
      callback({status: true, users: rows});
  });
};

// returns all details for specified users
exports.details = function(userIds, callback) {
  db.snappCar.query("SELECT id, first_name, last_name, email, phone, birthdate, created FROM snapp_car.customer WHERE id IN (?)", [userIds], function(err, rows, fields) {
    if (err) {
      console.log(err);
      callback({status: false});
    }
    else
      callback({status: true, users: rows});
  });
};

// updates specified details for specified users
exports.update = function(users, callback) {
  async.each(users, function(user, callback) {
    // translate properties to db field names
    var updateProps = {};
    if (user.hasOwnProperty("firstName"))
      updateProps.first_name = user.firstName;
    if (user.hasOwnProperty("lastName"))
      updateProps.last_name = user.lastName;
    if (user.hasOwnProperty("email"))
      updateProps.email = user.email;
    if (user.hasOwnProperty("phone"))
      updateProps.phone = user.phone;
    if (user.hasOwnProperty("birthdate"))
      updateProps.birthdate = user.birthdate;

    if (!Object.keys(updateProps).length) // skip user if no properties were specified
      callback(null);
    else {
      db.snappCar.query("UPDATE snapp_car.customer SET ?", [updateProps], function(err, rows, fields) {
        if (err) {
          console.log(err);
          callback(err);
        }
        else
          callback(null);
      });
    }
  }, function(err) {
    if (err)
      callback({status: false});
    else
      callback({status: true});
  });
};
