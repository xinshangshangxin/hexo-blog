title: "make: 'test' is up to date"
date: 2015-11-17 10:07:23
description: make test一直提示 up to date的解决方法
tags:
- make

---

## 问题:

```bash
make test
=> make: `test' is up to date.
```

## 解决办法:

> 在Makefile中添加 

```bash
.PHONY: all test clean
```


# 参考文档

- [http://stackoverflow.com/questions/3931741/why-does-make-think-the-target-is-up-to-date](http://stackoverflow.com/questions/3931741/why-does-make-think-the-target-is-up-to-date)

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇