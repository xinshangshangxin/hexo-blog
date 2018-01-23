var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var htmlclean = require('gulp-htmlclean');
var imagemin = require('gulp-imagemin');
var gzip = require('gulp-gzip');

var exec = require('child_process').exec;

// 压缩 public 目录 css
gulp.task('minify-css', function () {
  return gulp.src('./public/**/*.css')
    .pipe(minifycss())
    .pipe(gulp.dest('./public'));
});
// 压缩 public 目录 html
gulp.task('minify-html', function () {
  return gulp.src('./public/**/*.html')
    .pipe(htmlclean())
    .pipe(htmlmin({
      removeComments: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true,
    }))
    .pipe(gulp.dest('./public'));
});
// 压缩 public/js 目录 js
gulp.task('minify-js', function () {
  return gulp.src('./public/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./public'));
});

// 压缩图片任务
// 在命令行输入 gulp images 启动此任务
gulp.task('images', function () {
  // 1. 找到图片
  return gulp.src('./public/img/*.*')
  // 2. 压缩图片
    .pipe(imagemin({
      progressive: true
    }))
    // 3. 另存图片
    .pipe(gulp.dest('public/img'));
});

gulp.task('gzip', function () {
  return gulp.src('./public/**/*')
    .pipe(gzip())
    .pipe(gulp.dest('./public'));
});

gulp.task('clean', function (done) {
  exec('rm -rf public', done);
});

gulp.task('beauty', function (done) {
  exec('node speed_up.js ./source/_posts', done);
});

gulp.task('generage', function (done) {
  exec('hexo g', done);
});

gulp.task('deploy', function (done) {
  exec('hexo d', function (err, data) {
    if (err) {
      return done(err);
    }

    console.info(data);
    return done();
  });
});

gulp.task('backup', function (done) {
  exec('git add -A; git commit -m "backup" || echo "no commit"; git push origin backup:backup; git push gitlab backup:backup', function (err, data) {
    if (err) {
      return done(err);
    }

    console.info(data);
    return done();
  });
});

// 执行 gulp 命令时执行的任务
gulp.task('default', gulp.series(
  'clean',
  'beauty',
  'backup',
  'generage',
  'minify-html',
  'minify-css',
  'minify-js',
  'images',
  'gzip',
  'deploy'
));