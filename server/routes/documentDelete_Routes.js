var fs = require('fs');
var mkdirp = require('mkdirp');
var mkpath = require('mkpath');

var express = require('express');
var fileUpload = require('express-fileupload');
var path = require('path');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var monk = require('monk');
var cors = require('cors');

var DataTableController = require('../controllers/dataTable_Controller')
var DocumentBrowseController = require('../controllers/documentBrowse_Controller')
var DocumentDownloadController = require('../controllers/documentDownload_Controller')
var DocumentUpdateController = require('../controllers/documentUpdate_Controller')
var DocumentUploadController = require('../controllers/documentUpload_Controller')
var DocumentDeleteController = require('../controllers/documentDelete_Controller')
var GeneralController = require('../controllers/general_Controller')

var router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});


module.exports = function(app,db){
    app.post('/DeleteFile',function(req,res){
        if(!req.id){
            return res.status(400).send('No files were uploaded.')
        } else {
            var data = req.body;
            var fileQuantity = (req.files.docfile).length;
            if (fileQuantity)
            {
                var file_objects = req.files.docfile;
                file_objects.forEach(function(file_object) {
                    console.log(file_object);

                    data.filename = file_object.name;
                    data.expired = "0";
                    data.uploadedBy = "stude001@ucr.edu";

                    // upload.incompleteUpload(res,file_object,data,function(res, ){
// TODO finish this multiple file upload
                    // });
                });
            }

            else
            {
                var file_object = req.files.docfile;
                var complete = DocumentUploadController.isComplete(data);

                data.filename = file_object.name;
                data.expired = "0"
                data.uploadedBy = "stude001@ucr.edu";

                if (complete) {
                    DocumentUploadController.completeUpload(res,file_object,data,db,function(res,dir_path,file_object,data,db){
                        DocumentUploadController.checkDir(res,dir_path,file_object,data,db,function(res,dir_path,file_object,data,db){
                            DocumentUploadController.uploadFile(res,dir_path,file_object,data,db,function(res,collection,data,db){
                                GeneralController.insertDocument(res, collection, data, db);
                            })
                        })
                    });
                } else {
                    upload.incompleteUpload(res,file_object,entry,upload.CheckDir);
                }
            }
// TODO fis this, idk wth is going on with this return
            return// res.status(201).json("Uploading successfull");
        }
    });

    app.post('/files/temp/new/',function(req,res){
        insertDocument(res,FILEUPLOADS_COLLECTION,req.body);
    });
}


// module.exports = router;
