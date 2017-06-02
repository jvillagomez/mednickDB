
// Multiple doc implementation
// Create files from DB objects
var fs = require('fs');
var mkdirp = require('mkdirp');
var express = require('express');
var router = express.Router();
var fileUpload = require('express-fileupload');
var path = require('path');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/mednick');
var app = express();
var uploadTo = "c:\\mednick\\server\\mednickFiles"
// ==============================================================
process.env.PWD = process.cwd();
var PUBLIC_PATH = path.resolve(process.env.PWD + '/public');
app.set('port', (process.env.PORT || 8001));
// ==============================================================
app.use('/public', express.static(PUBLIC_PATH));
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(function(req,res,next){
    req.db = db;
    next();
});
// ==============================================================
// var collection = db.get('fileuploads');
// app.get('/', function(req, res) {
//     res.sendFile(PUBLIC_PATH + '/index.html');
// });

// START [Uploading files]
// ==================================================
app.post('/incompleteUpload',function(req,res){
    if(!req.files){
        console.log(req)
        console.log("not detecting files")
        return res.status(400).send('No files were uploaded.')
    }
    // TODO think of variableIZING what the values default to according to user. Maybe people doing research need N/A, others none, others an empty string
    let fileObj = req.files.docfile;
    var fileName = req.body.name[0]; //including file extension
    var study = !(req.body.study).trim() ? "" : req.body.study;
    var subject = !(req.body.subject).trim() ? "" : req.body.subject;
    var visit = !(req.body.visit).trim() ? "" : req.body.visit;
    var session = !(req.body.session).trim() ? "" : req.body.session;
    var docType = !(req.body.doctype) ? "" : req.body.doctype;
    var filePath = path.join(uploadTo,'temp',fileName);
    var notes = !(req.body.notes).trim() ? "" : req.body.notes;
    // var dateUploaded = req.body.dateuploaded;
    var expired = false;


    fileObj.mv(filePath, function(err){
        if(err){
            console.log("Hits error in upload");
            return res.status(500).send(err);
        }
        else {
            console.log("Hits pass in uplaod");
            var collection = db.get('fileUploads');
            // res.status(200).send(fileName+' uploaded');
            collection.insert({
                "filename":fileName,
                "study":study,
                "subject":subject,
                "visit":visit,
                "session":session,
                "doctype":docType,
                "filepath":filePath,
                "notes":notes,
                "complete":false,
                // "dateUploaded":dateUploaded,
                "expired":false,
                // "expiredDate":expiredDate
            }, function (err,doc){
                if(err){
                    return res.status(500).json(req.body);
                }
                else {
                    return res.status(200).json(req.body);
                }
            });
        }
    })
});

app.post('/completeUpload',function(req,res){
    if(!req.files){
        return res.status(400).send('No files were uploaded.')
    }

    let fileObj = req.files.docfile;
    var fileName = req.body.name; //including file extension
    var study = req.body.study;
    var subject = req.body.subject;
    var visit = req.body.visit;
    var session = req.body.session;
    var docType = req.body.filetype;
    var fileDir = path.join(uploadTo,study,visit,session,subject,docType);
    var filePath = path.join(fileDir,fileName);
    var notes = !(req.body.notes).trim() ? "N/A" : req.body.notes;
    var dateUploaded = req.body.dateuploaded;
    var expired = false;

    console.log(fileDir);

    if (!fs.existsSync(fileDir)){
        console.log('Dir does not exist yet');
        mkdirp.sync(fileDir, function (err) {
            if (err) console.error(err)
            else console.log('dir created')
        });
    }

    var collection = db.get('fileUploads');

    fileObj.mv(filePath, function(err){
        console.log(filePath);
        if(err){
            console.log("hits err in file upload")
            // console.log(err);
            return res.status(500).send(err);
        }
        else {
            console.log("hits pass in upload")
            // res.status(200).send('FileUplaoded!!');
            collection.insert({
                "filename":fileName,
                "study":study,
                "subject":subject,
                "visit":visit,
                "session":session,
                "doctype":docType,
                "filepath":filePath,
                "notes":notes,
                "complete":true,
                "dateUploaded":dateUploaded,
                "expired":expired,
                // "expiredDate":expiredDate
            }, function (err,doc){
                if(err){
                    console.log("hits err in DB insert")
                    return res.status(500).json(req.body);
                }
                else {
                    console.log("hits pass in DB insert")
                    return res.status(200).json(req.body);
                }
            });
        }
    })
});
// ==================================================
// END [Uploading Files]

// START [Querying files]
// ==================================================
app.get('/getFiles',function(req,res){
    var collection = db.get('fileuploads')
    var study = req.query.study
    var visit = req.query.visit
    var session = req.query.session
    var doctype = req.query.doctype

    if(!study && !doctype){
        collection.find({complete:true,expired:false}).then((docs) => {
            console.log(docs);
            res.status(200).json(docs)
        })
    } else if (!study && doctype) {
        collection.find({doctype:doctype,complete:true,expired:false}).then((docs) => {
            console.log(docs);
            res.status(200).json(docs)
        })
    } else if (study && !doctype) {
        if(!visit){
            collection.find({study:study,complete:true,expired:false}).then((docs) => {
                console.log(docs);
                res.status(200).json(docs)
            })
        } else if (!session) {
            collection.find({study:study,visit:visit,complete:true,expired:false}).then((docs) => {
                console.log(docs);
                res.status(200).json(docs)
            })
        } else {
            collection.find({study:study,visit:visit,session:session,complete:true,expired:false}).then((docs) => {
                console.log(docs);
                res.status(200).json(docs)
            })
        }
    } else if (study && doctype) {
        if(!visit){
            collection.find({study:study,doctype:doctype,complete:true,expired:false}).then((docs) => {
                console.log(docs);
                res.status(200).json(docs)
            })
        } else if (!session) {
            collection.find({study:study,visit:visit,doctype:doctype,complete:true,expired:false}).then((docs) => {
                console.log(docs);
                res.status(200).json(docs)
            })
        } else {
            collection.find({study:study,visit:visit,session:session,doctype:doctype,complete:true,expired:false}).then((docs) => {
                console.log(docs);
                res.status(200).json(docs)
            })
        }
    } else {
        console.log("nothing querried you fairy");
    }

    // collection.find({study:study,visit:visit,session:session,doctype:doctype}, 'study').then((docs) => {
    //     console.log(docs);
    //   // only the name field will be selected
    // })
})

app.get('/getTemp',function(req,res){
    var collection = db.get('fileuploads')

    collection.find({complete:false,expired:false}).then((docs) => {
        console.log(docs);
        res.status(200).json(docs)
    })
})

app.get('/file/:id', function (req, res) {
    // var root = process.cwd();
    var id = req.params.id;
    if (!id) {
        return res.status(500).send('no ID provided')
    } else {
        var collection = db.get('fileuploads')
        collection.find({_id:id,expired:false}).then((docs) => {
            var fileName = docs[0].filepath
            res.sendFile(fileName, function (err) {
                if (err) {
                    console.log(err)
                    return res.status(404).send(err);
                } else {
                    console.log('Sent:', fileName);
                }
            });
        })
    }
});
// ==================================================
// END [Querying Files]

// START [Edit file]
// ==================================================
app.get('/editUpload/:id', function (req, res) {
    // var root = process.cwd();
    var id = req.params.id;
    if (!id) {
        console.log("NO ID PROVIDED");
        // TODO switch response code for error
        return res.status(500).send('no ID provided')
    } else {
        var collection = db.get('fileuploads')
        collection.find({_id:id,expired:false}).then((docs) => {
            var docMetadata = docs[0]
            res.status(200).json(docMetadata)
        })
    }
});

app.post('/fileupload/:id', function (req, res) {
    // var root = process.cwd();
    var id = req.params.id;
    if (!id) {
        return res.status(500).send('no ID provided')
    } else {
        var collection = db.get('fileuploads')
        collection.update({_id:id,expired:false},{expired:true}).then((docs) => {
            if(err){
                console.log("hits err in DB update")
                return res.status(500).json(req.body);
            }
            else {
                console.log("hits pass in DB update")
                return res.status(200).json(req.body);
            }
        })
    }
});
// ==================================================
// END [Edit file]

// START [FOR DROPDOWNS]
// ==================================================
app.get('/getStudies', function(req,res){
    var collection = db.get('fileuploads');
    // collection.find({},)
    // collection.find({}, 'study').then((docs) => {
    //     console.log(docs);
    //   // only the name field will be selected
    // })
    collection.distinct('study').then((docs) => {
        console.log(docs);
        res.json(docs)
      // only the name field will be selected
    })
    // TODO THIS BELOW IS THE GOAL FOR BEN
    // api/users?id=4&token=sdfa3&geo=us
});

app.get('/getVisits', function(req,res){
    var collection = db.get('fileuploads')
    var study = req.query.study
    console.log(study);

    collection.distinct('visit',{study:study}).then((docs) => {
        console.log(docs);
        res.json(docs)
    })
})

app.get('/getSessions', function(req,res){
    var collection = db.get('fileuploads')
    var study = req.query.study
    var visit = req.query.visit
    console.log(study);
    console.log(visit);

    collection.distinct('session',{study:study,visit:visit}).then((docs) => {
        console.log(docs)
        res.json(docs)
    })
})
// ==================================================
// END [FOR DROPDOWNS]

// ==============================================================
// START [server instance]
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
