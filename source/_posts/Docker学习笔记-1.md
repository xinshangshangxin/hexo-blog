title: "Docker学习笔记(1)"
date: 2015-06-06 16:07:23
description:  Docker学习笔记
tags:
- docker
---


`FROM` 基础镜像
`MAINTAINER` 维护者
`ENV` 环境变量

> docker 复制文件 ADD COPY

`ADD` 可以获取网络地址以及解压功能
`COPY` 本地文件

`RUN` 运行指令,每运行一条指令增加一层

`EXPOSE 22`   container暴露22端口

`ENTRYPOINT` 镜像启动后自动执行的命令



`build`  使用docker file生成docker镜像
// -t 起名字                   
// dockerfile_path如果为当前目录为则 ( . )
`docker build -t [registry_url/namespace/csphere/centos:7.1] [dockerfile_path]`

`docker images` 查看镜像信息
`docker rmi ` 删除镜像
`docker images -q` 批量删除镜像
`docker run image_name`      用镜像 运行一个 container

```js
docker run -it：交互式 
           -d：后端启动, 然后返回container的Id号 
           -p 2222:22 端口映射
           -P 22 随机取未使用端口映射22端口
           --name 指定容器名称
           -v host_dir:conatiner_dir 文件映射
           --rm 容器退出就删除
           -e 传入环境参数可指定多次
```


```js
docker run -d -p 80:80 --name wordpress -e WORDPRESS_DB_HOST=10.51.85.74 -e WORDPRESS_DB_USER=admin
```

`docker ps`  查看运行容器
`docker ps -a` 查看所有容器

`ONBUILD`  在下一个基于本镜像是执行的命令

`docker exec -it container_name` 交互式模式进入container
`docker exec -it testNode /bin/bash`

`VOLUME` 宿主机目录映射container目录
`VOLUME ["/var/lib/mysql"]`

`docker rm` 删除容器
`docker rm -f` 强制移除容器
`docker ps -a -q` 批量删除容器

`docker stop container_id` 停止容器

使用原有数据库，重新挂在到容器。按照原有命令即可挂载
`docker run -d -p 3306:3306 --name newdb -v /var/lib/docker/vfs/dir/mydata:/var/lib/mysql mysql:5.5`

`.dockerignore 文件` 排除某些文件拷贝

`ENTRYPOINT ["EXECUTEABLE", "param1", "param2"]`

- `CMD ["EXECUTEABLE", "param1", "param2"]`
- `CMD ["param1", "param2"]`  为ENTRYPOINT指定参数
- `CMD command param1 param2`    以"bin/sh -c"方法执行命令


> CMD指令 可覆盖

`CMD["/bin/echo","This is test cmd"]`           执行/bin/echo
`docker run -it sphere/cmd:0.1 /bin/bash`       /bin/bash 覆盖 /bin/echo

ENTRYPOINT 覆盖指令需要通过 --entrypoint=来替换，方便调试错误的ENTRYPOINT指令


----------


> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇




