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
     * @api {post} /DeleteFile Delete file record
     * @apiName PostDeleteFile
     * @apiGroup Files_Delete
      * @apiDescription Used to update metada, or complete a fileupload record entry.
      * Provide document ID in URL, and values in request body.
      * @apiParam {String} id          Unique string, created by DB at time of insertion.
      *
      * @apiExample Example usage:
      * http://localhost/DeleteFile
      *
      * @apiSuccessExample {json} Success-Response:
      *     HTTP/1.1 200 OK
    *    {
    *        "ok": 1,
    *        "nModified": 1,
    *        "n": 1,
    *        "opTime": {
    *            "ts": "6447281906034671618",
    *            "t": 2
    *        },
    *        "electionId": "7fffffff0000000000000002"
    *    }
      */
    app.post('/DeleteFile',function(req,res){
        if(!(req.body.id)){
            return res.status(400).send('No ID was provided.')
        } else {
            DocumentDeleteController.deleteFile(res, db, req.body.id);
        }
    });

}


// module.exports = router;
