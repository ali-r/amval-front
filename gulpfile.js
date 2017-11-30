
var gulp = require('gulp'),
    inject = require('gulp-inject'),
    es = require('event-stream'),
    newer = require('gulp-newer'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
    minify = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    templateCache = require('gulp-angular-templatecache'),
    connect = require('gulp-connect');

var devMode = true;

var css = {
  in : {
    project : 'dist/css/*.css',
    vendors : 'vendors/**/*.css'
  },
  out : 'dist/css/build/'
},

js = {
  in : {
    config : 'config.js',
    vbase : 'vendors/base/**/*.js',
    plugins : 'vendors/plugins/**/*.js',
    custom : 'dist/js/*.js',
    app : 'dist/js/app/*.js',
    base : 'dist/js/app/base/*.js',
    controllers : 'dist/js/app/controllers/*.js'
  },
  out : 'dist/js/build'
},

fonts = {
  in : ['vendors/plugins/font-awesome/fonts/*.*','vendors/plugins/bootstrap/dist/fonts/*.*','dist/fonts/*.*'],
  out : 'dist/css/fonts'
};


function index(pathIn,fileName) {
  var target = gulp.src(pathIn + fileName),
      cssSources = gulp.src(
    [
      css.in.vendors,css.in.project
    ])
      jsSources = gulp.src(
    [
      js.in.vbase ,js.in.plugins ,js.in.custom,
      js.in.app ,js.in.base ,js.in.controllers
    ]);

    if (!devMode) {
      cssSources = cssSources
        .pipe(concat('main.css'))
        .pipe(minify())
        .pipe(gulp.dest(css.out));

      jsSources = jsSources
        .pipe(concat('main.js'))
        .pipe(uglify({ mangle: false }).on('error',gutil.log))
        .pipe(gulp.dest(js.out));
    }

  return target.pipe(inject(es.merge( cssSources,jsSources,gulp.src(js.in.config) )))
    .pipe(gulp.dest(pathIn));
}

gulp.task('copyFonts', function(){
  return gulp.src(fonts.in)
          .pipe(newer(fonts.out))
		      .pipe(gulp.dest(fonts.out));
});

gulp.task('templateCatch', function(){
  gulp.src('dist/templates/*.html')
    .pipe(templateCache('templates.js',{'module':'assetAdminPanel', 'root':'/dist/templates/'}))
    .pipe(gulp.dest('dist/js/app'));
    
  gulp.src('dist/js/app/directive/*.html')
    .pipe(templateCache('directiveTemplates.js',{'module':'assetAdminPanel', 'root':'/dist/js/app/directive/'}))
    .pipe(gulp.dest('dist/js/app'));
})

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

gulp.task('index',['copyFonts', 'templateCatch'] ,function(){
  return index('panel/','index.html') ,index('','index.html') ,index('','logout.html');
});

gulp.task('default', ['index','connect', 'watch'] ,function(){
});
