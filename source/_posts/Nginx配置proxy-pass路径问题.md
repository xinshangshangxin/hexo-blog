title: Nginx配置proxy_pass路径问题
date: 2015-04-16 18:15:21
description:  初次尝试nginx遇到的问题
tags:
- nginx
---


> proxy_pass后的url最后的/
> 当加上了/，相当于是绝对根路径，则nginx不会把location中匹配的路径部分代理走
> 如果没有/，则会把匹配的路径部分也给代理走



> 假设请求url: `http://servername/node/index.html`


> 配置:
```js
location /node/  {
    proxy_pass http://127.0.0.1:1339/;
}
```

> 代理url(实际url)`http://servername/node/index.html`

> 配置:
```js
location /node  {
    proxy_pass http://127.0.0.1:1339/;
}
```

> 代理url(实际url)`http://servername/index.html`

可以通过rewrite来实现/的功能
> 配置:
```js
location /node  {
    rewrite /node/(.+)$ /$1 break;
    proxy_pass http://127.0.0.1:1339/;
}
```

> 代理url(实际url)`http://servername/node/index.html`


此外 `http://127.0.0.1:1339/` 的最后一个 `/` 如果不写;会导致 `404 Not Found`



## 参考文档

[http://www.tech126.com/nginx-proxy-pass/](http://www.tech126.com/nginx-proxy-pass/)

[http://cssor.com/nginx-location-configuration.html](http://cssor.com/nginx-location-configuration.html)


-----------------------

> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
