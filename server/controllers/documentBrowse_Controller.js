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
    getDeletedFiles: function(res,db){
        db.dev.collection(GeneralController.FILEUPLOADS_COLLECTION).find({expired:"1"}).toArray(function(err,docs){
            if (err) {
              GeneralController.handleError(res, err);
            } else {
              res.status(200).json(docs);
            }
        });
    },
    getTempFiles: function(res,db){
        db.dev.collection(GeneralController.FILEUPLOADS_COLLECTION).find({complete:"0",expired:"0"}).toArray(function(err,docs){
            if (err) {
              GeneralController.handleError(res, err);
            } else {
              res.status(200).json(docs);
            }
        });
    },
    getCompleteFiles: function(req,res,db){
        var study = req.query.study;
        var visit = req.query.visit;
        var session = req.query.session;
        var doctype = req.query.doctype;

        if(!study && !doctype){
            db.dev.collection(GeneralController.FILEUPLOADS_COLLECTION).find({complete:"1",expired:"0"}).toArray(function(err,docs){
                if (err) {
                  GeneralController.handleError(res, err.message, "Failed to get complete docs.");
                } else {
                  res.status(200).json(docs);
                }
            });

        } else if (!study && doctype) {
            db.dev.collection(GeneralController.FILEUPLOADS_COLLECTION).find({doctype:doctype,complete:"1",expired:"0"}).toArray(function(err,docs) {
                res.status(200).json(docs)
            })
        } else if (study && !doctype) {
            if(!visit){
                db.dev.collection(GeneralController.FILEUPLOADS_COLLECTION).find({study:study,complete:"1",expired:"0"}).toArray(function(err,docs){
                    res.status(200).json(docs)
                })
            } else if (!session) {
                db.dev.collection(GeneralController.FILEUPLOADS_COLLECTION).find({study:study,visit:visit,complete:"1",expired:"0"}).toArray(function(err,docs){
                    res.status(200).json(docs)
                })
            } else {
                db.dev.collection(GeneralController.FILEUPLOADS_COLLECTION).find({study:study,visit:visit,session:session,complete:"1",expired:"0"}).toArray(function(err,docs){
                    res.status(200).json(docs)
                })
            }
        } else if (study && doctype) {
            if(!visit){
                db.dev.collection(GeneralController.FILEUPLOADS_COLLECTION).find({study:study,doctype:doctype,complete:"1",expired:"0"}).toArray(function(err,docs){
                    res.status(200).json(docs)
                })
            } else if (!session) {
                db.dev.collection(GeneralController.FILEUPLOADS_COLLECTION).find({study:study,visit:visit,doctype:doctype,complete:"1",expired:"0"}).toArray(function(err,docs){
                    res.status(200).json(docs)
                })
            } else {
                db.dev.collection(GeneralController.FILEUPLOADS_COLLECTION).find({study:study,visit:visit,session:session,doctype:doctype,complete:"1",expired:"0"}).toArray(function(err,docs){
                    res.status(200).json(docs)
                })
            }
        } else {
            console.log("If youre seeing this somthing is completely fucked up in the request :)");
        }
    },
    getFilebyID: function(res,id,db){
        db.dev.collection(GeneralController.FILEUPLOADS_COLLECTION).find({_id: ObjectId(id),expired:"0"}).toArray(function(err,docs){
            if (err) {
                GeneralController.handleError(res, err.message, "Failed to get temp records.");
            } else {
                var data = docs[0]
                // console.log(data);
                res.status(200).json(data)
            }
        });
    }
}
