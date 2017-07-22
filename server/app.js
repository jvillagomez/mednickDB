var express = require('express');
var fs = require('fs');
var mkdirp = require('mkdirp');
var mkpath = require('mkpath');
var router = express.Router();
var fileUpload = require('express-fileupload');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var monk = require('monk');
var cors = require('cors');

var app = express();

var initializeDatabases = require('./dbs');

var DocumentBrowseRoutes = require('./routes/documentBrowse_Routes')
var DocumentUploadRoutes = require('./routes/documentUpload_Routes')
var DocumentUpdateRoutes = require('./routes/documentUpdate_Routes')
var DataTableRoutes = require('./routes/dataTable_Routes')
var InsertDataRoutes = require('./routes/insertData_Routes')

// var documentUpload = require('./routes/documentUpload');
// var documentBrowse = require('./routes/documentBrowse');
// var dataTable = require('./routes/dataTable');


process.env.PWD = process.cwd();
var PUBLIC_PATH = path.resolve(process.env.PWD + '/public');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'p ublic')));
app.use('/public', express.static(PUBLIC_PATH));
app.use(fileUpload());
app.use(cors());

initializeDatabases(function(err, dbs) {
    if (err) {
        console.error('Failed to make all database connections!');
        console.error(err);
        process.exit(1);
    }

    // Initialize the application once database connections are ready.
    DocumentBrowseRoutes(app, dbs);
    DocumentUploadRoutes(app, dbs);
    DocumentUpdateRoutes(app, dbs);
    DataTableRoutes(app, dbs);
    InsertDataRoutes(app, dbs);

    app.listen(8001, function() {
        console.log('Listening on port 8001');
    });
});

app.get('/',function(req,res){
    res.status(200).send("Success placing GET call.");
});

module.exports = app;
