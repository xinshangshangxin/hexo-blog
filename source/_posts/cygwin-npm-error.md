title: “在cygwin中npm安装git packages 失败” 
date: 2016-01-07 09:17:22
description:  在cygwin中安装是出现路径不正确,安装失败
tags: 
- npm
----------

## 原因
> npm 官方不支持在cygwin中安装

## 解决方案

替换 `node_modules\npm\lib\utils\git.js` 为下面内容

```js
// handle some git configuration for windows

exports.spawn = spawnGit
exports.chainableExec = chainableExec
exports.whichAndExec = whichAndExec

var exec = require("child_process").execFile
  , spawn = require("./spawn")
  , npm = require("../npm.js")
  , which = require("which")
  , git = npm.config.get("git")
  , assert = require("assert")
  , log = require("npmlog")
  , win32 = process.platform === "win32"
  , cygwin = win32 && (process.env.ORIGINAL_PATH || '').indexOf('/cygdrive/') != -1

function prefixGitArgs () {
  return win32 ? ["-c", "core.longpaths=true"] : []
}

function execGit (args, options, cb) {
  if(cygwin && args) {
      for(var i=0; i<args.length; i++) {
          if(':\\'.indexOf(args[i]) != 1) {
              args[i] = args[i].replace(/\\/g, '/').replace(/^([A-Za-z])\:\//, '/cygdrive/$1/');
          }
      }
  }
  var fullArgs = prefixGitArgs().concat(args || [])
  log.info('git', fullArgs)
  return exec(git, fullArgs, options, cb)
}

function spawnGit (args, options) {
  log.info("git", args)
  return spawn(git, prefixGitArgs().concat(args || []), options)
}

function chainableExec () {
  var args = Array.prototype.slice.call(arguments)
  return [execGit].concat(args)
}

function whichGit (cb) {
  return which(git, cb)
}

function whichAndExec (args, options, cb) {
  assert.equal(typeof cb, "function", "no callback provided")
  // check for git
  whichGit(function (err) {
    if (err) {
      err.code = "ENOGIT"
      return cb(err)
    }

    execGit(args, options, cb)
  })
}
```


# 参考文档:

- [https://github.com/npm/npm/issues/7357](https://github.com/npm/npm/issues/7357)

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇







