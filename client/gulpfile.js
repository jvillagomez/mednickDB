var gulp = require('gulp');
var sass = require('gulp-sass');
var mainBowerFiles = require('main-bower-files');
var del = require('del');
var webserver = require('gulp-webserver');
var open = require('opn');
var inject = require('gulp-inject');
var run = require('gulp-run');
var process = require('child_process');


//******* Manage Bower packages ********//
gulp.task('bower:cleanout', function() {
    del([
            'assets/libs/bower_components/**',
            '!assets/libs/bower_components'
        ])
        .then(function() {
            console.log('Cleaned "bower_components"');
        });
})

gulp.task('bower:copy', ['bower:cleanout'], function() {
    gulp.src(mainBowerFiles())
        .pipe(gulp.dest('assets/libs/bower_components'));
    console.log('Bower files copied')
})

gulp.task('bower:inject', function() {
    var target = gulp.src('index.html');
    // It's not necessary to read the files (will speed up things), we're only after their paths:
    var sources = gulp.src(
        [
            'assets/libs/bower_components/*.{js,css}'
        ], { read: false });

    return target
        .pipe(inject(sources))
        .pipe(gulp.dest('.'));

    console.log('Bower dependencies injected.')
})

gulp.task('bower', ['bower:copy'], function() {
    console.log('Bower files synced');
})

//*******************************//
//****** Run Express server ******//
//*******************************//

gulp.task('serveMongo', function() {
    console.log("Starting Mongo DB...");
    run('start cmd /K mongod').exec();
    return console.log('MongoDB is online')
})

gulp.task('serveExpress', function() {
    console.log("Starting Express server...");
    run('start cmd /K node ../server/server.js').exec();
    // run('start cmd /K cd ../server/mongod').exec();
    return console.log('API is online')
})

//**************************//
//****** Serve app *********//
//**************************//
//
var server = {
    host: 'localhost',
    port: '8000'
}

gulp.task('webserver', ['serveExpress'], function() {
    gulp.src('.')
        .pipe(webserver({
            host: server.host,
            port: server.port,
            livereload: true,
            directoryListing: false
        }));
});

gulp.task('openbrowser', ['webserver'], function() {
    open('http://' + server.host + ':' + server.port);
});

gulp.task('serve', ['openbrowser'], function() {
    console.log("Serving app...");
});

//******* Sass ******************//
gulp.task('sass', function() {
    gulp.src('assets/styles/scss/site.scss')
        .pipe(sass())
        .pipe(gulp.dest('assets/styles'))
});

//****** Build script **********//
gulp.task('build:inject', function() {
    var gulpSrc = ['app/**/*.js', 'app/*.js'];

    return gulp.src('index.html')
        .pipe(inject(gulp.src(gulpSrc, { read: false }), { starttag: '<!-- inject:appfiles:{{ext}} -->' }))
        .pipe(gulp.dest('.'));

    console.log('Project files injected.')
});
