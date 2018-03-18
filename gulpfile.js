'use strict';

var gulp         = require('gulp'),
    gutil        = require('gulp-util'),
    sass         = require('gulp-sass'),
    sourcemaps   = require('gulp-sourcemaps'),
    bourbon      = require('node-bourbon').includePaths,
    neat         = require('node-neat').includePaths,
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS     = require('gulp-clean-css'),
    jshint       = require('gulp-jshint'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglify'),
    browserSync  = require('browser-sync');

// Live reload anytime a file changes
gulp.task('default', ['watch']);

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', ['browserSync', 'build-css', 'build-js'], function() {
  gulp.watch('src/scss/**/*.scss', ['build-css']);
  gulp.watch('src/js/**/*.js', ['build-js']);
  gulp.watch('dist/*.html').on('change', browserSync.reload);
});

// Compile SASS files
gulp.task('build-css', function() {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sourcemaps.init())  // Process the original sources
    .pipe(concat('styles.css'))
    .pipe(sass({
			  includePaths: bourbon,
			  includePaths: neat
      }))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write()) // Add the map to modified source.
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

// configure the build-js task
gulp.task('build-js', ['jshint'], function() {
  return gulp.src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
});

// configure the jshint task
gulp.task('jshint', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Spin up a server
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'dist'
    }
  })
});
