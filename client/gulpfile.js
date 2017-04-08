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
//****** Run python server ******//
//*******************************//

// //pip install django--1.9.11
// gulp.task('python:makevenv', function() {
//     //virtualenv venv
//
// })

// gulp.task('python:runvenv', function() {
//     //venv\scripts\activate
//     console.info('Running virtual environment');
//     return run('start cmd /K ..\\venv\\Scripts\\activate ').exec();
// })

// gulp.task('python:makemigrations', function() {
//     var spawn = process.spawn;
//     console.info('Making migration');
//     var PIPE = { stdio: 'inherit' };
//     spawn('python', ['server/manage.py', 'makemigrations', 'cabinet'], PIPE);
// })

// gulp.task('python:migrate', ['python:makemigrations'], function() {
//     var spawn = process.spawn;
//     console.info('Starting django migration');
//     var PIPE = { stdio: 'inherit' };
//     spawn('python', ['server/manage.py', 'migrate'], PIPE);
// })
//
// gulp.task('python:runserver', function() {
//     console.log("Starting pythong server...");
//     return run('start cmd /K python server/manage.py runserver').exec();
// })

//**************************//
//****** Serve app *********//
//**************************//
//
var server = {
    host: 'localhost',
    port: '8001'
}
//
// gulp.task('webserver', ['python:runserver'], function() {
//     gulp.src('.')
//         .pipe(webserver({
//             host: server.host,
//             port: server.port,
//             livereload: true,
//             directoryListing: false
//         }));
// });

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
