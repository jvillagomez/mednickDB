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
var upload = require('../functions/upload.js')

var router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.post('/upload/',function(req,res){
    if(!req.files){
        console.log("No file was uploaded")
        return res.status(400).send('No files were uploaded.')
    } else {
        var entry = req.body;
        var fileQuantity = (req.files.docfile).length;
        if (fileQuantity)
        {
            var file_objects = req.files.docfile;
            file_objects.forEach(function(file_object) {
                console.log(file_object);

                entry.filename = file_object.name;
                entry.expired = "0";
                entry.uploadedBy = "stude001@ucr.edu";

                upload.incompleteUpload(res,file_object,entry);
            });
        }

        else
        {
            var file_object = req.files.docfile;
            console.log(file_object);

            var complete = upload.isComplete(entry);

            entry.filename = file_object.name;
            entry.expired = "0"
            entry.uploadedBy = "stude001@ucr.edu";

            if (complete) {
                upload.completeUpload(res,file_object,entry);
            } else {
                upload.incompleteUpload(res,file_object,entry);
            }
        }

        return// res.status(201).json("Uploading successfull");
    }
});


module.exports = router;
