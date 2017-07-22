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

var CWD = process.cwd();
var UPLOAD_TO = path.join(CWD,"uploads/mednickFileSystem")
var TEMP_DIR = path.join(CWD,"uploads/temp")

var CWD = process.cwd();

module.exports = {
    cwd: CWD,

    SLEEPSCORES_COLLECTION: "sleepScores",
    SLEEPDIARIES_COLLECTION: "sleepDiaries",
    SCREENINGS_COLLECTION: "screenings",
    FILEUPLOADS_COLLECTION: "fileUploads",
    TEST_COLLECTION: "test",

    handleError: function (res, error) {
        console.log("ERROR: " + error);
        res.status(500).json({"error": error});
    },

    insertDocument: function (res,collection_name,data,db) {
        data.dateUploaded = Date.now();
        db.dev.collection(collection_name).insert(data, function (err,doc){
            if(err){
                this.handleError(res,err);
            }
            else {
                res.status(201).json(doc);
            }
        });
    }
};
