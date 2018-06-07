---
layout: post
title: "docker 使用 -v 或 --volume 映射文件报错"
description: "-v 出现 unknown: Are you trying to mount a directory onto a file (or vice-versa)"
date: 2018-06-07 11:18:47
tags:
- docker
---

## 解决方案:
假设 `docker run -v local_file_path:docker_file_path docker_image`
1. `local_file_path` 必须存在, 并且类型为文件
2. `docker_file_path` 必须存在, 绝对路径, 并且类型为文件

## 原因:
从 [docker 文档 `Differences between -v and --mount behavior`](https://docs.docker.com/storage/bind-mounts/#differences-between--v-and---mount-behavior)

```plain
If you use -v or --volume to bind-mount a file or directory that does not yet exist on the Docker host, -v creates the endpoint for you. 
It is always created as a directory.
```

**如果文件不存在, docker总会创建一个目录**

## 排查方法
添加 `-it --entrypoint bash` 进入容器查看文件是否存在

```bash
docker run -v local_file_path:docker_file_path -it --entrypoint bash docker_image
```

## 参考文档
- [How to mount a single file in a volume](https://stackoverflow.com/questions/42248198/how-to-mount-a-single-file-in-a-volume#47099098)
<br>


> **文章若有纰漏请大家补充指正,谢谢!**

> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
