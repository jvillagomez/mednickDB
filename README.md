# Mednick DB

<p>
    Application is to house all mednick lab files. Files are systematically stored according to their metadata, to allow for easy indexing. With researchers requiring access to the data within the files, scripts housed on server read/parse data and store it in DB. Files and data may be accessed through endpoints using the included angular client, or through any method allowing HTTP requests (i.e Python, MATLAB).
</p>
<p>
    Endpoints allow for file uploads, querries, updates, deletions, and more. Users may also use endpoints to insert data without files, but data insertion is primarily done my python microservices. All file, data manipulations must be done through endpoints, to allow API to log all activity and avoid corruption.
</p>
<p>
    Admins will be able to insert files directly into filesystem (i.e using FTP), outside of the API. A microservice periodically scans the filestem for these new files and automatically logs them in API.
</p>

<ul>
    <li>Files are classified as two main types: Survey, Task.</li>
    <li>A single survey file includes demographic, screening data for multiple study participants.</li>
    <li>Each task file contains recorded data for a single participant.</li>
    <li>Participant Survey Data and Participant Task Data will have a 1-to-1 relationship.</li>
</ul>

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

Project should be run using a 64-bit system.

### Prerequisites

You must have the following installed, before you can run an instance of the project.
This guide assumes you already have GIT installed on your computer.

<b>Install Node.JS</b>
```
https://nodejs.org/
```
<b>Install Python 3</b>
```
https://www.python.org/downloads
```

### Installing

How to get a development env running. The following instructions can also be used for deployment on a production server. Deployment for a production server would require further configurations, prior to the steps below.

<b>Create a local directory that will house the project.</b>
```
md "c:\source\Path\To\Project\Folder"
```
<b>Initailize an empty local repo</b>
```
git init
```
<b>Clone the latest commit on GitHub</b>
```
git clone "https://github.com/MednickLab/mednickDB.git"
```
<b>Set server folder as CWD</b>
```
cd "ProjectRoot\server"
```
<b>Install Node project dependencies using NPM</b>
```
npm install
```
<b>Set client folder as CWD</b>
```
cd "..\client"
```
<b>Install Angular.JS client dependencies using NPM (Optional)</b>
```
npm install
```
<b>Install grunt task manager globally (Optional)</b>
```
npm install -g grunt-cli
```
<b>Run Node.JS server</b>
```
cd "..\server"
npm start
```
<b>Run Angular.JS client (Optional)</b>
```
cd "..\client"
grunt serve
```

You're application is now running on localhost! For information regarding use and supported API calls, please see the <a href="https://mednicklab.github.io/mednickDB/">documentation</a> at https://mednicklab.github.io/mednickDB/.

## Testing our server endpoints

Explain how to run the automated tests for this system

### Using Postman App

Download the Postman tool at https://www.getpostman.com/.
<br>
See details docs on sending requests using Postman at https://www.getpostman.com/docs/postman/launching_postman/sending_the_first_request.

### Using Curl

Currently, no authentication is required.
Exmaple call (your may have a different port number)
```
curl http://localhost:8000/getStudies
```
Should return a json object with seevral study names.

## Deployment

Deployment docs will be provided for Ubuntu Server 16.04 LTS.

## Built With
Frameworks:
* [Node.js](https://nodejs.org/en/) - JavaScript runtime, using an event-driven, non-blocking I/O model.
* [Angular](https://angularjs.org/) - AngularJS is a front-end framework for dynamic web apps.
* [Express.js](https://maven.apache.org/) - The de facto standard server framework for Node.js.

<!-- ## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us. -->

<!-- ## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). -->

## Authors
* **Ben Yetton** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)
* **Hayden Baker** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)
* **Jesse** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)
* **Juan Antonio** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)
* **Kevin Yen** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)
* **Nelly** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)
* **Sehoon** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/MednickLab/mednickDB/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Stack Overflow
* No seriously, Stack Overflow
