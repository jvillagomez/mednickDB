import xlrd
import requests
import json
import os

testdir = "E:\\Teledyne-20170718T011945Z-001\\Teledyne\\ScoreFiles"
doctype = {'doctype': 'screening'}

def parseJsonsfromFile(filepath):
    book = xlrd.open_workbook(filepath)
    screening_sheet = book.sheet_by_index(0)

    subjectIDs = screening_sheet.col_values(0)[1:]
    ages = screening_sheet.col_values(1)[1:]
    genders = screening_sheet.col_values(2)[1:]
    bmis = screening_sheet.col_values(3)[1:]
    ethnicities = screening_sheet.col_values(4)[1:]
    numOfSubjects = len(subjectIDs)

    screenings = []
    for i in range(numOfSubjects):
        json_object = {
            "subjectID": subjectIDs[i],
            "age": ages[i],
            "gender": genders[i],
            "bmi": bmis[i],
            "ethnicity": ethnicities[i]
        }
        screenings.append(json_object)

    return screenings

def getAllCompleteFileRecords():
    response = requests.get("http://127.0.0.1:8001/files/", params=doctype)

    records = response.json()
    filesToParse = []
    for record in records:
        if 'parsed' not in record.keys():
            filesToParse.append(record)

    return filesToParse

def parseAndUpdateDocument(_file):
    parsedObjects = parseJsonsfromFile(_file['path'])

    for jsonObject in parsedObjects:
        jsonObject['study']=_file['study']
        jsonObject['visit']=_file['visit']
        jsonObject['session']=_file['session']
        jsonObject['sourceID']=_file['_id']

        insertScreeningRequest = requests.post("http://127.0.0.1:8001/screenings/", data = jsonObject)

    updateFileUploadRequest = requests.post("http://127.0.0.1:8001/update/", data = {'id':_file['_id']})
    print(_file['path'],updateFileUploadRequest.status_code)

def main():
    filesToParse = getAllCompleteFileRecords()
    for _file in filesToParse:
        parseAndUpdateDocument(_file)

    return "Finished Parsing Documents"

if __name__ == "__main__":
    main()
