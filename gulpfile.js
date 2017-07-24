var gulp         = require('gulp'),
    rename         = require('gulp-rename'),    
    minHtml        = require('gulp-htmlmin'),    
    minCss         = require('gulp-minify-css'),
    minJs         = require('gulp-uglify'),
    browserSync    = require('browser-sync').create(),    //实时刷新浏览器
    reload         = browserSync.reload,
    concat         = require('gulp-concat');
var rev = require('gulp-rev');                                  //- 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector');  





gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./AltUserCenter/src"
        }
    });
    gulp.watch('./AltUserCenter/src/**/*.*',browserSync.reload)
});
gulp.task('default',['browser-sync'])









gulp.task('html', function(){
    var options = {
        collapseWhitespace:true,
        collapseBooleanAttributes:true,
        removeComments:true,
        removeEmptyAttributes:true,
        removeScriptTypeAttributes:true,
        removeStyleLinkTypeAttributes:true,
        minifyJS:true,
        minifyCSS:true
    };
    return gulp.src('ionicZuqiu/templates/*.html').
    pipe(minHtml(options))
    .pipe(gulp.dest('./dist'))
});
gulp.task('css', function(){
    return gulp.src('ionicZuqiu/css/*.css')
//  .pipe(concat('all.css'))
    .pipe(minCss())
//  .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/css'))
});
gulp.task('js', function(){
//  return gulp.src(['src/js/medium-editor.js','src/js/index.js'])
    return gulp.src(['ionicZuqiu/js/*.js','ionicZuqiu/js/**/*.js'])
    .pipe(minJs())
//  .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/js'))
});
gulp.task('build',['css','js','html'])
//gulp.task('rev',['rev'])
