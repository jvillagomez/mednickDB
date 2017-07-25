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
    app.post('/TaskData', function(req,res){
        GeneralController.insertDocument(res, GeneralController.SLEEPSCORES_COLLECTION, req.body, db);
    });

    /**
     * @api {post} /Screenings Post new screening records
     * @apiName PostScreenings
     * @apiGroup InsertData
     */
    app.post('/Screening', function(req,res){
        GeneralController.insertDocument(res, GeneralController.SCREENINGS_COLLECTION, req.body, db);
    });
}

// module.exports = router;
