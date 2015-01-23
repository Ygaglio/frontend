//REQUIRE
var gulp = require('gulp'),
    minifyCss = require('gulp-minify-css'),
$ = require('gulp-load-plugins')();

var jsFilter = $.filter('**/*.js');
var cssFilter = $.filter('**/*.css');

//CONFIGURATION
 var path = {
     css : "css/",
     scss : "css/",
     img: "img/",
     js : "js/"
 };

//TASKS
gulp.task('coffee', function(){
    return gulp.src('js/*.coffee')
        .pipe($.plumber())
        .pipe($.coffee({
            bare: true
        }))
        .pipe(gulp.dest("js"))
        .pipe($.livereload());
});

gulp.task('sass', function(){
    return gulp.src("css/*.scss")
        .pipe($.plumber())
        .pipe($.sass({errLogToConsole: true}))
        .pipe($.autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest("css"))
        .pipe($.livereload());
});

gulp.task('sprite', function() {
    var sprite = gulp.src('img/icons/*.png')
        .pipe($.spritesmith({
            imgName: "sprite.png",
            cssName: "_sprite.scss",
            cssTemplate: "css/tools/_sprite.scss.mustache"
        }))

    sprite.img.pipe(gulp.dest('img/'));
    sprite.css.pipe(gulp.dest('css/tools/'));
});

//permet de supprimer le dossier final
gulp.task('clean', ['clean'],  function(){
    return gulp.src('dist',{read: false}).pipe($.clean());
});

gulp.task('img',function(){
    gulp.src("{path.img}*.*")
        .pipe($.imagemin())
        .pipe(gulp.dest('dist/img'));
});

gulp.task('dist',['coffee', 'sass','img'], function(){

    gulp.src('*.html')
        .pipe($.useref.assets())
        .pipe(jsFilter)
        .pipe($.uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe(minifyCss())
        .pipe(cssFilter.restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist'));

});

gulp.task('default', ['dist'], function(){
   return  gulp.src('dist/**/*')
        .pipe($.zip('dist.zip'))
        .pipe(gulp.dest('.'));
});

gulp.task('watch', function(){
    $.livereload.listen();
    gulp.watch('js/*.coffee', ['coffee']);
    gulp.watch('css/*.scss', ['sass']);
});