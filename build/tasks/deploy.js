var gulp = require('gulp'),
    paths = require('../paths');

/*copy over CNAME file and deploy build folder*/
gulp.task('deploy', function () {
  gulp.src('src/CNAME')
    .pipe(gulp.dest(paths.output));
});