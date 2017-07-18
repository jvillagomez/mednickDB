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


// var db = monk('localhost:27017/mednick');
var app = express();

var CWD = process.cwd();

var UPLOAD_TO = path.join(CWD,"mednickFiles")
var TEMP_DIR = path.join(CWD,"temp")
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

// Generic error handler used by all endpoints.

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
};

function insertDocument(res,collection_name,data) {
    data.dateUploaded = Date.now();
    db.collection(collection_name).insert(data, function (err,doc){
        if(err){
            res.status(code || 500).json({"error": message});
        }
        else {
            res.status(201).json(doc);
            console.log("inserted!");
        }
    });
};

function updateParsedDocument(res,id) {
    db.collection(FILEUPLOADS_COLLECTION).updateOne(
       { _id: ObjectId(id) },
       {
         $set: { "parsed": "1"},
         $currentDate: { lastModified: true }
     },
     function(err,doc){
         if(err){
             res.status(code || 500).json({"error": message});
         }
         else {
             res.status(201).json(doc);
             console.log("updated!");
         }
     });
};
//
// function CheckDir(res,file_path,dir_path,file_object,data,callback){
//     if (!fs.existsSync(dir_path)){
//         console.log('Dir does not exist yet');
//         mkpath(dir_path, function (err) {
//             console.log("Crip niggas");
//             if (err){
//                 console.log('Error creating fileDir');
//                 console.error(err);
//                 return res.status(500).send(err);
//             }
//             else {
//                 console.log('fileDir created successfully');
//                 console.log(dir_path);
//                 callback(res,file_path,dir_path,file_object,data)
//             }
//         });
//     }
//     else {
//         callback(res,file_path,dir_path,file_object,data)
//     }
//
//     // console.log("done checking DIR");
//     // callback(res,file_path,dir_path,file_object,data);
// };
//
// function uploadFile(res,file_path,dir_path,file_object,data){
//     console.log("HITS UPLAOD FILE");
//     if(!fs.existsSync(file_path)){
//         file_object.mv(file_path, function(err){
//             console.log(dir_path);
//             if(err){
//                 console.log("Error in file upload");
//                 console.log(err);
//                 return res.status(500).send(err);
//             }
//             else {
//                 console.log("File successfully moved");
//                 insertDocument(res,FILEUPLOADS_COLLECTION,data)
//             }
//         })
//     }
//     else {
//         return res.status(500).send("File already exists!");
//     }
//     // console.log("HITTING UPLOAD FILE FUNC");
// }
//
// function isComplete(data){
//     var metadata = [
//         data.study,
//         data.visit,
//         data.session,
//         data.doctype
//     ];
//
//     // console.log(metadata);
//
//     for (attribute of metadata) {
//         if(!attribute){
//             // console.log("false");
//             return false
//         }
//     }
//     console.log("true");
//     return true
// };
//
// function completeUpload(res,file_object,data){
//     data.complete = "1";
//     var study = (data.study).trim();
//     var visit = (data.visit).trim();
//     var session = (data.session).trim();
//     var doctype = (data.doctype).trim();
//     var file_name = (data.filename).trim();
//
//     var dir_path = path.join(UPLOAD_TO, study, visit, session, doctype);
//     var file_path = path.join(dir_path, file_name);
//     data.path = file_path;
//
//     CheckDir(res,file_path,dir_path,file_object,data,uploadFile);
//
//
// };
//
// function incompleteUpload(res,file_object,data){
//     data.complete = "0";
//     // console.log(data.filename);
//     // console.log(TEMP_DIR);
//     var file_path = path.join(TEMP_DIR,data.filename);
//     data.path = file_path;
//     uploadFile(res,file_path,TEMP_DIR,file_object,data);
// };
//

//=============================================================================

// function downloadFileByID(res,id){
//     // db.collection(FILEUPLOADS_COLLECTION).find({_id:id,expired:"0"}).toArray(function(err,docs){
//     db.collection(FILEUPLOADS_COLLECTION).find({_id: ObjectId(id),expired:"0"}).toArray(function(err,docs){
//         if (!docs) {
//             res.status(404).send(("No document found matching"+id));
//         } else {
//             console.log("If no filepath printed below, theres an error.");
//             console.log(docs);
//             var fileName = docs[0].path
//             console.log("filename:",fileName);
//             res.sendFile(fileName, function (err) {
//                 if (err) {
//                     console.log("Error serving file object");
//                     console.log(err)
//                     res.status(404).send(err);
//                 } else {
//                     console.log('Sent:', fileName);
//                 }
//             });
//         }
//     });
// };

//===========================================================================================
//
// function getFilebyID(res,id){
//     db.collection(FILEUPLOADS_COLLECTION).find({_id: ObjectId(id),expired:"0"}).toArray(function(err,docs){
//         if (err) {
//             handleError(res, err.message, "Failed to get temp records.");
//         } else {
//             var data = docs[0]
//             console.log(data);
//             res.status(200).json(data)
//         }
//     });
// };
//
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

// function getTempFiles(res){
//     db.collection(FILEUPLOADS_COLLECTION).find({complete:"0",expired:"0"}).toArray(function(err,docs){
//         if (err) {
//           handleError(res, err.message, "Failed to get temp records.");
//         } else {
//           res.status(200).json(docs);
//         }
//     });
// };
//
//===========================================================================================

// function deleteFile(){
// };

// function editUpload(){
// };

app.post('/upload/',function(req,res){
    if(!req.files){
        console.log("No file was uploaded")
        return res.status(400).send('No files were uploaded.')
    } else {
        var entry = req.body;
        console.log(entry);

        var fileQuantity = (req.files.docfile).length;
        if (fileQuantity)
        {
            var file_objects = req.files.docfile;
            file_objects.forEach(function(file_object) {
                console.log(file_object);

                entry.filename = file_object.name;
                entry.expired = "0";
                entry.uploadedBy = "stude001@ucr.edu";

                incompleteUpload(res,file_object,entry);

            });
        }

        else
        {
            var file_object = req.files.docfile;
            console.log(file_object);

            var complete = isComplete(entry);

            // console.log(complete);
            entry.filename = file_object.name;
            entry.expired = "0"
            entry.uploadedBy = "stude001@ucr.edu";

            if (complete) {
                completeUpload(res,file_object,entry);
            } else {
                incompleteUpload(res,file_object,entry);
            }
        }

        return// res.status(201).json("Uploading successfull");
    }
});

// app.get('/files/download/', function (req, res) {
//     var id = req.query.id;
//     if (!id) {
//         res.status(500).send('No Doc ID provided')
//     } else {
//         downloadFileByID(res,id);
//     }
// });

app.get('/files/',function(req,res){
    getCompleteFiles(req,res);
});

app.get('/files/temp/',function(req,res){
    getTempFiles(res);
});

// app.post('/files/delete/',function(req,res){
//     var id = req.query.id;
//     if (!id) {
//         res.status(500).send('No document ID provided')
//     } else {
//         getFilebyID(res,id);
//     }
// });

// function moveFile(loc,dest){
//     if (loc == dest) {
//         console.log('No need to move.');
//         res.status(200).send('No need to move.')
//     }
//     else {
//
//     }
//
// callback;
// };

app.post('/files/temp/new/',function(req,res){
    insertDocument(res,FILEUPLOADS_COLLECTION,req.body);
});


// function expireDocument(res,id){
//     db.collection.findOneAndUpdate(
//         {_id:ObjectId(id),expired:"0"},
//         {expired:"1"},function(err,docs){
//             if (err) {
//                 console.log(err);
//                 handleError(res, err.message, "Failed to update record. Maybe it doesnt exist. Read Err.");
//             } else {
//                 console.log("UPDATED SUCCESS");
//                 res.status(200).json(docs);
//             }
//     });
// };

app.get('/file/', function (req, res) {
    var id = req.query.id;
    if (!id) {
        res.status(500).send('No document ID provided');
    } else {
        getFilebyID(res,id);
    }
});

app.get('/',function(req,res){
    console.log("HIT Main");
    res.status(200).send("Success placing GET call.");
});

// app.post('/files/:id', function (req, res) {
//     var id = req.params.id;
//     if (!id) {
//         console.log("No Document ID provided");
//         return res.status(500).send('No document ID provided')
//     } else {
//         db.collection(FILEUPLOADS_COLLECTION).update({_id:id,expired:"0"},{expired:"1",expiredDate:Date.now()}).then((docs) => {
//             if(err){
//                 console.log("Error updating document record")
//                 console.log(err);
//                 return res.status(500).json(err);
//             }
//             else {
//                 console.log("Record was updated accordingly")
//                 return res.status(200).json(req.body);
//             }
//         });
//     }
// });

// START [DROPDOWN Selections]
// ==================================================
//
// app.get('/getStudies/', function(req,res){
//     db.collection(FILEUPLOADS_COLLECTION).distinct('study',(function(err, docs){
//         if (err) {
//           handleError(res, err.message, "Failed to get studies.");
//         } else {
//           res.status(200).json(docs);
//         }
//     }));
// });
//
// app.get('/getVisits/', function(req,res){
//     var study = req.query.study
//     console.log(study);
//
//     db.collection(FILEUPLOADS_COLLECTION).distinct('visit',{study:study},(function(err, docs){
//         if (err) {
//           handleError(res, err.message, "Failed to get visits.");
//         } else {
//           res.status(200).json(docs);
//         }
//     }));
// });
//
// app.get('/getSessions/', function(req,res){
//     var study = req.query.study
//     var visit = req.query.visit
//     console.log(study);
//     console.log(visit);
//
//     db.collection(FILEUPLOADS_COLLECTION).distinct('session',{study:study,visit:visit},(function(err, docs){
//         if (err) {
//           handleError(res, err.message, "Failed to get Sessions.");
//         } else {
//           res.status(200).json(docs);
//         }
//     }));
// });
//
// app.get('/getDocTypes/', function(req,res){
//     db.collection(FILEUPLOADS_COLLECTION).distinct('doctype',(function(err, docs){
//         if (err) {
//           handleError(res, err.message, "Failed to get visits.");
//         } else {
//           res.status(200).json(docs);
//         }
//     }));
// });
// // ==================================================
// END [DROPDOWN Selections]

app.post('/sleepScores/', function(req,res){
    insertDocument(res, SLEEPSCORES_COLLECTION, req.body);
});

app.post('/screenings/', function(req,res){
    insertDocument(res, SCREENINGS_COLLECTION, req.body);
});

app.post('/update/', function(req,res){
    console.log("HIT IT");
    // updateParsedDocument(res, req.body.id);
});

app.get('/sleepScores/', function(req,res){
    db.collection(SLEEPSCORES_COLLECTION).find({}).toArray(function(err,docs){
        if (err) {
          handleError(res, err.message, "Failed to get SLEEPSCORE records.");
        } else {
          res.status(200).json(docs);
        }
    });
});

app.get('/screenings/', function(req,res){
    db.collection(SCREENINGS_COLLECTION).find({}).toArray(function(err,docs){
        if (err) {
          handleError(res, err.message, "Failed to get SCREENING records.");
        } else {
          res.status(200).json(docs);
        }
    });
});

// ==============================================================
// START [server instance]
// app.listen(app.get('port'), function() {
//     console.log('Node app is running on port', app.get('port'));
// });
