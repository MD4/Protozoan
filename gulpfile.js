var gulp = require('gulp');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');

var browserify = require('browserify');
var tsify = require('tsify');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

gulp.task('build', function () {
    var bundler = browserify({
        basedir: '.',
        module: 'amd'
    })
        .add('src/protozoan.ts')
        .plugin(tsify);

    return bundler
        .bundle()
        .pipe(source('protozoan.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});


gulp.task('default', function () {
    return gulp.watch('src/**/*.ts', ['build']);
});