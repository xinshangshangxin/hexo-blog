layout: post
title: 微信小程序中使用lodash
date: 2016-11-30 13:48:34
description: 微信小程序引入lodash出错解决方案
tags: 
- wechat
- 小程序
- MINA
---

# 微信小程序中使用lodash

## 探究过程
**不想看探究过程的, 结论在最后.** 
 

- 安装 `lodash.get`, 拷贝文件`node_modules/lodash.get/index.js`至 `utils/lodash.get/index.js`, 然后直接  `require('./utils/lodash.get/index.js')`, 可以正常使用  

- 拷贝 `node_modules/lodash/lodash.js` 文件至 `utils/lodash/lodash.js`, 然后直接 `require('./utils/lodash/lodash.js')`, 出现 
```plain
Uncaught TypeError: Cannot read property 'prototype' of undefined
```

![lodash](/img/mina/mina-lodash1.png)  

跳转至源码 发现 `Array` 不存在, 因为 `freeGlobal` 和 `freeSelf` 都为 `false`, 因为微信直接注入了 `window` 和 `self`;

![lodash](/img/mina/mina-lodash2.png)  

![lodash](/img/mina/mina-lodash3.png) 

![lodash](/img/mina/mina-lodash5.png)  

 最终, `Array = (Function('return this')()).Array` 为 `undefined`.
 
 所以, 只需要替换 `root` 的值即可, 从lodash的源码中发现, `lodash` 会pick以下属性  
 ![lodash](/img/mina/mina-lodash6.png)    
 
 使用`try catch` 监测支持属性
  ```js
  try { root.Array = Array } catch (e) { console.log('Array not support in MINA, skip') }
  try { root.Buffer = Buffer } catch (e) { console.log('Buffer not support in MINA, skip') }
  try { root.DataView = DataView } catch (e) { console.log('DataView not support in MINA, skip') }
  try { root.Date = Date } catch (e) { console.log('Date not support in MINA, skip') }
  try { root.Error = Error } catch (e) { console.log('Error not support in MINA, skip') }
  try { root.Float32Array = Float32Array } catch (e) { console.log('Float32Array not support in MINA, skip') }
  try { root.Float64Array = Float64Array } catch (e) { console.log('Float64Array not support in MINA, skip') }
  try { root.Function = Function } catch (e) { console.log('Function not support in MINA, skip') }
  try { root.Int8Array = Int8Array } catch (e) { console.log('Int8Array not support in MINA, skip') }
  try { root.Int16Array = Int16Array } catch (e) { console.log('Int16Array not support in MINA, skip') }
  try { root.Int32Array = Int32Array } catch (e) { console.log('Int32Array not support in MINA, skip') }
  try { root.Map = Map } catch (e) { console.log('Map not support in MINA, skip') }
  try { root.Math = Math } catch (e) { console.log('Math not support in MINA, skip') }
  try { root.Object = Object } catch (e) { console.log('Object not support in MINA, skip') }
  try { root.Promise = Promise } catch (e) { console.log('Promise not support in MINA, skip') }
  try { root.RegExp = RegExp } catch (e) { console.log('RegExp not support in MINA, skip') }
  try { root.Set = Set } catch (e) { console.log('Set not support in MINA, skip') }
  try { root.String = String } catch (e) { console.log('String not support in MINA, skip') }
  try { root.Symbol = Symbol } catch (e) { console.log('Symbol not support in MINA, skip') }
  try { root.TypeError = TypeError } catch (e) { console.log('TypeError not support in MINA, skip') }
  try { root.Uint8Array = Uint8Array } catch (e) { console.log('Uint8Array not support in MINA, skip') }
  try { root.Uint8ClampedArray = Uint8ClampedArray } catch (e) { console.log('Uint8ClampedArray not support in MINA, skip') }
  try { root.Uint16Array = Uint16Array } catch (e) { console.log('Uint16Array not support in MINA, skip') }
  try { root.Uint32Array = Uint32Array } catch (e) { console.log('Uint32Array not support in MINA, skip') }
  try { root.WeakMap = WeakMap } catch (e) { console.log('WeakMap not support in MINA, skip') }
  try { root._ = _ } catch (e) { console.log('_ not support in MINA, skip') }
  try { root.clearTimeout = clearTimeout } catch (e) { console.log('clearTimeout not support in MINA, skip') }
  try { root.isFinite = isFinite } catch (e) { console.log('isFinite not support in MINA, skip') }
  try { root.parseInt = parseInt } catch (e) { console.log('parseInt not support in MINA, skip') }
  try { root.setTimeout = setTimeout } catch (e) { console.log('setTimeout not support in MINA, skip') }
  ```
 
  在微信Android中测试后, 发现小程序不支持以下属性  
  ![lodash](/img/mina/mina-lodash7.png)    




## 结论
1. 直接引入 `lodash modularize` 之后的包可以解决
  ```plain
    npm install lodash.get
    let get = require('./your_copy_path/lodash.get/index');
    // 直接使用 get(obj, path);
  ```

2. 将lodash4.16.6 `lodash/lodash.js:416` 中  

    ```js
    var root = freeGlobal || freeSelf || Function('return this')();
    ```

    替换为  
   ```js
    var root = {
      Array: Array,
      Date: Date,
      Error: Error,
      Function: Function,
      Math: Math,
      Object: Object,
      RegExp: RegExp,
      String: String,
      TypeError: TypeError,
      setTimeout: setTimeout,
      clearTimeout: clearTimeout,
      setInterval: setInterval,
      clearInterval: clearInterval
    };
   ```
3. 如果每次修改嫌麻烦, 可以使用脚本控制  
   也可以尝试我自用的微信骨架 [https://github.com/xinshangshangxin/MINA-seed](https://github.com/xinshangshangxin/MINA-seed), *注入了 bluebird, lodash, promisify了wx.xxx接口, 修改了 vConsole 不输出function和error*  
      
 <br>    
-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**  
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇

