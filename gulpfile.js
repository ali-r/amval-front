
var gulp = require('gulp'),
    inject = require('gulp-inject'),
    es = require('event-stream'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect');

var css = {
  in : {
    vendors : 'vendors/**/*.css',
    project : 'dist/css/*.css'
  },
  out : 'dist/css/build/'
},

js = {
  in : {
    config : 'config.js',
    vbase : 'vendors/base/**/*.js',
    plugins : 'vendors/plugins/**/*.js',
    custom : 'dist/js/*.js',
    app : 'dist/js/app/app.js',
    base : 'dist/js/app/base/*.js',
    controllers : 'dist/js/app/controllers/*.js'
  },
  out : 'dist/js/build'
};


function index(pathIn,fileName) {
  var target = gulp.src(pathIn + fileName),
      cssSources = gulp.src(
    [
      css.in.vendors,css.in.project
    ], {read: false})
      jsSources = gulp.src(
    [
      js.in.config ,js.in.vbase ,js.in.plugins ,js.in.custom,
      js.in.app ,js.in.base ,js.in.controllers
    ], {read: false});

  /*cssSources = cssSources
    .pipe(concat('main.css'))
    .pipe(gulp.dest(css.out));*/

  return target.pipe(inject(es.merge(cssSources,jsSources)))
    .pipe(gulp.dest(pathIn));
}

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
  return index('panel/','index.html'),index('','index.html');
});

gulp.task('default', ['connect', 'watch']);
