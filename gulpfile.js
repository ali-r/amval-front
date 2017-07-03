
var gulp = require('gulp'),
    inject = require('gulp-inject'),
    connect = require('gulp-connect');

gulp.task('connect', function() {
  connect.server({
    livereload: true,
    port: 8800
  });
});

gulp.task('html', function () {
  gulp.src('dist/templates/*.html')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['dist/templates/*.html'], ['html']);
});

gulp.task('index',function(){

});

gulp.task('default', ['connect', 'watch']);
