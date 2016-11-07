var gulp = require('gulp');
var clean = require('gulp-clean');
var install = require('gulp-install');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');

gulp.task('build', ['clean', 'copy', 'install', 'useref'])

gulp.task('clean', function() {
  return gulp.src('./dist')
    .pipe(clean());
});

gulp.task('copy', ['clean'], function() {
  return gulp.src(['./src/**/*.html', '!./src/index.html', '!./src/bower_components/', '!./src/bower_components/**'])
    .pipe(gulp.dest('./dist'));
});

gulp.task('install', ['clean'], function() {
  return gulp.src(['./bower.json'])
    .pipe(install());
});

gulp.task('useref', ['clean'], function() {
  return gulp.src('./src/index.html')
    .pipe(useref())
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulp.dest('dist'));
});