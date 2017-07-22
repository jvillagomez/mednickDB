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

var DataTableController = require('../controllers/dataTable_Controller')
var DocumentBrowseController = require('../controllers/documentBrowse_Controller')
var DocumentDownloadController = require('../controllers/documentDownload_Controller')
var DocumentUpdateController = require('../controllers/documentUpdate_Controller')
var DocumentUploadController = require('../controllers/documentUpload_Controller')
var GeneralController = require('../controllers/general_Controller')

var CWD = process.cwd();
var UPLOAD_TO = path.join(CWD,"uploads/mednickFileSystem")
var TEMP_DIR = path.join(CWD,"uploads/temp")

module.exports = {
    getTempFiles: function(res,db){
        db.dev.collection(general.FILEUPLOADS_COLLECTION).find({complete:"0",expired:"0"}).toArray(function(err,docs){
            if (err) {
              GeneralController.handleError(res, err);
            } else {
              res.status(200).json(docs);
            }
        });
    }
}
