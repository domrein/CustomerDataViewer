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
      whereFilters.push(fieldName + " LIKE " + db.customer_manager.escape(filter.value + "%"));
    });
    whereClause = "WHERE " + whereFilters.join(" AND ");
  }
  db.customer_manager.query("SELECT id, first_name, last_name, email FROM customer_manager.customer " + whereClause + " ORDER BY last_name, first_name LIMIT ?, ?", [page * pageLength, pageLength], function(err, rows, fields) {
    if (err) {
      console.log(err);
      callback({status: false});
    }
    else {
      var customers = rows;
      // get customer count
      db.customer_manager.query("SELECT COUNT(*) as total FROM customer_manager.customer " + whereClause, [], function(err, rows, fields) {
        if (err) {
          console.log(err);
          callback({status: false});
        }
        else {
          var numPages = Math.ceil(rows[0].total / pageLength) || 1;
          callback({status: true, customers: customers, numPages: numPages});
        }
      });
    }
  });
};

// returns all details for specified user
exports.details = function(customerId, callback) {
  db.customer_manager.query("SELECT id, first_name, last_name, email, phone, DATE_FORMAT(birth_date, '%Y-%m-%d') as birth_date, created FROM customer_manager.customer WHERE id IN (?)", [customerId], function(err, rows, fields) {
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

// updates customer details
exports.update = function(customer, callback) {
  console.log(customer);
  // translate properties to db field names
  var updateProps = {};
  if (customer.hasOwnProperty("firstName"))
    updateProps.first_name = customer.firstName;
  if (customer.hasOwnProperty("lastName"))
    updateProps.last_name = customer.lastName;
  if (customer.hasOwnProperty("email"))
    updateProps.email = customer.email;
  if (customer.hasOwnProperty("phone"))
    updateProps.phone = customer.phone;
  if (customer.hasOwnProperty("birthDate"))
    updateProps.birth_date = customer.birthDate;
  console.log(updateProps);

  if (!Object.keys(updateProps).length) // skip user if no properties were specified
    callback({status: true});
  else {
    db.customer_manager.query("UPDATE customer_manager.customer SET ? WHERE id=?", [updateProps, customer.id], function(err, rows, fields) {
      if (err) {
        console.log(err);
        callback({status: false});
      }
      else
        callback({status: true});
    });
  }
};
