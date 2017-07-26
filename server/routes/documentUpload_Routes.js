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
     * http://localhost/FileUpload
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 201 Created
     *     {
     *        "result": {
     *            "ok": 1,
     *            "n": 1,
     *            "opTime": {
     *                "ts": "6446619355789656066",
     *                "t": 2
     *            }
     *        },
     *        "ops": [
     *            {
     *                "study": "study4",
     *                "visit": "visit1",
     *                "session": "session1",
     *                "doctype": "screening",
     *                "filename": "SF2014_ScreeningQuestionnaire_MASTER.xlsx",
     *                "expired": "0",
     *                "uploadedBy": "stude001@ucr.edu",
     *                "complete": "1",
     *                "path": "C:\\source\\mednickdb\\server\\uploads\\mednickFileSystem\\study4\\visit1\\session1\\screening\\SF2014_ScreeningQuestionnaire_MASTER.xlsx",
     *                "dateUploaded": 1500970536176,
     *                "_id": "5976fe28f9b6021654b762bb"
     *            }
     *        ],
     *        "insertedCount": 1,
     *        "insertedIds": [
     *            "5976fe28f9b6021654b762bb"
     *        ]
     *     }
     */
    app.post('/UploadFile',function(req,res){
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
                    DocumentUploadController.incompleteUpload(res, file_object, data, db, function(res, temp_dir, file_object, data, db){
                        DocumentUploadController.uploadFile(res, temp_dir, file_object, data, db, function(res, collection, data, db){
                            GeneralController.insertDocument(res, collection, data, db);
                        });
                    });
                }
            }
            // TODO fis this, idk wth is going on with this return
            return// res.status(201).json("Uploading successfull");
        }
    });

    /**
     * @api {post} /NewFileRecord Create new FileUpload record in DB
     * @apiName PostNewFileRecord
     * @apiGroup DocumentUpload

     * @apiDescription Creates a new FileUpload record with complete=0.
     * Main use is for python microservice that scans tree for unlogged files.
     *
     * @apiExample Example usage:
     * http://localhost/NewFileRecord
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 201 Created
    *     {
    *         "result": {
    *             "ok": 1,
    *             "n": 1,
    *             "opTime": {
    *                 "ts": "6446683947802820611",
    *                 "t": 2
    *             }
    *         },
    *         "ops": [
    *             {
    *                 "filename": "testFileName",
    *                 "path": "testPath",
    *                 "expired": "testExpired",
    *                 "complete": "0",
    *                 "dateUploaded": 1500985574333,
    *                 "_id": "597738e658c1842420688aa9"
    *             }
    *         ],
    *         "insertedCount": 1,
    *         "insertedIds": [
    *             "597738e658c1842420688aa9"
    *         ]
    *     }
     */
    app.post('/NewFileRecord',function(req,res){
        GeneralController.insertDocument(res, GeneralController.FILEUPLOADS_COLLECTION, req.body, db);
    });
}


// module.exports = router;
