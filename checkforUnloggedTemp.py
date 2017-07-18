import xlrd
import requests
import json
import os

testdir = "E:\\Teledyne-20170718T011945Z-001\\Teledyne\\ScoreFiles"
_path = "E:\\Teledyne-20170718T011945Z-001\\Teledyne\\ScoreFiles\\RR-002_2_nap2-scoringEDF.xlsx"

def parseSleepScoreFile(filepath):
    book = xlrd.open_workbook(filepath)

    report_sheet = book.sheet_by_name('Report')
    subjectID = (report_sheet.cell(1,1)).value
    startTime = (report_sheet.cell(16,2)).value
    scoringDate = (report_sheet.cell(9,2)).value

    print(subjectID)
    print(startTime)
    print(scoringDate)

    # ======SLEEP SCORING===========================================================================================
    scoringSheet = book.sheet_by_name('GraphData')

    stages_col = scoringSheet.col_values(1)[1:]
    stages = [i for i in stages_col if i != 42]

    numOfStages = len(stages)

    times_col = scoringSheet.col_values(30)[1:(numOfStages+1)]
    times = times_col

    print(stages)
    print(times)

    json_object = {
        "subjectID":subjectID,
        "scoringDate":scoringDate,
        "startTime":startTime,
        "sleepStages": stages,
        "sleepTimes": times
    }

    return json_object

def getAllFilesInTree(dirPath):
    print("hitting")
    _files = []
    for folder, subfolders, files in os.walk(dirPath):
        for _file in files:
            filePath = os.path.join(os.path.abspath(folder), _file)
            _files.append(filePath)
    print(filePath)
    return _files


    getAllFilesInTree("E:\\Teledyne-20170718T011945Z-001\\Teledyne\\ScoreFiles")

def getAllTempFileRecords():
    response = requests.get("http://127.0.0.1:8001/files/temp/")
    records = response.json()
    _files = [i["path"] for i in records]
    print (_files)
    return _files

def checkTempForUnlogged(tempDir):
    tempInDB = getAllTempFileRecords()
    tempInFolder = getAllFilesInTree(tempDir)
    unloggedFiles =[_file for _file in tempInFolder if _file not in tempInDB]

    return unloggedFiles

def logNewFile(_file):
    filename = os.path.basename(_file)
    path = _file
    expired = 0
    complete = 0

    request = requests.post("http://127.0.0.1:8001/files/temp/new/", data = {'filename':filename,'path':path,'expired':expired,'complete':complete})
    print (request)
    return request


def main():
    filesToLog = checkTempForUnlogged(testdir)
    if not filesToLog:

        return "Nothing to Log"
    for _file in filesToLog:
        print(_file)
        logNewFile(_file)

    return "Output this to txt file for reporting"


if __name__ == "__main__":
    main()
