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

var app = express();

var initializeDatabases = require('./dbs');
// ==============================================================
process.env.PWD = process.cwd();
var PUBLIC_PATH = path.resolve(process.env.PWD + '/public');

// ==============================================================
app.use('/public', express.static(PUBLIC_PATH));
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(cors());

// app.use(function(req,res,next){
//     req.db = db;
//     next();
// });

var DocumentBrowseRoutes = require('./routes/documentBrowse_Routes')
var DocumentUploadRoutes = require('./routes/documentUpload_Routes')
var DocumentUpdateRoutes = require('./routes/documentUpdate_Routes')
var DataTableRoutes = require('./routes/dataTable_Routes')
var InsertDataRoutes = require('./routes/insertData_Routes')

initializeDatabases(function(err, dbs) {
  if (err) {
    console.error('Failed to make all database connections!');
    console.error(err);
    process.exit(1);
  }

  // Initialize the application once database connections are ready.
  DocumentBrowseRoutes(app, dbs);
  DocumentUploadRoutes(app, dbs);
  DocumentUpdateRoutes(app, dbs);
  DataTableRoutes(app, dbs);
  InsertDataRoutes(app, dbs);

  app.listen(8001, function() {
    console.log('Listening on port 8001');
  });
});


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

// function deleteFile(){
// };

// function editUpload(){
// };

// app.get('/files/download/', function (req, res) {
//     var id = req.query.id;
//     if (!id) {
//         res.status(500).send('No Doc ID provided')
//     } else {
//         downloadFileByID(res,id);
//     }
// });

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

app.get('/',function(req,res){
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


// // ==================================================
// END [DROPDOWN Selections]
