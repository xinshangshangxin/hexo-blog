---
title: node命令行和控制台参数获取
date: 2015-09-19 14:38:05
tags: 
- node


---

node命令行和控制台参数获取笔记
<!-- more -->



## 命令行参数的原始写法
```js
var arguments = process.argv.splice(2);
```

> process是一个全局对象，argv返回的是一组包含命令行参数的数组。第一项为'node'，第二项为执行的js的完整路径，后面是附加在命令行后的参数

## yargs 模块

[https://github.com/bcoe/yargs](https://github.com/bcoe/yargs)

```js
var argv = require('yargs')
  .option('n', {
    alias : 'name',
    demand: true,
    default: 'tom',
    describe: 'your name',
    type: 'string'
  })
  .argv;
console.log(argv.n);
```

## commander.js 模块
[https://github.com/tj/commander.js](https://github.com/tj/commander.js)

```js
var program = require('commander');

program
  .version('0.0.1')
  .option('-p, --peppers', 'Add peppers')
  .option('-P, --pineapple', 'Add pineapple')
  .option('-b, --bbq-sauce', 'Add bbq sauce')
  .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
  .parse(process.argv);

console.log('you ordered a pizza with:');
if (program.peppers) {
  console.log('  - peppers');
}
if (program.pineapple) {
  console.log('  - pineapple');
}
if (program.bbqSauce) {
  console.log('  - bbq');
}
console.log('  - %s cheese', program.cheese);

```

## 控制台输入

```js
process.stdin.setEncoding('utf8');

process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    process.stdout.write('data: ' + chunk);
  }
});

process.stdin.on('end', function() {
  process.stdout.write('end');
});
```

## 可执行脚本

- 使用 JavaScript 语言,写一个可执行脚本hello

```js
#!/usr/bin/env node
console.log('hello world');
```
- 修改 hello 的权限

```js
chmod 755 hello
```

- 执行脚本

```js
./hello
```

- 把 hello 前面的路径去除: 在当前目录下新建 `package.json`

```js
{
  "name": "hello",
  "bin": {
    "hello": "hello"
  }
}
```
- 执行 `npm link` 命令
- 现在再执行 hello就不用输入路径了

```js
hello
```

# 参考文档

- [http://www.ruanyifeng.com/blog/2015/05/command-line-with-node.html](http://www.ruanyifeng.com/blog/2015/05/command-line-with-node.html)
- [https://nodejs.org/api/process.html#process_process_stdin](https://nodejs.org/api/process.html#process_process_stdin)


-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇

