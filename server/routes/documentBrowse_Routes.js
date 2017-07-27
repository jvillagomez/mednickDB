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

var DataTableController = require('../controllers/dataTable_Controller')
var DocumentBrowseController = require('../controllers/documentBrowse_Controller')
var DocumentDownloadController = require('../controllers/documentDownload_Controller')
var DocumentUpdateController = require('../controllers/documentUpdate_Controller')
var DocumentUploadController = require('../controllers/documentUpload_Controller')
var GeneralController = require('../controllers/general_Controller')

var router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});


module.exports = function(app,db){
     /**
      * @api {get} /Studies Request all unique study IDs
      * @apiName GetStudies
      * @apiGroup Files_Browse
      * @apiDescription Retrieve a list of unique study IDs from all documents logged in DB.
      *
      * @apiExample Example usage:
      * http://localhost/Studies
      *
      * @apiSuccessExample {json} Success-Response:
      *     HTTP/1.1 200 OK
      *         {
      *               [
      *                 "study4",
      *                 "study1",
      *                 "study2",
      *                 "study3"
      *                ]
      *         }
      */
    app.get('/Studies', function(req,res){
        db.dev.collection(GeneralController.FILEUPLOADS_COLLECTION).distinct('study',(function(err, docs){
            if (err) {
              handleError(res, err.message, "Failed to get studies.");
            } else {
              res.status(200).json(docs);
            }
        }));
    });

     /**
      * @api {get} /Visits Request all unique visit IDs
      * @apiName GetVisits
      * @apiGroup Files_Browse
      * @apiDescription Retrieve a list of unique visit IDs from all documents logged in DB.
      * Because VISIT IDs may overlap across different studies, a Study ID param is neccesary for reference.
      * @apiParam {String} study          Study ID needed to avoid overlapping/duplicate visit IDs.
      *
      * @apiExample Example usage:
      * http://localhost/Visits?study=study1
      *
      * @apiSuccessExample {json} Success-Response:
      *     HTTP/1.1 200 OK
      *         {
      *               [
      *                 "visit1",
      *                 "visit2",
      *                 "visit3",
      *                 "visit4"
      *                ]
      *         }
      */
    app.get('/Visits', function(req,res){
        var study = req.query.study
        if(!study){
            return res.status(400).send('No STUDY ID provided.')
        } else {
            db.dev.collection(GeneralController.FILEUPLOADS_COLLECTION).distinct('visit',{study:study},(function(err, docs){
                if (err) {
                  handleError(res, err.message, "Failed to get visits.");
                } else {
                  res.status(200).json(docs);
                }
            }));
        }
    });

     /**
      * @api {get} /Sessions Request all unique session IDs
      * @apiName GetSessions
      * @apiGroup Files_Browse
      * @apiDescription Retrieve a list of unique session IDs from all documents logged in DB.
      * Because Session IDs may overlap across different studies, study ID and visit ID params are neccesary for reference.
      *
      * @apiParam {String} study          Study ID. Neccesary for "complete" upload.
      * @apiParam {String} visit          VISIT ID. Neccesary for "complete" upload.
      *
      * @apiExample Example usage:
      * http://localhost/Sessions?study=study1&visit=visit1
      *
      * @apiSuccessExample {json} Success-Response:
      *     HTTP/1.1 200 OK
      *         {
      *               [
      *                 "session1",
      *                 "session2",
      *                 "session3",
      *                 "session4"
      *                ]
      *         }
      */
    app.get('/Sessions', function(req,res){
        var study = req.query.study
        var visit = req.query.visit
        if(!study){
            return res.status(400).send('No STUDY ID provided.')
        } else if (!visit){
            return res.status(400).send('No VISIT ID provided.')
        } else {
            db.dev.collection(GeneralController.FILEUPLOADS_COLLECTION).distinct('session',{study:study,visit:visit},(function(err, docs){
                if (err) {
                  handleError(res, err.message, "Failed to get Sessions.");
                } else {
                  res.status(200).json(docs);
                }
            }));
        }
    });

     /**
      * @api {get} /DocumentTypes Request all unique DocumentTypes
      * @apiName GetDocumentTypes
      * @apiGroup Files_Browse
      * @apiDescription Retrieve a list of unique study IDs from all documents logged in DB.
      *
      * @apiExample Example usage:
      * http://localhost/DocumentTypes
      *
      * @apiSuccessExample {json} Success-Response:
      *     HTTP/1.1 200 OK
      *         {
      *               [
      *                 "doctype1",
      *                 "doctype2",
      *                 "doctype3",
      *                 "doctype4"
      *                ]
      *         }
      */
    app.get('/DocumentTypes', function(req,res){
        db.dev.collection(GeneralController.FILEUPLOADS_COLLECTION).distinct('doctype',(function(err, docs){
            if (err) {
              handleError(res, err.message, "Failed to get visits.");
            } else {
              res.status(200).json(docs);
            }
        }));
    });

     /**
      * @api {get} /Files Get all complete file records
      * @apiName GetFiles
      * @apiGroup Files_Browse
      * @apiDescription Retrieve all FileUpload records, that are complete with study, visit, session, and doctype metadata.
      * Returns fileupload records, not the file objects stored in fileserver.

      * @apiParam {String} [study=Null]          Study param is independent of other params.
      * @apiParam {String} [visit=Null]          Visit param will be ignored, if a study param is not provided.
      * @apiParam {String} [session=Null]        Session param will be ignored, if a visit param is not provided.
      * @apiParam {String} [doctype=Null]        DocType param is independent of other params.
      *
      * @apiExample w/Parameters:
      * http://localhost/Files?study=study4&visit=visit1&session=session1&doctype=screening
      *
      * @apiSuccessExample {json} Response (w/params):
      *     HTTP/1.1 200 OK
      *     [
      *         {
      *             "_id": "5977072b60950c2778cd2d33",
      *             "study": "study4",
      *             "visit": "visit1",
      *             "session": "session1",
      *             "doctype": "screening",
      *             "filename": "SF2014_ScreeningQuestionnaire_MASTER.xlsx",
      *             "expired": "0",
      *             "uploadedBy": "stude001@ucr.edu",
      *             "complete": "1",
      *             "path": "C:\\source\\mednickdb\\server\\uploads\\mednickFileSystem\\study4\\visit1\\session1\\screening\\SF2014_ScreeningQuestionnaire_MASTER.xlsx",
      *             "dateUploaded": 1500972843113
      *         }
      *     ]
      * @apiExample w/o Parameters:
      * http://localhost/Files
      *
      * @apiSuccessExample {json} Response (w/o params):
      *     HTTP/1.1 200 OK
      *     [
      *         {
      *             "_id": "5977072b60950c2778cd2d33",
      *             "study": "study4",
      *             "visit": "visit1",
      *             "session": "session1",
      *             "doctype": "screening",
      *             "filename": "SF2014_ScreeningQuestionnaire_MASTER.xlsx",
      *             "expired": "0",
      *             "uploadedBy": "stude001@ucr.edu",
      *             "complete": "1",
      *             "path": "C:\\source\\mednickdb\\server\\uploads\\mednickFileSystem\\study4\\visit1\\session1\\screening\\SF2014_ScreeningQuestionnaire_MASTER.xlsx",
      *             "dateUploaded": 1500972843113
      *         },
      *         {
      *             "_id": "5977073360950c2778cd2d34",
      *             "study": "study1",
      *             "visit": "visit1",
      *             "session": "session1",
      *             "doctype": "screening",
      *             "filename": "SF2014_ScreeningQuestionnaire_MASTER.xlsx",
      *             "expired": "0",
      *             "uploadedBy": "stude001@ucr.edu",
      *             "complete": "1",
      *             "path": "C:\\source\\mednickdb\\server\\uploads\\mednickFileSystem\\study4\\visit1\\session1\\screening\\SF2014_ScreeningQuestionnaire_MASTER.xlsx",
      *             "dateUploaded": 1500972843113
      *         }
      *     ]
      */
    app.get('/Files',function(req,res){
        DocumentBrowseController.getCompleteFiles(req,res,db);
    });

    /**
     * @api {get} /File Get file record, by ID
     * @apiName GetFile
     * @apiGroup Files_Browse
      * @apiDescription Retrieve FileUpload record, matching ID param.
      * Returns matching fileupload record, not the file object stored in fileserver.
      * @apiParam {String} id          Unique string, created by DB at time of insertion.
      *
      * @apiExample Example usage:
      * http://localhost/File?id=5977072b60950c2778cd2d33
      *
      * @apiSuccessExample {json} Success-Response:
      *     HTTP/1.1 200 OK
        *    {
        *        "_id": "5977072b60950c2778cd2d33",
        *        "study": "study4",
        *        "visit": "visit1",
        *        "session": "session1",
        *        "doctype": "screening",
        *        "filename": "SF2014_ScreeningQuestionnaire_MASTER.xlsx",
        *        "expired": "0",
        *        "uploadedBy": "stude001@ucr.edu",
        *        "complete": "1",
        *        "path": "C:\\source\\mednickdb\\server\\uploads\\mednickFileSystem\\study4\\visit1\\session1\\screening\\SF2014_ScreeningQuestionnaire_MASTER.xlsx",
        *        "dateUploaded": 1500972843113
        *    }
      */
    app.get('/File', function (req, res) {
        var id = req.query.id;
        if (!id) {
            res.status(500).send('No document ID provided');
        } else {
            DocumentBrowseController.getFilebyID(res,id,db);
        }
    });

    /**
     * @api {get} /TempFiles Request all incomplete file records
     * @apiName GetTempFiles
     * @apiGroup Files_Browse
     * @apiDescription Retrieve all FileUpload records, that have incomplete metadata.
     * Returns fileupload records, not the file objects stored in fileserver.
     *
     * @apiExample Example usage:
     * http://localhost/TempFiles
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
    *        [
    *            {
    *                "_id": "597716d55c296c2418a0a74f",
    *                "filename": "LSD Demographics.xlsx",
    *                "expired": "0",
    *                "uploadedBy": "stude001@ucr.edu",
    *                "complete": "0",
    *                "path": "C:\\source\\mednickdb\\server\\uploads\\temp\\LSD Demographics.xlsx",
    *                "dateUploaded": 1500976853428
    *            },
    *            {
    *                "_id": "597716e15c296c2418a0a750",
    *                "filename": "NP_ScreeningQuestionnaire_MASTER.xlsx",
    *                "expired": "0",
    *                "uploadedBy": "stude001@ucr.edu",
    *                "complete": "0",
    *                "path": "C:\\source\\mednickdb\\server\\uploads\\temp\\NP_ScreeningQuestionnaire_MASTER.xlsx",
    *                "dateUploaded": 1500976865929
    *            }
    *        ]
     */
    app.get('/TempFiles',function(req,res){
        console.log("inside files/temp/ route");
        console.log(db);
        DocumentBrowseController.getTempFiles(res,db);
    });

    /**
     * @api {get} /DeletedFiles Get all deleted file records
     * @apiName GetDeletedFiles
     * @apiGroup Files_Browse
     * @apiDescription Retrieve all deleted (expired) FileUpload records.
     * Returns deteled fileupload records, not the file objects stored in fileserver.
     * Places files in RECYCLE_BIN dir.

     * @apiExample Example usage:
     * http://localhost/DeletedFiles
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
    *        [
    *            {
    *                "_id": "597716d55c296c2418a0a74f",
    *                "filename": "LSD Demographics.xlsx",
    *                "expired": "1",
    *                "uploadedBy": "stude001@ucr.edu",
    *                "complete": "0",
    *                "path": "C:\\source\\mednickdb\\server\\uploads\\temp\\LSD Demographics.xlsx",
    *                "dateUploaded": 1500976853428
    *            },
    *            {
    *                "_id": "597716e15c296c2418a0a750",
    *                "filename": "NP_ScreeningQuestionnaire_MASTER.xlsx",
    *                "expired": "1",
    *                "uploadedBy": "stude001@ucr.edu",
    *                "complete": "0",
    *                "path": "C:\\source\\mednickdb\\server\\uploads\\temp\\NP_ScreeningQuestionnaire_MASTER.xlsx",
    *                "dateUploaded": 1500976865929
    *            }
    *        ]
     */
    app.get('/DeletedFiles',function(req,res){
        DocumentBrowseController.getDeletedFiles(res,db);
    });
}

// module.exports = router;
