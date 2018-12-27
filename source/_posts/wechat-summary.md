---
layout: post
title: "微信总结"
date: 2016-09-22 15:42:27
tags:
- wechat


---

遇到的坑,或者其它混淆的概念
<!-- more -->



## 第三方平台 和 公众号自己开发
存在 
1. appid+appsecret
2. B 第三方
3. C 第三方

---------------

- 不限制授权第三方的次数
- 获取accesstoken的额度为分开的(无官方文档说明,猜测)
- accesstoken对不同的第三方不会冲突
- 不同的第三方主动调用API不会冲突
- 事件通知目前支持向所有授权的第三方发送
- 每个第三方都可以回复消息
- 每个第三方回复空的就没关系，都回复会有混乱，只能靠公众号自己跟第三方协调
- 第三方 网页授权 文档: https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&id=open1419318590&token=&lang=zh_CN


## 微信会话cookie的时长
操作 | 是否失效
----|----
从WebView返回微信主界面 |   cookie不失效
返回手机系统主界面   | cookie不失效
后台关闭微信进程    | cookie失效
微信切换账号 | cookie失效
内存小的机型，这部分临时存储就会被系统释放掉 | cookie失效
一般浏览器当浏览器退出后(chrome等)  | cookie失效

## 网页授权登录 和 网站应用登录

> |网页授权登录   |  网站应用微信登录
> ----------|----------|----------
>  平台 | https://mp.weixin.qq.com     |  https://open.weixin.qq.com/
> 微信文档 | [mp wiki](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140842&token=&lang=zh_CN) | [open wiki](https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&id=open1419316505&token=&lang=zh_CN)
> 区别 | scope为snsapi_base, 获取用户的openid 静默授权 <br> scope为snsapi_userinfo获取用户的基本信息,对于已关注公众号的用户,静默授权,否则需要用户同意 <br>未关注的用户也能获取到用户信息 | 微信用户 需同意授权第三方应用

## 网站授权登录(https://open.weixin.qq.com/)
[微信文档](https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&id=open1419316505&token=&lang=zh_CN)
[package passport-wechat](https://github.com/liangyali/passport-wechat)
```js
// config 配置
auth: {
    wechat: {
      passport: {
        strategy: 'wechat',
        module: 'passport-wechat',
        options: {
          appID: '',
          appSecret: '',
          callbackURL: 'prefix/auth/wechat/callback',
          response_type: 'code',
          scope: 'snsapi_login',
          state: true
        },
        verify: function(openid, profile, userInfo, done) {
          done(null, userInfo);
        }
      }
    }
}
```

```js
var passport = require('passport');
var WechatStrategy = require('passport-wechat');

var callbackURL = '/auth/wechat/callback';

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// 相关配置为测试账号信息
passport.use(new WechatStrategy({
  appID: appID,
  appSecret: appSecret,
  callbackURL: callbackURL,
  response_type: 'code',
  scope: 'snsapi_login',
  state: true
}, function(openid, profile, userInfo, done) {
  done(null, userInfo);
}));

module.exports = {
  authCallback: function(req, res) {
    var from = encodeURIComponent(req.param('from')) || '';
    passport.authenticate('wechat', {
      failureRedirect: '/auth/err',
      successRedirect: '/auth/success' + '?from=' + from
    })(req, res);
  },
  authError: function(req, res) {
    res.json(400, {
      message: 'error'
    });
  },
  authSuccess: function(req, res) {
    res.redirect(joinQueryStr((req.param('from') || '/'), {
      userInfo: req.user || {},
      unionid: (req.user || {}).unionid
    }));
  },
  authWechat: function(req, res) {
    var from = encodeURIComponent(req.param('from')) || '';
    passport.authenticate('wechat', {
      callbackURL: callbackURL + '?from=' + from
    })(req, res);
  }
};
```


## 网页授权登录
[微信文档](http://mp.weixin.qq.com/wiki/17/c0f37d5704f0b64713d5d2c37b468d75.html)
[package wechat-oauth](https://github.com/node-webot/wechat-oauth)
```js
auth: function(req, res) {
    var code = req.query.code;
    if(req.query.state && code === 'authdeny') {
      return res.status(400).send('用户拒绝授权');
    }

    if(!code) {
      var callbackUrl = req.protocol + '://' + req.get('Host') + req.originalUrl;
      var url = oauth.getAuthorizeURL(callbackUrl, 'random_state', 'snsapi_userinfo');
      console.log('redirect to', url);
      return res.redirect(url);
    }

    var openid;
    var wechatUser;
    return async.series([
      function getAccessToken(cb) {
        oauth.getAccessToken(code, function(err, result) {
          if(err) {
            return cb(err);
          }
          openid = result.data.openid;
          cb();
        });
      },
      function getWechatUser(cb) {
        oauth.getUser(openid, function(err, user) {
          req.session.wechat = user;
          wechatUser = user;
          cb(err, user);
        });
      }
    ], function(err) {
      if(err) {
        return res.status(400).json(err);
      }

      console.log('session', req.session);
      if(req.query.referer) {
        return res
          .redirect(UtilitiesService
            .joinQueryStr((req.query.referer || '/'), {
              userInfo: wechatUser || {},
              unionid: (wechatUser || {}).unionid
            })
          );
      }

      res.json({
        userInfo: wechatUser,
        unionid: openid
      });
    });
  },
```

