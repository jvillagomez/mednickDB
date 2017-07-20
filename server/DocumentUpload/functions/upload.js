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

var fileUpload = require('express-fileupload');
var path = require('path');

var CWD = process.cwd();
var UPLOAD_TO = path.join(CWD,"uploads/mednickFileSystem")
var TEMP_DIR = path.join(CWD,"uploads/temp")

module.exports = {
    cwd: CWD,
    upload_to : UPLOAD_TO,
    temp_dir: TEMP_DIR,

    uploadFile: function (res,file_path,dir_path,file_object,data) {
      if(!fs.existsSync(file_path)){
          file_object.mv(file_path, function(err){
              console.log(dir_path);
              if(err){
                  console.log("Error in file upload");
                  return handleError(res,err);
              }
              else {
                  console.log("File successfully moved");
                  insertDocument(res,FILEUPLOADS_COLLECTION,data)
              }
          })
      }
      else {
          return res.status(500).send("File already exists!");
      }
    },
    completeUpload: function (res,file_object,data) {
      data.complete = "1";
      var study = (data.study).trim();
      var visit = (data.visit).trim();
      var session = (data.session).trim();
      var doctype = (data.doctype).trim();
      var file_name = (data.filename).trim();

      var dir_path = path.join(UPLOAD_TO, study, visit, session, doctype);
      var file_path = path.join(dir_path, file_name);
      data.path = file_path;

      upload.CheckDir(res,file_path,dir_path,file_object,data,uploadFile);
    },
    incompleteUpload: function (res,file_object,data,callback) {
      data.complete = "0";
      var file_path = path.join(TEMP_DIR,data.filename);
      data.path = file_path;
      callback(res,file_path,TEMP_DIR,file_object,data);
    },
    CheckDir: function (res,file_path,dir_path,file_object,data,callback) {
      if (!fs.existsSync(dir_path)){
          console.log('Dir does not exist yet');
          mkpath(dir_path, function (err) {
              console.log("Crip niggas");
              if (err){
                  console.log('Error creating fileDir');
                  return handleError(res,err);
              }
              else {
                  console.log('fileDir created successfully');
                  callback(res,file_path,dir_path,file_object,data)
              }
          });
      }
      else {
          callback(res,file_path,dir_path,file_object,data)
      }
    },
    isComplete: function (data) {
      var metadata = [
          data.study,
          data.visit,
          data.session,
          data.doctype
      ];

      for (attribute of metadata) {
          if(!attribute){
              return false
          }
      }
      return true
  }
};
