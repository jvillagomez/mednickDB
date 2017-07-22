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
    app.get('/getStudies/', function(req,res){
        db.dev.collection(FILEUPLOADS_COLLECTION).distinct('study',(function(err, docs){
            if (err) {
              handleError(res, err.message, "Failed to get studies.");
            } else {
              res.status(200).json(docs);
            }
        }));
    });

    app.get('/getVisits/', function(req,res){
        var study = req.query.study
        console.log(study);

        db.dev.collection(FILEUPLOADS_COLLECTION).distinct('visit',{study:study},(function(err, docs){
            if (err) {
              handleError(res, err.message, "Failed to get visits.");
            } else {
              res.status(200).json(docs);
            }
        }));
    });

    app.get('/getSessions/', function(req,res){
        var study = req.query.study
        var visit = req.query.visit
        console.log(study);
        console.log(visit);

        db.dev.collection(FILEUPLOADS_COLLECTION).distinct('session',{study:study,visit:visit},(function(err, docs){
            if (err) {
              handleError(res, err.message, "Failed to get Sessions.");
            } else {
              res.status(200).json(docs);
            }
        }));
    });

    app.get('/getDocTypes/', function(req,res){
        db.dev.collection(FILEUPLOADS_COLLECTION).distinct('doctype',(function(err, docs){
            if (err) {
              handleError(res, err.message, "Failed to get visits.");
            } else {
              res.status(200).json(docs);
            }
        }));
    });
    // ==================================================
    // END [DROPDOWN Selections]

    // START [FIle Records]
    // ==================================================
    app.get('/files/',function(req,res){
        DocumentBrowseController.getCompleteFiles(req,res,db);
    });

    app.get('/file/', function (req, res) {
        var id = req.query.id;
        if (!id) {
            res.status(500).send('No document ID provided');
        } else {
            DocumentBrowseController.getFilebyID(res,id,db);
        }
    });

    app.get('/files/temp/',function(req,res){
        console.log("inside files/temp/ route");
        console.log(db);
        DocumentBrowseController.getTempFiles(res,db);
    });
}

// module.exports = router;
