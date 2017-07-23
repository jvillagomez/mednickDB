var fs = require('fs');
var mkdirp = require('mkdirp');
var mkpath = require('mkpath');

var express = require('express');
var router = express.Router();
var fileUpload = require('express-fileupload');
var path = require('path');
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID;

var DataTableController = require('../controllers/dataTable_Controller')
var DocumentBrowseController = require('../controllers/documentBrowse_Controller')
var DocumentDownloadController = require('../controllers/documentDownload_Controller')
var DocumentUpdateController = require('../controllers/documentUpdate_Controller')
var DocumentUploadController = require('../controllers/documentUpload_Controller')
var GeneralController = require('../controllers/general_Controller')

module.exports = {
    updateParsedDocument: function (res,id,db) {
        db.collection(GeneralController.FILEUPLOADS_COLLECTION).updateOne(
           { _id: ObjectId(id) },
           {
             $set: { "parsed": "1"},
             $currentDate: { lastModified: true }
         },
         function(err,doc){
             if(err){
                 res.status(500).json({"error": err});
             }
             else {
                 res.status(201).json(doc);
             }
         });
    }
};
