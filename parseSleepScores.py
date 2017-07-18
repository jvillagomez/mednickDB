import xlrd
import requests
import json
import os



testdir = "E:\\Teledyne-20170718T011945Z-001\\Teledyne\\ScoreFiles"
doctype = {'doctype': 'sleepScore'}

# { a : { $exists : false } }

# def adjustDocumentInMongo():

def parseJsonfromFile(filepath):
    book = xlrd.open_workbook(filepath)

    report_sheet = book.sheet_by_name('Report')
    subjectID = (report_sheet.cell(1,1)).value
    startTime = (report_sheet.cell(16,2)).value
    scoringDate = (report_sheet.cell(9,2)).value

    # ======SLEEP SCORING===========================================================================================
    scoringSheet = book.sheet_by_name('GraphData')

    stages_col = scoringSheet.col_values(1)[1:]
    stages = [int(i) for i in stages_col if i != 42]

    numOfStages = len(stages)

    times_col = scoringSheet.col_values(30)[1:(numOfStages+1)]
    times = [round(i,2) for i in times_col]


    json_object = {
        "subjectID":subjectID,
        "scoringDate":scoringDate,
        "startTime":startTime,
        "sleepStages": stages,
        "sleepTimes": times
    }

    return json_object

def getAllCompleteFileRecords():
    response = requests.get("http://127.0.0.1:8001/files/", params=doctype)

    records = response.json()
    filesToParse = []
    for record in records:
        if 'parsed' not in record.keys():
            filesToParse.append(record)

    return filesToParse

# def InsertNewFile(_file):
#     filename = os.path.basename(_file)
#     path = _file
#     expired = 0
#     complete = 0
#
#     request = requests.post("http://127.0.0.1:8001/files/temp/new/", data = {'filename':filename,'path':path,'expired':expired,'complete':complete})
#     print (request)
#     return request

def parseAndUpdateDocument(_file):
    jsonObject = parseJsonfromFile(_file['path'])
    jsonObject['study']=_file['study']
    jsonObject['visit']=_file['visit']
    jsonObject['session']=_file['session']
    jsonObject['sourceID']=_file['_id']

    insertSleepScoreRequest = requests.post("http://127.0.0.1:8001/insert/sleepScoring/", data = jsonObject)
    updateFileUploadRequest = requests.post("http://127.0.0.1:8001/update/", data = {'id':_file['_id']})
    print(_file['path'],insertSleepScoreRequest.status_code,updateFileUploadRequest.status_code)


def main():
    filesToParse = getAllCompleteFileRecords()
    for _file in filesToParse:
        parseAndUpdateDocument(_file)

    return "Finished Parsing Documents"


if __name__ == "__main__":
    main()









# _files = [i["path"] for i in filesToParse]
