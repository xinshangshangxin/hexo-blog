title: 使用nodejs 踩坑微信JS-SDK记录
date: 2015-04-22 21:55:00
description:  使用nodejs 踩坑微信JS-SDK记录
tags:
- js
- node
- wechat
---


# JS-SDK 要点
1. 微信测试号; 扫码登录;无需认证(只是名称统一为微信测试号)
[http://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login](http://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login)

2. JS-SDK 说明文档
[http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html#JSSDK.E4.BD.BF.E7.94.A8.E6.AD.A5.E9.AA.A4](http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html#JSSDK.E4.BD.BF.E7.94.A8.E6.AD.A5.E9.AA.A4)

3. 签名验证
> 获取token

```js
function getToken(config, cb) {
    var tokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appId=' + config.appId + '&secret=' + config.appSecret;
    request.get(tokenUrl, function(error, response, body) {
        if (error) {
            cb('getToken error', error);
        }
        else {
            try {
                var token = JSON.parse(body).access_token;
                cb(null, token);
            }
            catch (e) {
                cb('getToken error', e);
            }
        }
    });
}
```
> 获取ticket

```js
function getNewTicket(token, cb) {
    request.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + token + '&type=jsapi', function(error, res, body) {
        if (error) {
            cb('getNewTicket error', error);
        }
        else {
            try {
                var ticket = JSON.parse(body).ticket;
                cb(null, ticket);
            }
            catch (e) {
                cb('getNewTicket error', e);
            }
        }
    });
}
```
> 生成JS-SDK权限验证的签名了

```js

function getTimesTamp() {
    return parseInt(new Date().getTime() / 1000) + '';
}

function getNonceStr() {
    return Math.random().toString(36).substr(2, 15);
}

var timestamp = getTimesTamp();
var noncestr = getNonceStr();
var str = 'jsapi_ticket=' + result + '&noncestr='+ noncestr+'&timestamp=' + timestamp + '&url=' + u;
console.log(str);
var signature = crypto.createHash('sha1').update(str).digest('hex');
cb(null, {
    appId: config.appId,
    timestamp: timestamp,
    nonceStr: noncestr,
    signature: signature
});

```

# 踩过的坑
1. 官方提供的  微信 JS 接口签名校验工具[http://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=jsapisign](http://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=jsapisign)中有一句话 `对于没有只有域名没有 path 的 URL ，浏览器会自动加上 / 作为 path，如打开 http://qq.com 则获取到的 URL 为 http://qq.com/）`我很2的在所有URL最后加入 `/`   (┬＿┬);
2. `timesTamp` 为  `parseInt(new Date().getTime() / 1000) + '';`
3. [JS接口安全域名](http://mp.weixin.qq.com/debug/cgi-bin/sandboxinfo?action=showinfo&t=sandbox/index)配置中,是配置域名+端口,不是网址!!
所以 `416973.dowei8.com:21119/tt` 类似的网址只能配置为`dowei8.com:21119`
4. 微信有缓存.... 有时是缓存问题.........


# 完整代码

## 下载地址: [http://git.oschina.net/xinshangshangxin/node_JS-SDK_signature](http://git.oschina.net/xinshangshangxin/node_JS-SDK_signature)
> 映射外网/上传服务器
> `npm install` 安装依赖包
> `node index.js` 运行主程序
> 配置 [JS接口安全域名](http://mp.weixin.qq.com/debug/cgi-bin/sandboxinfo?action=showinfo&t=sandbox/index)
> 微信访问

## 参考文档

- [https://github.com/willian12345/wechat-JS-SDK-demo](https://github.com/willian12345/wechat-JS-SDK-demo)


-----------------------

> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
