from pymongo import MongoClient

client = MongoClient("mongodb://user1:Pass1234@ds123312.mlab.com:23312/mednick")
db = client.mednick

result = db.fileUploads.delete_many({})
print(result.deleted_count)
