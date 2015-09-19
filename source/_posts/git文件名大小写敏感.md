title: git文件名大小写敏感
date: 2015-09-20 00:03:23
description: 因为git文件名大小写产生的问题及设置
tags: 
- git
---

## git默认
git默认是不区分文件名的大小写,即:
第一次文件名为 A.js,
修改文件名为  a.js
git默认为未修改文件

## 配置git识别大小写

```plain
git config core.ignorecase false
```

## 注意问题
在上面设置并commit文件之后, 使用 `git rebase -i HEAD~2`会提示
```plain
the following untracked working tree files would be overwritten by checkout:
```

解决办法:
- 重新设置大小写**不**敏感,
- 再次执行`git rebase -i HEAD~2`
- 设置大小写敏感


# 参考文档

- [http://yijiebuyi.com/blog/e96eccc4e6f7168e0ce92fa9c79f0d23.html](http://yijiebuyi.com/blog/e96eccc4e6f7168e0ce92fa9c79f0d23.html)


-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇