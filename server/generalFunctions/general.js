module.exports = {
  handleError: function (res, error) {
      console.log("ERROR: " + error);
      res.status(500).json({"error": error});
  },
  insertDocument: function (res,collection_name,data) {
      data.dateUploaded = Date.now();
      db.collection(collection_name).insert(data, function (err,doc){
          if(err){
              handleError(res,err);
          }
          else {
              res.status(201).json(doc);
          }
      });
  }
};
