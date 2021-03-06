var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync	= require('browser-sync'),
    runSequence = require('run-sequence'),
    nunjucksRender = require('gulp-nunjucks-render'),
    paths = require('../paths'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    glob = require('glob'),
    rename = require('gulp-rename'),
    es = require('event-stream'),
    concat = require('gulp-concat');

// compiles nunjucks
gulp.task('build-html', function () { 
  //add cname
  return gulp.src(paths.html) 
    .pipe(nunjucksRender({
      path: ['src']
      })) 
    .pipe(gulp.dest(paths.output));
});

gulp.task('build-img', function(){
  return gulp.src(paths.img)
    .pipe(gulp.dest(paths.output));
});

gulp.task('build-video', function(){
  return gulp.src(paths.video)
    .pipe(gulp.dest(paths.output));
});

gulp.task('build-pdf', function(){
  return gulp.src(paths.pdf)
    .pipe(gulp.dest(paths.output));
});

// transpiles changed es6 files to SystemJS format
// the plumber() call prevents 'pipe breaking' caused
// by errors from other gulp plugins
gulp.task('build-js', function(done){
  glob(paths.js, function(err, files) {
        if(err) done(err);
        var tasks = files.map(function(entry) {
            return browserify({ entries: [entry] })
                .bundle()
                .pipe(source(entry))
                .pipe(rename(function(path){
                  path.dirname = "";
                }))
                .pipe(gulp.dest(paths.output));
            });

        es.merge(tasks).on('end', done);
    });

});

gulp.task('build-css', function() {
  //copy font files
  gulp.src(["node_modules/font-awesome/fonts/**/*"])
    .pipe(gulp.dest(paths.output + "fonts/"));
    
  return gulp.src(paths.sass)
    .pipe(sass({
    		outputStyle: 'compressed'
		}).on('error', sass.logError))
    .pipe(concat('main.css'))
    .pipe(gulp.dest(paths.output))
    .pipe(browserSync.stream());
});

gulp.task('build', function(callback) { 
  return runSequence(
    'clean',
    ['build-html', 'build-img', 'build-js', 'build-css', 'build-video', 'build-pdf'],
    callback
  );
});
