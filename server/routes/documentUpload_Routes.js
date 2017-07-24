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
var GeneralController = require('../controllers/general_Controller')

var router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});


module.exports = function(app,db){
    /**
     * @api {post} /FileUpload Upload new file
     * @apiName PostFileUpload
     * @apiGroup DocumentUpload

     * @apiDescription Supports single, and bulk upload requests.
     *
     * CompleteFileDir = "/study/visit/session/doctype/filename.ext"
     *
     * TempFileDir = "/temp/filename.ext"
     *
     * Single uploads, with "study", "visit", "session", and "doctype" provided in request, will be stored in CompleteFileDir.
     *
     * Single uploads, with "study", "visit", "session", or "doctype" missing in request, will be stored in TempFileDir.
     *
     * Bulk uploads apply same metada to all files in object-array and are automatically placed in TempFileDir.

     * @apiParam {Object} docfile               File object (or array of file objects) that will be uploaded.
     * @apiParam {String} [study=Null]          Study ID. Neccesary for "complete" upload.
     * @apiParam {String} [visit=Null]          Visit ID. Neccesary for "complete" upload.
     * @apiParam {String} [session=Null]        Session ID. Neccesary for "complete" upload.
     * @apiParam {String} [doctype=Null]        Doctype ID. Neccesary for "complete" upload.
     * @apiParam {String} [notes=Null]          Notes, text field.
     *
     * @apiExample Example usage:
     * curl -i http://localhost/user/4711
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "firstname": "John",
     *       "lastname": "Doe"
     *     }




     */
    app.post('/FileUpload',function(req,res){
        if(!req.files){
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

    /**
     * @api {post} /NewTempFileRecord Create new record for incomplete file
     * @apiName PostNewTempFileRecord
     * @apiGroup DocumentUpload
     */
    app.post('/NewTempFileRecord',function(req,res){
        insertDocument(res,FILEUPLOADS_COLLECTION,req.body);
    });
}


// module.exports = router;
