---
title: 在sails中使用gulp代替grunt个人总结
date: 2015-08-16 21:45:44
tags:
- sails
- gulp


---

grunt的速度太慢,尝试使用gulp替换grunt的使用记录
<!-- more -->



# 在sails中使用gulp代替grunt

## 现成的依赖包: [https://github.com/Karnith/sails-generate-new-gulp](https://github.com/Karnith/sails-generate-new-gulp)

- 首先安装依赖项

```plain
npm install -g sails-generate-backend-gulp
npm install -g sails-generate-gulpfile
npm install -g sails-generate-frontend-gulp
npm install -g sails-generate-new-gulp
```

- 在工作目录下添加文件 `.sailsrc`

```plain
{
    "generators": {
        "modules": {
            "new": "sails-generate-new-gulp",
            "frontend": "sails-generate-frontend-gulp",
            "backend": "sails-generate-backend-gulp",
            "gulpfile": "sails-generate-gulpfile"
        }
    }
}
```

- 在上面的工作目录下创建一个基于gulp的sails项目

```plain
sails new <project name>
```

**比原来的sails_grunt项目,多出了文件 `api/hooks/gulp/index.js`(用于 sails lift时使用gulp作为默认),修改了 `.sailsrc` 和 `package.json`**

## 我的一些修改和添加

### 使用 `del` 来删除文件/文件夹

`npm install --save-dev del`

```js
// 在 tasks/config 下 修改 clean.js文件
var del = require('del');

module.exports = function(gulp, plugins, growl) {
  gulp.task('clean:dev', function(cb) {
    return del(['.tmp/public/**/*'], cb);     // 改成你的路径
  });

  gulp.task('clean:build', function(cb) {
    return del(['deployment/**/*'], cb);     // 改成你的路径
  });
};
```

### html2js
`npm install --save-dev gulp-html2js`

```js
// 在 tasks/config 下 新建 html2js.js文件
module.exports = function(gulp, plugins, growl) {

  gulp.task('html2jsfrontend', function() {
    return gulp.src(['assets/frontend/**/*.html'])  // 路径需要修改
      .pipe(plugins.html2js({
        outputModuleName: 'Frontend',               // 需要修改
        base: 'assets/',
        useStrict: true
      }))
      .pipe(plugins.concat('template-frontend.js'))  // 生成的文件名
      .pipe(gulp.dest('.tmp/public/frontend/'));     // dest的目录
  });

  gulp.task('html2jsapp', function() {
    return gulp.src(['assets/app/**/*.html'])       // 路径需要修改
      .pipe(plugins.html2js({
        outputModuleName: 'App',			            // 需要修改
        base: 'assets/',
        useStrict: true
      }))
      .pipe(plugins.concat('template-app.js'))
      .pipe(gulp.dest('.tmp/public/app'));
  });

  gulp.task('html2js', ['html2jsfrontend', 'html2jsapp']);  // 之所以这样写,是因为gulp正确的实现异步：接收一个回调函数或者返回一个 promise 对象或者事件流（event stream）
};
```

### 添加jshint

`npm install --save-dev map-stream gulp-jshint`


```js
// 在 tasks/config 下 新建 jshint.js文件
var map = require('map-stream'),
  events = require('events'),
  emmitter = new events.EventEmitter(),
  path = require('path');

var jsHintErrorReporter = function(file, cb) {
  return map(function(file, cb) {
    if (!file.jshint.success) {
      file.jshint.results.forEach(function(err) {
        if (err) {
          console.log(err);
          // Error message
          var msg = [
            path.basename(file.path),
            'Line: ' + err.error.line,
            'Reason: ' + err.error.reason
          ];

          // Emit this error event
          emmitter.emit('error', new Error(msg.join('\n')));
        }
      });
    }
    cb(null, file);
  })
};


module.exports = function(gulp, plugins, growl) {

  gulp.task('api', function() {
    return gulp.src([
        'api/controllers/*.js',
        'api/services/**/*.js',
        'api/policies/*.js',
        'api/models/*.js'
      ])
      .pipe(plugins.jshint('.jshintrc_api', {
        fail: true
      }))
      .pipe(plugins.jshint.reporter('default')) // Console output
      .pipe(jsHintErrorReporter()) // If error pop up a notify alert
      .on('error', plugins.notify.onError(function(error) {
        return error.message;
      }));
  });

  gulp.task('assets', function() {
    return gulp.src(['改成你的路径!!']) 	             // 改成你的路径
      .pipe(plugins.jshint('.jshintrc', {
        fail: true
      }))
      .pipe(plugins.jshint.reporter('default')) // Console output
      .pipe(jsHintErrorReporter()) // If error pop up a notify alert
      .on('error', plugins.notify.onError(function(error) {
        return error.message;
      }));
  });

  gulp.task('jshint', ['api', 'assets']);
};
```

### 添加 `ng-annotate`

`npm install --save-dev gulp-ng-annotate`

```js
// 在 tasks/config 下 新建ng-annotate.js文件
var ngAnnotate = require('gulp-ng-annotate');
module.exports = function(gulp, plugins, growl) {

  gulp.task('ngAnnotateapp', function() {
    return gulp.src(['app/**/*.js', '*.js'], {
        cwd: '.tmp/public',
        base: '.tmp/public'
      })
      .pipe(ngAnnotate())
      .pipe(gulp.dest('.tmp/public'));
  });

  gulp.task('ngAnnotatefrontend', function() {
    gulp.src(['frontend/**/*.js', '*.js'], {
        cwd: '.tmp/public',
        base: '.tmp/public'
      })
      .pipe(ngAnnotate())
      .pipe(gulp.dest('.tmp/public'));
  });

  gulp.task('ngAnnotate', ['ngAnnotateapp', 'ngAnnotatefrontend']);
};
```

### 修改 `sails-linker-gulp.js`

```js
// 在 tasks/config 下 修改 sails-linker-gulp.js文件
// 直接仿写原来的即可
```

### 修改 `api/register` 下文件,以注册上面添加的内容

`buildProd.js`
```js
module.exports = function(gulp, plugins) {
  gulp.task('buildProd', function(cb) {
    plugins.sequence(
      'compileAssets',
      'ngAnnotate',                        // 添加 ngAnnotate
      'concat:js',
      'concat:css',
      'uglify:dist',
      'cssmin:dist',
      'linkAssetsBuildProd',
      'clean:build',
      'copy:build',
      cb
    );
  });
};
```

`compileAssets.js`
```js
module.exports = function (gulp, plugins) {
	gulp.task('compileAssets', function(cb) {
		plugins.sequence(
			'clean:dev',
			'jshint',                              // 添加jshint
			'jst:dev',
			'less:dev',
			'sync:dev',
			'copy:dev',
			'coffee:dev',
			'html2js',						       // 添加html2js
			cb
		);
	});
};
```


## 一些个人见解

### 使用 grunt 而不是 gulp
- grunt基于配置, 所以项目变化,修改的tasks 不多, gulp是 '将配置写入代码', 所以项目切换,修改文件很多  

> 15/08/24 update:   
> gulp 也可以基于配置

```js
var config = require('./tasks/config.js');

gulp
  .src(config.less.src, config.less.opt)
  .pipe(less({
    expand: true,
    ext: '.css'
  }))
  .pipe(gulp.dest(config.less.dest));
```
```js
// config.js
module.exports = {
  'less': {
    'src': [
      'styles/**/*.less'
    ],
    'opt': {
      'cwd': 'static',
      'base': 'static'
    },
    'dest': 'sites/public'
  }
}
```

- grunt进行大项目的jshint比gulp快的多, 所以如果需要jshint,并且文件很多,建议不要切换
- grunt的uglify比gulp得uglify快的多得多,所以项目越大,建议不要切换
- 不想折腾,直接官方的上


### 使用 gulp 而不是 grunt
- 无法忍受 grunt 慢(每次修改前端文件,都要刷新2遍才有效果)
- jshint单独处理或者在开发时不使用jshint
- 小项目,而不是文件数目很多的大项目有


# 参考
- [https://github.com/Karnith/sails-generate-new-gulp](https://github.com/Karnith/sails-generate-new-gulp)

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**

> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇

