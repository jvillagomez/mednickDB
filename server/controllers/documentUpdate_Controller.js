function updateParsedDocument(res,id,db) {
    db.collection(FILEUPLOADS_COLLECTION).updateOne(
       { _id: ObjectId(id) },
       {
         $set: { "parsed": "1"},
         $currentDate: { lastModified: true }
     },
     function(err,doc){
         if(err){
             res.status(code || 500).json({"error": message});
         }
         else {
             res.status(201).json(doc);
         }
     });
};
