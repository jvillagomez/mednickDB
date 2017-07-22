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

var GeneralController = require('./general_Controller')


var CWD = process.cwd();
var UPLOAD_TO = path.join(CWD,"uploads/mednickFileSystem")
var TEMP_DIR = path.join(CWD,"uploads/temp")

module.exports = {
    getTempFiles: function(res,db){
        db.dev.collection(GeneralController.FILEUPLOADS_COLLECTION).find({complete:"0",expired:"0"}).toArray(function(err,docs){
            if (err) {
              GeneralController.handleError(res, err);
            } else {
              res.status(200).json(docs);
            }
        });
    }
}
