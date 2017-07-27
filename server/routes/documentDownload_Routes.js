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
var DocumentDeleteController = require('../controllers/documentDelete_Controller')
var GeneralController = require('../controllers/general_Controller')

var router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});


module.exports = function(app,db){
    /**
     * @api {get} /DownloadFile Fetch file-object, by ID
     * @apiName GetDownloadFile
     * @apiGroup Files_Download
      * @apiDescription Returns file object, matching ID param.
      * @apiParam {String} id          Unique string, created by DB at time of insertion.
      *
      * @apiExample Example usage:
      * http://localhost/DownloadFile?id=5977072b60950c2778cd2d33
      *
      * @apiSuccessExample {json} Success-Response:
      *     HTTP/1.1 200 OK
        *    {
        *        <FILE OBJECT>
        *    }
      */
    app.get('/DownloadFile', function (req, res) {
        var id = req.query.id;
        if (!id) {
            res.status(500).send('No document ID provided');
        } else {
            DocumentDownloadController.downloadFile(res, db, id);
        }
    });
}


// module.exports = router;
