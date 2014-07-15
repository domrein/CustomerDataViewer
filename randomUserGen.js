// just a simple script to generate random users

var firstNames = [
  "bill",
  "bob",
  "paul",
  "adam",
  "george",
  "henry",
  "susan",
  "page",
  "ellen",
  "francis",
  "oliver",
  "sophie",
  "chandler",
  "josh",
  "emma",
  "anna",
  "albert",
  "john",
  "alicia",
  "james",
  "robert",
  "michael",
  "charles",
  "thomas",
  "mary",
  "linda",
  "maria",
  "lisa",
  "dorothy",
  "jennifer",
  "carol",
];
var lastNames = [
  "milham",
  "geurts",
  "smith",
  "stone",
  "smith",
  "appleseed",
  "bunyan",
  "combs",
  "black",
  "green",
  "brown",
  "jones",
  "miller",
  "moore",
  "lewis",
  "walker",
  "sanchez",
  "jackson",
  "king",
  "morgan",
  "phillips",
  "kelly",
  "gray",
  "reed",
  "morris",
  "cook",
  "olson",
  "tucker",
  "burns",
  "griffin",
  "hart",
  "powers",
  "moss",
  "drake",
];
var emails = [
  "gmail",
  "hotmail",
  "freemail",
  "facebook",
];

// zero padded random int
function rand(min, max, pad) {
  var length = (max + "").length;
  var num = Math.floor(Math.random() * (max + 1 - min)) + min + "";
  while (num.length < length && pad)
    num = "0" + num;
  return num;
}

function makeUser() {
  // first_name, last_name, email, phone, birthdate
  var user = {};
  user.firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  user.lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  user.email = user.firstName + "." + user.lastName + "@" + emails[Math.floor(Math.random() * emails.length)] + ".com";
  user.phone = rand(1, 20) + "-" + rand(0, 999, true) + "-" + rand(0, 999, true) + "-" + rand(0, 9999, true);
  user.birthdate = rand(1920, 2000) + "-" + rand(1, 12, true) + "-" + rand(1, 28, true) + " 00:00:00";

  return user;
}

for (var i = 0; i < 100; i ++) {
  var user = makeUser();
  console.log("('" + user.firstName + "', '" + user.lastName + "', '" + user.email + "', '" + user.phone + "', '" + user.birthdate + "'),");
}
