---
title: gulp初级教程
date: 2015-03-01 11:05:04
tags:
- gulp


---

我的gulp学习笔记及总结
<!-- more -->



## 本文略有过时,建议阅读: 
## [https://github.com/Platform-CUF/use-gulp](https://github.com/Platform-CUF/use-gulp)
## [https://github.com/lisposter/gulp-docs-zh-cn](https://github.com/lisposter/gulp-docs-zh-cn)

# 入门图表
[github_gulp-cheatsheet](https://github.com/osscafe/gulp-cheatsheet)
> 中文版直接下载地址: [`pdf1`](https://github.com/osscafe/gulp-cheetsheet/raw/master/dist/cn-js-p1.pdf) [`pdf2`](https://github.com/osscafe/gulp-cheetsheet/raw/master/dist/cn-js-p2.pdf)

# 一些gulp api

`gulp.src(globs[, options])`
> 根据globs提供的文件列表,得到一个stream,按照管道模式给其它插件处理

`gulp.dest(path[, options])`
> 将管道中的数据写入到文件夹。

`gulp.task(name[, deps], fn)`
```js
gulp.task('taskname', ['task1', 'task2'], function() {
  // Do stuff
});


//命令工具输入 gulp是执行 default任务
// Default task
gulp.task('default', ['首先执行的任务(可选)'], function() {
    gulp.start(['taskname', 'taskname2']); //开始并行执行任务呀
});

```
> 定义任务. *deps 是任务数组,在执行本任务时数组中的任务要执行并完成*

`gulp.watch(glob [, opts], tasks)`
`gulp.watch(glob [, opts, cb])`
> 监控文件.当监控的文件有所改变时执行特定的任务.

```js
// Watch
gulp.task('watch', function() {
    // Watch .scss files
    gulp.watch('css/**/*', ['css']);
    // Watch .js files
    gulp.watch('js/**/*.js', ['js']);
    // Create LiveReload server
    livereload.listen();
    // Watch any files in dist/, reload on change
    gulp.watch(['public/**']).on('change', livereload.changed);
});
```

# 一些插件

- [官方英文文档](https://github.com/gulpjs/gulp/tree/master/docs/recipes#recipes)
- `gulp-browserify`
> browserify可以为浏览器编译node风格的遵循commonjs的模块。 它搜索文件中的require()调用， 递归的建立模块依赖图。

```js
var gulp = require('gulp');
var browserify = require('gulp-browserify');
// Basic usage
gulp.task('scripts', function() {
    // Single entry point to browserify
    gulp.src('src/js/app.js')
        .pipe(browserify({
          insertGlobals : true,
          debug : !gulp.env.production
        }))
        .pipe(gulp.dest('./build/js'))
});
```
- `gulp-jshint`
> gulp的jshint插件

```js
var jshint = require('gulp-jshint');
var gulp   = require('gulp');
gulp.task('lint', function() {
  return gulp.src('./lib/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('YOUR_REPORTER_HERE'));
});
```

- `gulp-imagemin`
> 压缩图片的工具

```js
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
gulp.task('default', function () {
    return gulp.src('src/images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist'));
});
```

- `glup-sass`

```js
var gulp = require('gulp');
var sass = require('gulp-sass');
gulp.task('sass', function () {
    gulp.src('./scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'));
});
```

- `browser-sync`
> BrowserSync 是一个自动化测试辅助工具,可以帮你在网页文件变更时自动载入新的网页

```js
var gulp = require('gulp');
var browserSync = require('browser-sync');
// Static server
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./"
        }
    });
});
// or...
gulp.task('browser-sync', function() {
    browserSync({
        proxy: "yourlocal.dev"
    });
});
```

- `proxy-middleware`
> 作为http proxy,转发特定的请求

- `gulp-usemin`
> 用来将HTML 文件中（或者templates/views）中没有优化的script 和stylesheets 替换为优化过的版本

```js
//html
<!-- build:<pipelineId>(alternate search path) <path> -->
... HTML Markup, list of script / link tags.
<!-- endbuild -->

<!-- build:css css/user.css -->
<link rel="stylesheet" href="css/style.css">
<!-- endbuild -->

<!-- build:js js/user.js -->
<script src="js/ajax.js"></script>
<!-- endbuild -->
```
```js
// gulpfile.js
var rev = require('gulp-rev');
var usemin = require('gulp-usemin');
gulp.task('usemin', function() {
    return gulp.src('index.html')
        .pipe(
            usemin({
                //rev() 文件带hash  'concat' 文件没有hash
                css: [minifycss(), 'concat'],
                html: [minifyhtml({
                    empty: true
                })],
                js: [uglify(), rev()]
            })
        )
        .pipe(
            gulp.dest('public/')
        );
});
```

- `gulp-uglify`
> javascript代码优化工具，可以解析，压缩和美化javascript

```js
var uglify = require('gulp-uglify');
gulp.task('compress', function() {
  gulp.src('lib/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
});
```

- `gulp-inject`
> 可以注入css,javascript和web组件,不需手工更新ndex.html

```js
<!DOCTYPE html>
<html>
<head>
  <title>My index</title>
  <!-- inject:css -->
  <!-- endinject -->
</head>
<body>
  <!-- inject:js -->
  <!-- endinject -->
</body>
</html>
```
```js
// gulpfile.js
var gulp = require('gulp');
var inject = require("gulp-inject");
gulp.task('index', function () {
  var target = gulp.src('./src/index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths:
  var sources = gulp.src(['./src/**/*.js', './src/**/*.css'], {read: false});
  return target.pipe(inject(sources))
    .pipe(gulp.dest('./src'));
});
```

- `gulp-rename`
> 改变管道中的文件名

```js
var rename = require("gulp-rename");
// rename via string
gulp.src("./src/main/text/hello.txt")
    .pipe(rename("main/text/ciao/goodbye.md"))
    .pipe(gulp.dest("./dist")); // ./dist/main/text/ciao/goodbye.md
// rename via function
gulp.src("./src/**/hello.txt")
    .pipe(rename(function (path) {
        path.dirname += "/ciao";
        path.basename += "-goodbye";
        path.extname = ".md"
    }))
    .pipe(gulp.dest("./dist")); // ./dist/main/text/ciao/hello-goodbye.md
// rename via hash
gulp.src("./src/main/text/hello.txt", { base: process.cwd() })
    .pipe(rename({
        dirname: "main/text/ciao",
        basename: "aloha",
        prefix: "bonjour-",
        suffix: "-hola",
        extname: ".md"
    }))
    .pipe(gulp.dest("./dist")); // ./dist/main/text/ciao/bonjour-aloha-hola.md
```

- `gulp-clean`
> 提供clean功能

```js
var gulp = require('gulp');  
var clean = require('gulp-clean');
gulp.task('clean', function () {  
  return gulp.src('build', {read: false})
    .pipe(clean());
});
```

- `gulp-concat`
> 连接合并文件

```js
var concat = require('gulp-concat');
gulp.task('scripts', function() {
  gulp.src('./lib/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./dist/'))
});
```

# 一个完整的gulpfile

```js
/*!
 * gulp
 * $ npm install gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
 */
 
// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');
 
// Styles
gulp.task('styles', function() {
  return gulp.src('src/styles/main.scss')
    .pipe(sass({ style: 'expanded', }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles'))
    .pipe(notify({ message: 'Styles task complete' }));
});
 
// Scripts
gulp.task('scripts', function() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'))
    .pipe(notify({ message: 'Scripts task complete' }));
});
 
// Images
gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images'))
    .pipe(notify({ message: 'Images task complete' }));
});
 
// Clean
gulp.task('clean', function(cb) {
    del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img'], cb)
});
 
// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images');
});
 
// Watch
gulp.task('watch', function() {
 
  // Watch .scss files
  gulp.watch('src/styles/**/*.scss', ['styles']);
 
  // Watch .js files
  gulp.watch('src/scripts/**/*.js', ['scripts']);
 
  // Watch image files
  gulp.watch('src/images/**/*', ['images']);
 
  // Create LiveReload server
  livereload.listen();
 
  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', livereload.changed);
 
});
```

# 参考文档
[gulp-plugins-introduction/](http://colobu.com/2014/11/17/gulp-plugins-introduction/)
[grunt与gulp比较](https://gist.github.com/markgoodyear/8497946#file-gulpfile-js)

