import sys
import pymongo

mlab_url =  'mongodb://user1:Pass1234@ds123312.mlab.com:23312/mednick'

client = pymongo.MongoClient(mlab_url)
db = client.get_default_database()
fileUploads = db['fileUploads']

studies = [
    'KS_night',
    'SF_2014',
    'Cellini',
    'MASS',
    'Teledyne',
    'SHHS',
    'MROS',
    'CFS'
]

visits = [
    'v0',
    'v1',
    'v2',
    # 'v3',
    ''
]

sessions = [
    's1',
    's2',
    ''
]

filetypes = [
    'sleepScore',
    'psg',
    'screening',
    'diary',
    'memoryTest',
    'languageAptitude',
    ''
]

records = []

for study in studies:
    screened = 0
    for visit in visits:
        for session in sessions:
            for filetype in filetypes:
                for i in range(21):
                    fileName = '_'.join([study, str(i), visit, session]) if filetype!='screening' else '_'.join([study, filetype])
                    fileSubject = '_'.join([study, str(i)]) if filetype!="screening" else "many"


                    complete = '0' if (study=='' or visit=='' or session=='' or filetype=='') else '1'
                    expired = '1' if visit=='v0' else '0'

                    filePath = '\\'.join([study, visit, session, filetype, fileSubject, fileName]) if filetype != "screening" else '\\'.join([study, visit, session, filetype, fileName])
                    if complete=='0':
                        filePath= '\\'.join(['temp',fileName])

                    if filetype=="screening" and screened>0:
                        continue

                    if filetype=="screening":
                        screened +=1



                    fileUpload = {
                        'fileName': '',
                        'fileStudy': '',
                        'fileVisit': '',
                        'fileSession': '',
                        'fileType': '',
                        'fileSubject': '',
                        'filePath': '',
                        'complete': '',
                        'expired': ''
                    }

                    fileUpload['fileName'] = fileName
                    fileUpload['fileStudy'] = study
                    fileUpload['fileVisit'] = visit
                    fileUpload['fileSession'] = session
                    fileUpload['fileType'] = filetype
                    fileUpload['fileSubject'] = fileSubject
                    fileUpload['filePath'] = filePath
                    fileUpload['complete'] = complete
                    fileUpload['expired'] = expired


                    print(fileUpload)
                    fileUploads.insert(fileUpload)





















