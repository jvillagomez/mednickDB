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

var CWD = process.cwd();
var UPLOAD_TO = path.join(CWD,"uploads/mednickFileSystem")
var TEMP_DIR = path.join(CWD,"uploads/temp")

module.exports = {
    cwd: CWD,
    upload_to : UPLOAD_TO,
    temp_dir: TEMP_DIR,

    uploadFile: function (res,dir_path,file_object,data,db,callback) {
        if(!fs.existsSync(data.path)){
          file_object.mv(data.path, function(err){
              if(err){
                  return handleError(res,err);
              }
              else {
                  callback(res, GeneralController.FILEUPLOADS_COLLECTION, data, db);
              }
          })
        }
        else {
          return res.status(500).send("File already exists!");
        }
    },
    completeUpload: function (res,file_object,data,db,callback) {
        data.complete = "1";
        var study = (data.study).trim();
        var visit = (data.visit).trim();
        var session = (data.session).trim();
        var doctype = (data.doctype).trim();
        var file_name = (data.filename).trim();

        var dir_path = path.join(this.upload_to, study, visit, session, doctype);
        var file_path = path.join(dir_path, file_name);
        data.path = file_path;
        callback(res, dir_path, file_object, data, db)
    },
    incompleteUpload: function (res,file_object,data,db,callback) {
        data.complete = "0";
        console.log(this.temp_dir);
        console.log(data.filename);
        var file_path = path.join(this.temp_dir,data.filename);
        data.path = file_path;
        // callback();
        callback(res,this.temp_dir,file_object,data,db);
    },
    checkDir: function (res,dir_path,file_object,data,db,callback) {
        if (!fs.existsSync(dir_path)){
          mkpath(dir_path, function (err) {
              if (err){
                  return handleError(res,err);
              }
              else {
                  callback(res,dir_path,file_object,data,db)
              }
          });
        }
        else {
          callback(res,dir_path,file_object,data,db)
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
