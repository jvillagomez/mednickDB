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
    downloadFile: function(res, db, id){
        db.dev.collection(GeneralController.FILEUPLOADS_COLLECTION).find({_id: ObjectId(id)}).nextObject(function(err, doc) {
            var filePath = doc.path;
            var fileName = doc.filename;
            res.sendFile(filePath, function (err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    console.log('Sent:', fileName);
                }
            });
        });


        // collection.find().nextObject(function(err, item) {
        //     db.close();
        // });
    }
}
