var express = require("express");
var app = express();
var cfenv = require("cfenv");
var bodyParser = require('body-parser');
var ejs = require('ejs');
var path = require('path');

var cloudant, mydb;

// load local VCAP configuration  and service credentials
var vcapLocal;
try {
  vcapLocal = require('./vcap-local.json');
  console.log("Loaded local VCAP", vcapLocal);
} catch (e) {
  console.log("Loaded local VCAP is missing.");
}

const appEnvOpts = vcapLocal ? {
  vcap: vcapLocal
} : {}

const appEnv = cfenv.getAppEnv(appEnvOpts);

// Load the Cloudant library.
var Cloudant = require('@cloudant/cloudant');
if (appEnv.services['cloudantNoSQLDB'] || appEnv.getService(/cloudant/)) {

  // Initialize database with credentials
  if (appEnv.services['cloudantNoSQLDB']) {
    // CF service named 'cloudantNoSQLDB'
    cloudant = Cloudant(appEnv.services['cloudantNoSQLDB'][0].credentials);
  } else {
    // user-provided service with 'cloudant' in its name
    cloudant = Cloudant(appEnv.getService(/cloudant/).credentials);
  }
} else if (process.env.CLOUDANT_URL) {
  cloudant = Cloudant(process.env.CLOUDANT_URL);
}

// if (cloudant) {
//   //database name
//   var dbName = 'mydb';

//   // Create a new "mydb" database.
//   cloudant.db.create(dbName, function(err, data) {
//     if (!err) //err if database doesn't already exists
//       console.log("Created database: " + dbName);
//   });

//   // Specify the database we are going to use (mydb)...
//   mydb = cloudant.db.use(dbName);
// }

function initDBConnection(dbName){  //这里有个大问题，如果DB不存在，就无法创建doc
var mydb;
  if (cloudant) {
    //database name
    var dbName = dbName;
    // Create a new "mydb" database.
    cloudant.db.create(dbName, function(err, data) {
      if (!err) //err if database doesn't already exists
        console.log("Created database: " + dbName);
    });
    // Specify the database we are going to use (mydb)...
    mydb = cloudant.db.use(dbName);
  }
return mydb;

}

module.exports = initDBConnection
// module.exports = mydb;