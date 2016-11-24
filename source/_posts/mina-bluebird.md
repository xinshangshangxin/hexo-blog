layout: post
title: 微信小程序中使用bluebird
date: 2016-11-24 19:49:51
description: 微信小程序不支持Promise, 引入bluebird的探究过程
tags: 
- 微信
- 小程序
- MINA
---


# 微信小程序中使用bluebird

## 探究过程
**不想看探究过程的, 结论在最后.**  
因为 `bluebird ` 会抛出 `Unhandled rejection Error`, 以及强大的方法, 如 `map`, `props` 等, 使用 `es6-promise` 无法满足我, 故探究如何引入 `bluebird`

- 直接引入  
在 `npm install bluebird` 之后, 直接使用

```js
const Promise = require('../node_modules/bluebird/js/release/bluebird.js');
```

提示 `module "node_modules/bluebird/js/release/bluebird.js" is not defined`;

- 将安装后的文件夹复制  
`node_modules/bluebird/js/release` 存在 browser 和 release 2 个文件夹, 由于微信小程序并不运行在浏览器中, 故不能引入browser; 将 release 文件夹拷贝至 utils 文件夹后引入. 在微信开发者工具中虽然报了 8个 `can not create Function`,但是依然可以使用.
 
 ![](/img/mina/mina2.png)
 
- 真机环境测试   
 在真机环境中使用时(我Android4.4), 却出现了 `cannot create property 'createElement' of undefined`

 ![](/img/mina/mina1.png)


- 搜索 `createElement` 寻找线索  
 在 搜索`node_modules/bluebird/js/release/`文件夹后发现, 在 `schedule.js` 中存在 `createElement`; 
 
  ![](/img/mina/mina3.png)
 
 分析代码后发现在真机中, 程序进入了以下内容
 
  ![](/img/mina/mina4.png)

 
- 解决方案  
 修改 `schedule.js`, 让其直接使用 `setTimeout`.

## 结论
1. `npm i bluebird`
2. 将 `node_modules/bluebird/js/release` 文件夹拷贝出来, 比如拷贝到 `utils` 目录下
3. 将 `utils/bluebird/js/release/schedule.js` 中的内容替换为

  ```js
  module.exports = function (fn) {
    setTimeout(fn, 0);
  };
  ```

4. require 后使用
```js
const Promise = require('./bluebird/js/release/bluebird.js');
```

5. 如果每次修改嫌麻烦, 可以使用脚本控制
   也可以尝试 我自用的微信骨架 [https://github.com/xinshangshangxin/MINA-seed](https://github.com/xinshangshangxin/MINA-seed), *注入了 bluebird, promisify了wx.xxx接口, 修改了 vConsole时不输出function和error*

## 参考文档

- [https://cnodejs.org/topic/57eb4e4bea2fa420446d4371](https://cnodejs.org/topic/57eb4e4bea2fa420446d4371)
  
<br>

-----------------------


> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇