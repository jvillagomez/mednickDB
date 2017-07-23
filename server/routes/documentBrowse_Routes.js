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
    // START [DROPDOWN Selections]
    // ==================================================
    /**
     * @api {get} /Studies Request all unique study IDs
     * @apiName GetStudies
     * @apiGroup DocumentBrowse
     */
    app.get('/Studies', function(req,res){
        db.dev.collection(GeneralController.FILEUPLOADS_COLLECTION).distinct('study',(function(err, docs){
            if (err) {
              handleError(res, err.message, "Failed to get studies.");
            } else {
              res.status(200).json(docs);
            }
        }));
    });

    /**
     * @api {get} /Visits Request all unique visit IDs
     * @apiName GetVisits
     * @apiGroup DocumentBrowse
     */
    app.get('/Visits', function(req,res){
        var study = req.query.study
        console.log(study);

        db.dev.collection(GeneralController.FILEUPLOADS_COLLECTION).distinct('visit',{study:study},(function(err, docs){
            if (err) {
              handleError(res, err.message, "Failed to get visits.");
            } else {
              res.status(200).json(docs);
            }
        }));
    });

    /**
     * @api {get} /Sessions Request all unique session IDs
     * @apiName GetSessions
     * @apiGroup DocumentBrowse
     */
    app.get('/Sessions', function(req,res){
        var study = req.query.study
        var visit = req.query.visit
        console.log(study);
        console.log(visit);

        db.dev.collection(GeneralController.FILEUPLOADS_COLLECTION).distinct('session',{study:study,visit:visit},(function(err, docs){
            if (err) {
              handleError(res, err.message, "Failed to get Sessions.");
            } else {
              res.status(200).json(docs);
            }
        }));
    });

    /**
     * @api {get} /DocumentTypes Request all unique DocumentTypes
     * @apiName GetDocumentTypes
     * @apiGroup DocumentBrowse
     */
    app.get('/DocumentTypes', function(req,res){
        db.dev.collection(GeneralController.FILEUPLOADS_COLLECTION).distinct('doctype',(function(err, docs){
            if (err) {
              handleError(res, err.message, "Failed to get visits.");
            } else {
              res.status(200).json(docs);
            }
        }));
    });
    // ==================================================
    // END [DROPDOWN Selections]

    // START [File Records]
    // ==================================================
    /**
     * @api {get} /Files Request all complete fileupload records
     * @apiName GetFiles
     * @apiGroup DocumentBrowse
     */
    app.get('/Files',function(req,res){
        DocumentBrowseController.getCompleteFiles(req,res,db);
    });

    /**
     * @api {get} /File Request fileupload record by ID
     * @apiName GetFile
     * @apiGroup DocumentBrowse
     */
    app.get('/File', function (req, res) {
        var id = req.query.id;
        if (!id) {
            res.status(500).send('No document ID provided');
        } else {
            DocumentBrowseController.getFilebyID(res,id,db);
        }
    });

    /**
     * @api {get} /TempFiles Request all incomplete FILEUPLOAD records
     * @apiName GetTempFiles
     * @apiGroup DocumentBrowse
     */
    app.get('/TempFiles/',function(req,res){
        console.log("inside files/temp/ route");
        console.log(db);
        DocumentBrowseController.getTempFiles(res,db);
    });
}

// module.exports = router;
