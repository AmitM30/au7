
const yargs     = require('yargs');
const gulp      = require('gulp');
const compass   = require('gulp-compass');
const cleanCSS  = require('gulp-clean-css');
const concat    = require('gulp-concat');
const uglify    = require('gulp-uglify');
const vulcanize = require('gulp-vulcanize');
const replace   = require('gulp-replace');
const using     = require('gulp-using');
const del       = require('del');
const vinylPaths  = require('vinyl-paths');
const runSequence = require('run-sequence');

const args      = require('./args');
const paths     = require('./paths');
const resources = require('./exports.js');

const getExportList = function () {
    return resources.list;
};

// deletes all files in the output path
gulp.task('clean', function () {
    return gulp.src([paths.exportSrv])
      .pipe(vinylPaths(del));
});

let copySingleFile = function (dir, dest) {
    return function() {
        return gulp.src(`${dir}`)
            .pipe(gulp.dest(`${dest}/`));
    };
};

let copyFiles = function (dir, dest) {
    return function() {
        return gulp.src(`${dir}/**/*`)
            .pipe(gulp.dest(`${dest}/`));
    };
};

gulp.task('move-components', copyFiles('src/components', paths.exportSrv + 'components'));
gulp.task('move-modules', copyFiles('src/modules', paths.exportSrv + 'modules'));
gulp.task('move-elements', copyFiles('shared/components', paths.exportSrv + 'elements'));
gulp.task('move-images', copyFiles('shared/images', paths.exportSrv + 'dist/images'));
gulp.task('move-ext-files', copyFiles('shared/source/ext', paths.exportSrv + 'dist/ext'));
gulp.task('move-app', copySingleFile('src/app.html', paths.exportSrv));
gulp.task('move-cordova', copySingleFile('src/cordova.js', paths.exportSrv));

gulp.task('copy', ['move-components', 'move-modules', 'move-ext-files', 'move-elements', 'move-images', 'move-app', 'move-cordova'], function () {
    // return gulp.src(getExportList(), { base: '*' })
    //   .pipe(gulp.dest(paths.exportSrv));
});

// build compass / sass files
gulp.task('compass', function () {
    return gulp.src(paths.root + args.site + '/' + paths.scss)
      .pipe(compass({
        config_file: 'config.rb',
        css: 'export/dist/styles',
        sass: paths.root + args.site + '/styles'
    }));
});

// create app-launch.js file - polyfill and webcomponents
gulp.task('build-app-load-file', function () {
    return gulp.src([paths.shared + 'source/ext/app-polyfills.js', paths.shared + 'source/ext/webcomponents-lite.js'])
        .pipe(concat('app-launch-v3.js'))
        // .pipe(uglify())
        .pipe(gulp.dest(paths.exportSrv + 'dist/'));
});

gulp.task('vulcanize-polymer-files', function () {
    // var exclude = ['bower_components/polymer/polymer.html', 'bower_components/promise-polyfill/promise-polyfill-lite.html'];
    return gulp.src([paths.bower + 'polymer/polymer.html'])
      .pipe(vulcanize({ stripComments: true }))
      .pipe(gulp.dest(paths.exportSrv + 'dist/'));
  });
  
gulp.task('vulcanize', function () {
    // let exclude = ['bower_components/polymer/polymer.html', 'bower_components/promise-polyfill/promise-polyfill-lite.html'];
    return gulp.src([paths.bower + 'polymer/polymer.html', paths.root + args.site + '/components/elements.html'])
        // .pipe(using({ prefix: 'elements:' }))
        .pipe(vulcanize({ stripComments: true, inlineScripts: true }))            // excludes: exclude, stripExcludes: exclude, 
        // .pipe(htmlmin({ collapseWhitespace: true, caseSensitive: true, keepClosingSlash: true, minifyCSS: true, minifyJS: true, removeAttributeQuotes: true, removeComments: true, sortAttributes: true, sortClassName: true }))
        .pipe(replace(/<\/?link(|\s+[^>]+)>/, ''))                                // Removes references to all external fonts / styles
        .pipe(gulp.dest(paths.exportSrv + 'dist/'));
});

var log = function () {
    console.log('---=========================================================---');
    console.log('---===                 Building \'' + args.site + '\'                    =---');
    console.log('---=========================================================---');
    console.log('---=== To build another site please provide the site name: =---');
    console.log('---=== $ gulp [build|export] --site=[small|large]          =---');
    console.log('---=========================================================---');
    Object.keys(args).map(function (key) {
      console.log('       @params --' + key + '=' + args[key] + '');
    });
    console.log('---=========================================================---');
};
  
gulp.task('build', function (callback) {
    log();
    return runSequence(
        'clean',
        ['build-app-load-file', 'vulcanize-polymer-files', 'vulcanize'],
        ['compass', 'copy'],
        callback
    )
});

gulp.task('export', ['build'], function (callback) {
    return gulp.src([paths.exportSrv + '**/*.*'])
      .pipe(gulp.dest(paths.www));
});
