var fs = require('fs');
var mkdirp = require('mkdirp');
var mkpath = require('mkpath');

var express = require('express');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var monk = require('monk');
var cors = require('cors');

var router = express.Router();0

var DataTableController = require('../controllers/dataTable_Controller')
var DocumentBrowseController = require('../controllers/documentBrowse_Controller')
var DocumentDownloadController = require('../controllers/documentDownload_Controller')
var DocumentUpdateController = require('../controllers/documentUpdate_Controller')
var DocumentUploadController = require('../controllers/documentUpload_Controller')
var GeneralController = require('../controllers/general_Controller')


router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

module.exports = function(app,db){
    /**
     * @api {get} /sleepScores Request all sleepscoring records
     * @apiName SleepScores
     * @apiGroup DataTable
     */
    app.get('/sleepScores/', function(req,res){
        db.dev.collection(SLEEPSCORES_COLLECTION).find({}).toArray(function(err,docs){
            if (err) {
              handleError(res, err.message, "Failed to get SLEEPSCORE records.");
            } else {
              res.status(200).json(docs);
            }
        });
    });

    /**
     * @api {get} /screenings Request all screening records
     * @apiName Screenings
     * @apiGroup DataTable
     */
    app.get('/screenings/', function(req,res){
        db.dev.collection(SCREENINGS_COLLECTION).find({}).toArray(function(err,docs){
            if (err) {
              handleError(res, err.message, "Failed to get SCREENING records.");
            } else {
              res.status(200).json(docs);
            }
        });
    });
}

// module.exports = router;
