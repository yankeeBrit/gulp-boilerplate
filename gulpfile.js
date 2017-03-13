/* File: gulpfile.js */

// grab our packages
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync');

// define the default task and add the watch task to it
gulp.task('default', ['watch']);

// configure the build-css task
gulp.task('build-css', function() {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sourcemaps.init())  // Process the original sources
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(sourcemaps.write()) // Add the map to modified source.
    .pipe(gulp.dest('dist/css'));
});

// configure the jshint task
gulp.task('jshint', ['build-js'], function() {
  return gulp.src('src/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// configure the build-js task
gulp.task('build-js', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    //only uglify if gulp is ran with '--type production'
    .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop()) 
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js'));
});

// Spin up a server
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'dist'
    }
  })
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', ['browserSync', 'build-css', 'jshint'], function() {
  gulp.watch('src/scss/**/*.scss', ['build-css']);
  gulp.watch('src/js/**/*.js', ['jshint']);
  gulp.watch('dist/*.html').on('change', browserSync.reload);
});