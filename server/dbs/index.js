var async = require('async');
var MongoClient = require('mongodb').MongoClient;

// Note: A production application should not expose database credentials in plain text.
// For strategies on handling credentials, visit 12factor: https://12factor.net/config.
// var PROD_URI = "mongodb://<dbuser>:<dbpassword>@<host1>:<port1>,<host2>:<port2>/<dbname>?replicaSet=<replicaSetName>";
var DEV_URI = "mongodb://user1:Pass1234@ds123312.mlab.com:23312/mednick";

var databases = {
  // production: async.apply(MongoClient.connect, PROD_URI),
  dev: async.apply(MongoClient.connect, DEV_URI)
};

module.exports = function (cb) {
  async.parallel(databases, cb);
};
