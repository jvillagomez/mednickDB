var fs = require('fs');
var mkdirp = require('mkdirp');
var mkpath = require('mkpath');

var express = require('express');
var router = express.Router();
var fileUpload = require('express-fileupload');
var path = require('path');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var monk = require('monk');
var cors = require('cors');
var upload = require('./DocumentUpload/functions/upload.js')
var general = require('./generalFunctions/general')

// var db = monk('localhost:27017/mednick');
var app = express();

// var CWD = process.cwd();
//
// var UPLOAD_TO = path.join(CWD,"uploads/mednickFileSystem")
// var TEMP_DIR = path.join(CWD,"uploads/temp")
// ==============================================================
process.env.PWD = process.cwd();
var PUBLIC_PATH = path.resolve(process.env.PWD + '/public');
var MONGODB_URI = "mongodb://user1:Pass1234@ds123312.mlab.com:23312/mednick"

var SLEEPSCORES_COLLECTION = "sleepScores"
var SLEEPDIARIES_COLLECTION = "sleepDiaries"
var SCREENINGS_COLLECTION = "screenings"
var FILEUPLOADS_COLLECTION = "fileUploads";
var TEST_COLLECTION = "test";

app.set('port', (process.env.PORT || 8001));
// ==============================================================
app.use('/public', express.static(PUBLIC_PATH));
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(cors());

app.use(function(req,res,next){
    req.db = db;
    next();
});

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
// mongo.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
mongo.MongoClient.connect(MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    console.log("exits");
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  // var server = app.listen(process.env.PORT || 8080, function () {
  var server = app.listen(process.env.PORT || 8001, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});


function getCompleteFiles(req,res){
    var study = req.query.study;
    var visit = req.query.visit;
    var session = req.query.session;
    var doctype = req.query.doctype;

    if(!study && !doctype){
        db.collection(FILEUPLOADS_COLLECTION).find({complete:"1",expired:"0"}).toArray(function(err,docs){
            if (err) {
              handleError(res, err.message, "Failed to get complete docs.");
            } else {
              res.status(200).json(docs);
            }
        });

    } else if (!study && doctype) {
        db.collection(FILEUPLOADS_COLLECTION).find({doctype:doctype,complete:"1",expired:"0"}).toArray(function(err,docs) {
            res.status(200).json(docs)
        })
    } else if (study && !doctype) {
        if(!visit){
            db.collection(FILEUPLOADS_COLLECTION).find({study:study,complete:"1",expired:"0"}).toArray(function(err,docs){
                res.status(200).json(docs)
            })
        } else if (!session) {
            db.collection(FILEUPLOADS_COLLECTION).find({study:study,visit:visit,complete:"1",expired:"0"}).toArray(function(err,docs){
                res.status(200).json(docs)
            })
        } else {
            db.collection(FILEUPLOADS_COLLECTION).find({study:study,visit:visit,session:session,complete:"1",expired:"0"}).toArray(function(err,docs){
                res.status(200).json(docs)
            })
        }
    } else if (study && doctype) {
        if(!visit){
            db.collection(FILEUPLOADS_COLLECTION).find({study:study,doctype:doctype,complete:"1",expired:"0"}).toArray(function(err,docs){
                res.status(200).json(docs)
            })
        } else if (!session) {
            db.collection(FILEUPLOADS_COLLECTION).find({study:study,visit:visit,doctype:doctype,complete:"1",expired:"0"}).toArray(function(err,docs){
                res.status(200).json(docs)
            })
        } else {
            db.collection(FILEUPLOADS_COLLECTION).find({study:study,visit:visit,session:session,doctype:doctype,complete:"1",expired:"0"}).toArray(function(err,docs){
                res.status(200).json(docs)
            })
        }
    } else {
        console.log("If youre seeing this somthing is completely fucked up in the request :)");
    }
};

function getTempFiles(res){
    db.collection(FILEUPLOADS_COLLECTION).find({complete:"0",expired:"0"}).toArray(function(err,docs){
        if (err) {
          handleError(res, err);
        } else {
          res.status(200).json(docs);
        }
    });
};


app.get('/files/',function(req,res){
    getCompleteFiles(req,res);
});

app.get('/files/temp/',function(req,res){
    getTempFiles(res);
});

app.use(require('./DocumentUpload/routes/upload'));



// ==============================================================
// START [server instance]
// app.listen(app.get('port'), function() {
//     console.log('Node app is running on port', app.get('port'));
// });
