var fs = require('fs');
var mkdirp = require('mkdirp');
var mkpath = require('mkpath');
var mv = require('mv');

var express = require('express');
var router = express.Router();
var fileUpload = require('express-fileupload');
var path = require('path');
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID;

var DataTableController = require('../controllers/dataTable_Controller')
var DocumentBrowseController = require('../controllers/documentBrowse_Controller')
var DocumentDownloadController = require('../controllers/documentDownload_Controller')
var DocumentUpdateController = require('../controllers/documentUpdate_Controller')
var DocumentUploadController = require('../controllers/documentUpload_Controller')
var GeneralController = require('../controllers/general_Controller')



var CWD = process.cwd();
var UPLOAD_TO = path.join(CWD,"uploads/mednickFileSystem")
var TEMP_DIR = path.join(CWD,"uploads/temp")
var DELETED_DIR = path.join(CWD,"uploads/deleted")

module.exports = {
    cwd: CWD,
    upload_to : UPLOAD_TO,
    temp_dir: TEMP_DIR,
    deleted_dir: DELETED_DIR,

    deleteFile: function(res, db, id){
        db.dev.collection(GeneralController.FILEUPLOADS_COLLECTION).find({_id: ObjectId(id)}).toArray(function(err,doc){
            if (err) {
              GeneralController.handleError(res, err);
          } else if (!doc) {
              GeneralController.handleError(res, "NO CORRESPONDING DOC WAS FOUND");
          } else {
                // console.log(doc[0]);
                module.exports.expireFile(res, doc[0], db);
                module.exports.moveFileToDeleted(res, doc[0]);
            }
        });
    },
    expireFile: function (res, doc, db) {
        db.dev.collection(GeneralController.FILEUPLOADS_COLLECTION).updateOne(
           { _id: ObjectId(doc._id) },
           {
             $set: { "expired": "1"},
             $currentDate: { lastModified: true }
         },
         function(err,doc){
             if(err){
                 res.status(500).json({"error": err});
             } else {
                 console.log("FIle Expired");
                 res.status(200).json(doc);
             }
         });
    },
    moveFileToDeleted: function (res, doc) {
        console.log(doc);
        var sourcePath = doc.path;
        var destPath = path.join(module.exports.deleted_dir, doc.filename);
        mv(sourcePath, destPath, function(err) {
            if (err) {
                return GeneralController.handleError(res,err);
            } else {
                console.log("File moved to trash");
            }
        });
    }
};
