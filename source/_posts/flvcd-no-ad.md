title: "硕鼠解析自动跳过广告"
date: 2015-11-29 00:30:24
description: 硕鼠解析自动跳过广告
tags:
- youkuvod

---

## 早期的硕鼠广告

> 早期的硕鼠广告只是通过URL中带有 `go=1` 即可跳过广告, 最近发现已失效

## 目前的硕鼠广告

> 通过设置cookie判断是否已经观看广告

## 解决过程


1. postman抓取页面 [http://www.flvcd.com/parse.php?flag=&go=1&format=&kw=http%3A%2F%2Fv.youku.com%2Fv_show%2Fid_XMTI4OTgxNTE2NA%3D%3D.html%3Ffrom%3Ds1.8-1-1.1%26s%3D19545](http://www.flvcd.com/parse.php?flag=&go=1&format=&kw=http%3A%2F%2Fv.youku.com%2Fv_show%2Fid_XMTI4OTgxNTE2NA%3D%3D.html%3Ffrom%3Ds1.8-1-1.1%26s%3D19545)

2. 观察代码,发现多个eval函数
3. 将eval函数替换成 `document.write` 解析eval混淆后的代码
4. 得到1个关键函数 `createSc` 和 2个 `document.cookie=`
5. 提取关键函数跳过广告

```js
var html = document.documentElement.innerHTML;

var isParsed = /<input type="hidden" name="inf" value="/.test(html);
if (isParsed) {
  return;
}

var key = ((html.match(/\='\w{32,32}'\;/) || [])[0] || '').replace('=\'', '').replace('\';', '');
var time = ((html.match(/\=\d{13,13}/) || [])[0] || '').replace('=', '');

parseCookie(key, time);

function parseCookie(key, time) {
  function createSc(a, t) {
    var b = '24227945943216730751837054267565';
    t = Math.floor(t / (600 * 1000));
    var ret = '';
    for (var i = 0; i < a.length; i++) {
      var j = a.charCodeAt(i) ^ b.charCodeAt(i) ^ t;
      j = j % 'z'.charCodeAt(0);
      var c;
      if (j < '0'.charCodeAt(0)) {
        c = String.fromCharCode('0'.charCodeAt(0) + j % 9);
      } else if (j >= '0'.charCodeAt(0) && j <= '9'.charCodeAt(0)) {
        c = String.fromCharCode(j);
      } else if (j > '9'.charCodeAt(0) && j < 'A'.charCodeAt(0)) {
        c = '9';
      } else if (j >= 'A'.charCodeAt(0) && j <= 'Z'.charCodeAt(0)) {
        c = String.fromCharCode(j);
      } else if (j > 'Z'.charCodeAt(0) && j < 'a'.charCodeAt(0)) {
        c = 'Z';
      } else if (j >= 'z'.charCodeAt(0) && j <= 'z'.charCodeAt(0)) {
        c = String.fromCharCode(j);
      } else {
        c = 'z';
      }
      ret += c;
    }
    return ret;
  }


  var g = createSc(key, time);
  var date = new Date();
  date.setTime(date.getTime() + 300 * 1000);
  document.cookie = 'go=' + g + ';expires=' + date.toGMTString();
  document.cookie = 'avdGggggtt=' + time + ';expires=' + date.toGMTString();

  window.setTimeout(function() {
    window.location.reload();
  }, 16);
}

```


# 完整脚本地址:

- []()

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
