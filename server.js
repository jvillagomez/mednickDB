var fs = require('fs');
var mkdirp = require('mkdirp');
var express = require('express');
var router = express.Router();
var fileUpload = require('express-fileupload');
var path = require('path');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var monk = require('monk');
// var db = monk('localhost:27017/mednick');
var app = express();

var CWD = process.cwd();

var UPLOAD_TO = path.join(CWD,"mednickFiles")
// ==============================================================
process.env.PWD = process.cwd();
var PUBLIC_PATH = path.resolve(process.env.PWD + '/public');
// var MONGODB_URI = "mongodb://user1:Pass1234@ds123312.mlab.com:23312/mednick"

var SLEEPSCORES_COLLECTION = "sleepScores"
var SLEEPDIARIES_COLLECTION = "sleepDiaries"
var SCREENINGS_COLLECTION = "screenings"
var FILEUPLOADS_COLLECTION = "fileuploads";

app.set('port', (process.env.PORT || 8001));
// ==============================================================
app.use('/public', express.static(PUBLIC_PATH));
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(function(req,res,next){
    req.db = db;
    next();
});


// ============================================================================

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongo.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
// mongo.MongoClient.connect(MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}
// ============================================================================

// ==============================================================
// START [Uploading files]
// ==================================================
app.post('/incompleteUpload',function(req,res){
    var collection = db.get('fileUploads');

    if(!req.files || !req.body.name){
        console.log("No file was uploaded")
        return res.status(400).send('No files were uploaded.')
    } else {
        let fileObj = req.files.docfile;
        var fileName = req.body.name[0]; //including file extension
        var study = !(req.body.study).trim() ? "" : req.body.study;
        var subject = !(req.body.subject).trim() ? "" : req.body.subject;
        var visit = !(req.body.visit).trim() ? "" : req.body.visit;
        var session = !(req.body.session).trim() ? "" : req.body.session;
        var docType = !(req.body.doctype) ? "" : req.body.doctype;
        var filePath = path.join(uploadTo,'temp',fileName);
        var notes = !(req.body.notes).trim() ? "" : req.body.notes;
        var dateUploaded = Date.now();
        var expired = false;


        fileObj.mv(filePath, function(err){
            if(err){
                console.log("Error in uploading file");
                console.log(err);
                return res.status(500).send(err);
            }
            else {
                console.log("Successfully uploaded file");
                collection.insert({
                    "filename":fileName,
                    "study":study,
                    "subject":subject,
                    "visit":visit,
                    "session":session,
                    "doctype":docType,
                    "filepath":filePath,
                    "notes":notes,
                    "complete":false,
                    "dateUploaded":dateUploaded,
                    "expired":false,
                    "expiredDate":0
                }, function (err,doc){
                    if(err){
                        console.log("Error inserting record");
                        console.log(err);
                        return res.status(500).json(err);
                    }
                    else {
                        console.log("Record insertion was successful");
                        return res.status(200).json(req.body);
                    }
                });
            }
        })
    }
});

app.post('/completeUpload',function(req,res){
    // var collection = db.get('fileUploads');
    // End callback if no file was chosen
    if(!req.files || !req.body.name){
        return res.status(400).send('No files were uploaded.')
    } else {
        // End callback if a single filed is missing
        if(!req.body.study || !req.body.subject || !req.body.visit || !req.body.session || !req.body.filetype){
            return res.status(400).send("Missing Fields. Use '/incompleteUpload' endpoint instead.")
        } else {
            let fileObj = req.files.docfile;
            var fileName = req.body.name; //including file extension
            var study = req.body.study;
            var subject = req.body.subject;
            var visit = req.body.visit;
            var session = req.body.session;
            var docType = req.body.filetype;
            var fileDir = path.join(UPLOAD_TO,study,visit,session,subject,docType);// fileDir was created to chekc if directory exists, before uploading file.
            console.log(fileDir);
            var filePath = path.join(fileDir,fileName);
            var notes = !(req.body.notes).trim() ? "" : req.body.notes;
            var dateUploaded = Date.now();

            if (!fs.existsSync(fileDir)){
                console.log('Dir does not exist yet');
                mkdirp.sync(fileDir, function (err) {
                    if (err){
                        console.log('Error creating fileDir')
                        console.error(err)
                        return res.status(500).send(err);

                    } else {
                        console.log('fileDir created successfully')
                        console.log(fileDir)
                    }
                });
            }

            fileObj.mv(filePath, function(err){
                console.log(filePath);
                if(err){
                    console.log("Error in file upload");
                    console.log(err);
                    return res.status(500).send(err);
                }
                else {
                    console.log("File successfully moved");
                    db.collection(FILEUPLOADS_COLLECTION).insert({
                        "filename":fileName,
                        "study":study,
                        "subject":subject,
                        "visit":visit,
                        "session":session,
                        "doctype":docType,
                        "filepath":filePath,
                        "notes":notes,
                        "complete":true,
                        "dateUploaded":dateUploaded,
                        "expired":false,
                        "expiredDate":0
                    }, function (err,doc){
                        if(err){
                            handleError(res, err.message, "Failed to Upload complete document.");
                        }
                        else {
                            path.resolve(process.env.PWD);
                            console.log("DB insertion successful")
                            return res.status(200).json(req.body);
                        }
                    });
                }
            })
        }
    }
});
// ==================================================
// END [Uploading Files]

// START [Querying files]
// ==================================================
app.get('/getFiles',function(req,res){
    // var collection = db.get('fileuploads');
    var study = req.query.study;
    var visit = req.query.visit;
    var session = req.query.session;
    var doctype = req.query.doctype;

    if(!study && !doctype){
        db.collection(FILEUPLOADS_COLLECTION).find({complete:true,expired:false}).toArray(function(err,docs){
            if (err) {
              handleError(res, err.message, "Failed to get contacts.");
            } else {
              res.status(200).json(docs);
            }
        });

    } else if (!study && doctype) {
        collection.find({doctype:doctype,complete:true,expired:false}).then((docs) => {
            console.log(docs);
            res.status(200).json(docs)
        })
    } else if (study && !doctype) {
        if(!visit){
            collection.find({study:study,complete:true,expired:false}).then((docs) => {
                console.log(docs);
                res.status(200).json(docs)
            })
        } else if (!session) {
            collection.find({study:study,visit:visit,complete:true,expired:false}).then((docs) => {
                console.log(docs);
                res.status(200).json(docs)
            })
        } else {
            collection.find({study:study,visit:visit,session:session,complete:true,expired:false}).then((docs) => {
                console.log(docs);
                res.status(200).json(docs)
            })
        }
    } else if (study && doctype) {
        if(!visit){
            collection.find({study:study,doctype:doctype,complete:true,expired:false}).then((docs) => {
                console.log(docs);
                res.status(200).json(docs)
            })
        } else if (!session) {
            collection.find({study:study,visit:visit,doctype:doctype,complete:true,expired:false}).then((docs) => {
                console.log(docs);
                res.status(200).json(docs)
            })
        } else {
            collection.find({study:study,visit:visit,session:session,doctype:doctype,complete:true,expired:false}).then((docs) => {
                console.log(docs);
                res.status(200).json(docs)
            })
        }
    } else {
        console.log("If youre seeing this somthing is completely fucked up in the request :)");
    }

    // collection.find({study:study,visit:visit,session:session,doctype:doctype}, 'study').then((docs) => {
    //     console.log(docs);
    //   // only the name field will be selected
    // })
})

app.get('/getTemp',function(req,res){
    var collection = db.get('fileuploads');

    collection.find({complete:false,expired:false}).then((docs) => {
        console.log(docs);
        res.status(200).json(docs)
    })
})

app.get('/file/:id', function (req, res) {
    var collection = db.get('fileuploads')
    var id = req.params.id;
    if (!id) {
        console.log("No Document ID was provided");
        return res.status(500).send('No Doc ID provided')
    } else {
        collection.find({_id:id,expired:false}).then((docs) => {
            console.log("If no filepath printed below, theres an error.");
            var fileName = docs[0].filepath
            console.log("filename:",fileName);
            res.sendFile(fileName, function (err) {
                if (err) {
                    console.log("Error serving file object");
                    console.log(err)
                    return res.status(404).send(err);
                } else {
                    console.log('Sent:', fileName);
                    // Delete below line if giving you shit or not serving file; shit worked in postman
                    return res.status(200).send("File was served successfully");
                }
            });
        })
    }
});
// ==================================================
// END [Querying Files]

// START [Edit file]
// ==================================================
app.get('/editUpload/:id', function (req, res) {
    var collection = db.get('fileuploads')

    var id = req.params.id;
    if (!id) {
        console.log("No document ID provided");
        return res.status(500).send('No document ID provided')
    } else {
        collection.find({_id:id,expired:false}).then((docs) => {
            var data = docs[0]
            console.log(data);
            // if error erase teh return keyword below
            return res.status(200).json(data)
        });
    }
});

app.post('/fileupload/:id', function (req, res) {
    var collection = db.get('fileuploads')

    var id = req.params.id;
    if (!id) {
        console.log("No Document ID provided");
        return res.status(500).send('No document ID provided')
    } else {
        collection.update({_id:id,expired:false},{expired:true,expiredDate:Date.now()}).then((docs) => {
            if(err){
                console.log("Error updating document record")
                console.log(err);
                return res.status(500).json(err);
            }
            else {
                console.log("Record was updated accordingly")
                return res.status(200).json(req.body);
            }
        });
    }
});
// ==================================================
// END [Edit file]
// =============================================================================
// START [DROPDOWN Selections]
// ==================================================
app.get('/getStudies', function(req,res){
    var collection = db.get('fileuploads');
    // collection.find({},)
    // collection.find({}, 'study').then((docs) => {
    //     console.log(docs);
    //   // only the name field will be selected
    // })
    collection.distinct('study').then((docs) => {
        console.log(docs);
        res.json(docs)
      // only the name field will be selected
    })
    // TODO THIS BELOW IS THE GOAL FOR BEN
    // api/users?id=4&token=sdfa3&geo=us
});

app.get('/getVisits', function(req,res){
    var collection = db.get('fileuploads')
    var study = req.query.study
    console.log(study);

    collection.distinct('visit',{study:study}).then((docs) => {
        console.log(docs);
        res.json(docs)
    })
})

app.get('/getSessions', function(req,res){
    var collection = db.get('fileuploads')
    var study = req.query.study
    var visit = req.query.visit
    console.log(study);
    console.log(visit);

    collection.distinct('session',{study:study,visit:visit}).then((docs) => {
        console.log(docs)
        res.json(docs)
    })
})
// ==================================================
// END [DROPDOWN Selections]

// ==============================================================
// START [server instance]
// app.listen(app.get('port'), function() {
//     console.log('Node app is running on port', app.get('port'));
// });
