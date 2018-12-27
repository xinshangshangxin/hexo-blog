---

layout: post
title: 使用 fetch 上传 FormData 踩坑
date: 2018-11-31 21:30:32
tags:
  - fetch
  - FormData


---

使用 fetch 上传文件, 使用 FormData 服务器无法识别
<!-- more -->




# 结论

先上结论, 使用 `fetch` 和 `FormData`, 不能设置 `Content-Type` header !!!!

# 缘起

想要 通过 `blob` 上传二进制文件到服务器, 很自然用了如下代码

```js
let formData = new FormData();
formData.append('xxx', Blob, 'filename');

await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  body: formData,
});
```

但是服务器一直报错, 返回无法识别 `body`

# 排错

1. 换成 `xmlRequest` 上传, 依然报错
2. 使用其它工具上传(`postman/insomnia`), 正常
3. 使用 `fetch` 上传, 报错
4. 对比 发送的数据, 发现使用 `fetch` 上传的 `Header`为:

```plain
Content-Type multipart/form-data
```

而 使用其它工具上传时, `Header` 为

```plain
Content-Type: multipart/form-data; boundary=X-INSOMNIA-BOUNDARY
```

多了一个 `boundary` 属性

# 原因

使用 `FormData` 传输二进制数据,服务器需要一种方法来知道一个字段的数据何处结束以及下一个数据的起始位置.而 `boundary` 定义了我们在请求中发送的字段之间的分隔符. 当删除我们手动定义的 `Content-Type` 之后, 浏览器会添加正确的 `boundary`

# 参考文档

- [Uploading files using 'fetch' and 'FormData'](https://stanko.github.io/uploading-files-using-fetch-multipart-form-data/)  
  <br>

---

> **文章若有纰漏请大家补充指正,谢谢~~**

> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG 殇

