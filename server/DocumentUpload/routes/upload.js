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
var general = require('../../generalFunctions/general')

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
        var data = req.body;
        var fileQuantity = (req.files.docfile).length;
        if (fileQuantity)
        {
            var file_objects = req.files.docfile;
            file_objects.forEach(function(file_object) {
                console.log(file_object);

                data.filename = file_object.name;
                data.expired = "0";
                data.uploadedBy = "stude001@ucr.edu";

                // upload.incompleteUpload(res,file_object,data,function(res, ){

                // });
            });
        }

        else
        {
            var file_object = req.files.docfile;
            console.log(file_object);

            var complete = upload.isComplete(data);
            console.log(complete);

            data.filename = file_object.name;
            data.expired = "0"
            data.uploadedBy = "stude001@ucr.edu";

            if (complete) {
                upload.completeUpload(res,file_object,data,function(res,dir_path,file_object,data){
                    upload.checkDir(res,dir_path,file_object,data,function(res,dir_path,file_object,data){
                        upload.uploadFile(res,dir_path,file_object,data,function(res,data){
                            general.insertDocument(res, general.FILEUPLOADS_COLLECTION, data);
                        })
                    })
                });
            } else {
                upload.incompleteUpload(res,file_object,entry,upload.CheckDir);
            }
        }

        return// res.status(201).json("Uploading successfull");
    }
});


module.exports = router;
