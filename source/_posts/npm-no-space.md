---
layout: post
title: 'npm install 报错 Error: ENOSPC, No space left on device'
date: 2019-04-09 19:05:13
tags:
  - npm
---

## 错误详情

```plain
Unhandled rejection Error: ENOSPC: no space left on device, open '~/.npm/_cacache/tmp/46ba10d0'
```

<!-- more -->

## 结论

### `df -h` 检查磁盘是否有空间

### `df -i` 检查 `inode` 是否满了

0 字节的文件会占用`inode`, 删除部分 0 字节文件

```bash
# 找到 /home 下 0字节文件
sudo find /home -type f -size 0

# 找到 ~ 目录下, 文件名包含 npm-debug.log, 删除
sudo find ~ -type f -size 0 | grep "npm-debug.log" | xargs rm
```

## 过程

`no space left on device` 第一反应是磁盘满了, 所以直接检查 `df -h` 磁盘还有没有空间, 但是发现磁盘空间很多
搜索之后, 发现 [这篇文章说`My problem was that I ran out of inodes`](https://github.com/npm/npm/issues/1131#issuecomment-226420106)
通过 `df -ih` 检查之后, 发现 `inode` 的确是 100%, 通过 [这篇文章知道 0 字节的文件会占用 inode](https://blog.csdn.net/a1010256340/article/details/81083458), 发现有大量 `npm-debug.log.xxxxx` 文件, 删除后可以正常安装 `npm`

# 参考文档

- [npm ERR! No Space left on device](https://github.com/npm/npm/issues/1131#issuecomment-226420106)
- [linux inode 已满解决方法](https://blog.csdn.net/a1010256340/article/details/81083458)
  <br>

---

> **文章若有纰漏请大家补充指正,谢谢~~**  
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG 殇
