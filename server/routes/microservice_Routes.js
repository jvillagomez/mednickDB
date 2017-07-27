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
     * @api {post} /NewFileRecord Create new record in DB for an unlogged file
     * @apiName PostNewFileRecord
     * @apiGroup Microservices

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

    /**
     * @api {post} /UpdateParsedStatus Update "parsed" status for a file
     * @apiName PostUpdateParsedStatus
     * @apiGroup Microservices
     */
    app.post('/UpdateParsedStatus', function(req,res){
        DocumentUpdateController.updateParsedStatus(res, db, req.body.id);
    });

    /**
     * @api {post} /TaskData Post new TaskData record
     * @apiName PostTaskData
     * @apiGroup Microservices
     */
    app.post('/TaskData', function(req,res){
        GeneralController.insertDocument(res, GeneralController.SLEEPSCORES_COLLECTION, req.body, db);
    });

    /**
     * @api {post} /Screenings Post new screening record
     * @apiName PostScreenings
     * @apiGroup Microservices
     */
    app.post('/Screening', function(req,res){
        GeneralController.insertDocument(res, GeneralController.SCREENINGS_COLLECTION, req.body, db);
    });
    // TODO place /NewTempFileRecord in here
}

// module.exports = router;
