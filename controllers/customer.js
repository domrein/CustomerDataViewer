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
      whereFilters.push(fieldName + " LIKE " + db.business.escape(filter.value + "%"));
    });
    whereClause = "WHERE " + whereFilters.join(" AND ");
  }
  db.business.query("SELECT id, first_name, last_name, email FROM business.customer " + whereClause + " LIMIT ?, ?", [page * pageLength, page * pageLength + pageLength], function(err, rows, fields) {
    if (err) {
      console.log(err);
      callback({status: false});
    }
    else
      callback({status: true, customers: rows});
  });
};

// returns all details for specified user
exports.details = function(customerId, callback) {
  db.business.query("SELECT id, first_name, last_name, email, phone, DATE_FORMAT(birth_date, '%Y-%m-%d') as birth_date, created FROM business.customer WHERE id IN (?)", [customerId], function(err, rows, fields) {
    if (err) {
      console.log(err);
      callback({status: false});
    }
    else if (!rows.length) {
      console.log("customer.details - Customer " + (customerId) + " not found");
      callback({status: false});
    }
    else
      callback({status: true, customer: rows[0]});
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
    if (user.hasOwnProperty("birthDate"))
      updateProps.birth_date = user.birthDate;

    if (!Object.keys(updateProps).length) // skip user if no properties were specified
      callback(null);
    else {
      db.business.query("UPDATE business.customer SET ?", [updateProps], function(err, rows, fields) {
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
