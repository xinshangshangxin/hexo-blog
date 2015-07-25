title: "karma全局安装记录"
date: 2015-03-29 21:59:39
tags:
- karma
---

> karma全局安装记录

<!-- more -->

## 安装
```js
// 我全局安装了...
npm install karma -g
```

## 移动文件夹
> 进入`C:\Users\你的用户名\AppData\Roaming\npm\node_modules`, 新建文件夹,将karma文件夹移动到新建的文件夹; 目录如下:

- karma // 你新建的文件夹名称
  - karma //原始的karma文件夹
  
**如此操作的原因:**
> 在 karma 的文件夹的`package.json`的`devDependencies`没有生成`node_modules`


## 生成 `devDependencies`
> 新建`package.json`

**结构如下**
- karma
  - karma
  - package.json
  
其中`package.json`为:
```js
{
    "name": "random",
    "version": "1.0.0",
    "description": "",
    "author": "SHANG",
    "devDependencies": {
        "karma-jasmine": "~0.1.0",
        "karma-mocha": "*",
        "karma-qunit": "*",
        "karma-coverage": "*",
        "karma-requirejs": "*",
        "karma-commonjs": "*",
        "karma-growl-reporter": "*",
        "karma-junit-reporter": "*",
        "karma-chrome-launcher": "*",
        "karma-firefox-launcher": "*",
        "karma-sauce-launcher": "*",
        "karma-phantomjs-launcher": "*",
        "karma-ng-scenario": "*",
        "karma-coffee-preprocessor": "*",
        "karma-live-preprocessor": "*",
        "karma-html2js-preprocessor": "*",
        "karma-browserstack-launcher": "*"
    }
}
```

> 执行`npm install`命令;等待执行完成后;将当前路径下的`node_modules`下文件夹剪切到和`karma`同级. 文件目录如下:

- karma
    - karma         //最原始的karma
    - karma-browserstack-launcher
    - karma-chrome-launcher
    - karma-jasmine
    - .......
    - node_modules //可以删除

## 建立karma.cmd
> 安装后没有生成链接,无法使用命令启动;故如下操作
在路径`C:\Users\你的用户名\AppData\Roaming\npm`下建立`karma.cmd`;里面内容如下

```js
@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\node_modules\karma\karma\bin\karma" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\node_modules\karma\karma\bin\karma" %*
)
```

## 测试
> 在随便哪个路径下新建测试文件夹;我的目录如下

- src
    - index.js
- test
    - TestCase1.js
    
```js
// index.js
function reverse(name) {
    return name.split("").reverse().join("");
}
```
```js
// TestCase1.js
describe("A suite", function() {
    it("contains spec with an expectation", function() {
        console.log("This is msg from log...");
        expect(true).toBe(true);
    });
});

describe("A suite of basic functions", function() {
    it("reverse word", function() {
        expect("DCBA").toEqual(reverse("ABCD"));
        expect("damo").toEqual(reverse("omad1"));
    });
});
```

> cmd 当前目录下输入  `karma init conf`

![karma](/img/karma/karma_init.png)

> 完成后输入 `karma start conf`; 拉起chrome开始测试了~~

![karma](/img/karma/karma_start.png)

> 测试完成按`ctrl+c`关闭;关闭浏览器是没有用的~~





# 参考资料:

[http://blog.jobbole.com/54936/](http://blog.jobbole.com/54936/)


-----------------------

> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
