title: "QQ互联踩坑记录"
date: 2015-05-24 19:10:08
description:  QQ互联出现redirect uri is illegal(100010)的踩坑记录
tags:
- js
---

## 页面进入地址不正确....
- [错误页面open.qq.com](http://op.open.qq.com/index.php)
![错误地址](/img/qqlogin/qqlogin.png)
### [正确页面connect.qq.com](http://connect.qq.com/manage/index)

## 出现 `redirect uri is illegal(100010)` 回调地址文档未更新....

![登录失败](/img/qqlogin/qqlogin4.png)

> 官方文档[website/回调地址常见问题及修改方法](http://wiki.open.qq.com/wiki/faq/website/%E5%9B%9E%E8%B0%83%E5%9C%B0%E5%9D%80%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98%E5%8F%8A%E4%BF%AE%E6%94%B9%E6%96%B9%E6%B3%95)中

![错误说明](/img/qqlogin/qqlogin2.png)

> 全部是错误的,应当参考如下图片,回调地址填写 **完整的回调地址**

![正确设置](/img/qqlogin/qqlogin3.png)


-----------------------

> ### 文章若有纰漏请大家补充指正,谢谢~~

> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
