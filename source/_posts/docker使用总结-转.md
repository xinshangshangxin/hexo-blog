title: "docker使用总结(转)"
date: 2015-06-28 13:51:56
description:  docker使用总结(转)
tags:
- docker
---

**[转载自http://weibo.com/p/1001603855970483702516](http://weibo.com/p/1001603855970483702516)**

## 安装注意
1. 不要直接用apt-get安装docker,apt-get安装的版本有些低.  
安装用`curl -sSL https://get.docker.com/ubuntu/ | sudo sh` 可以安装最新版
2. docker对linux内核版本有要求,内核版本不能太低, 如果太低会导致docker的一些功能不能使用, 比如docker exec 命令在低版本的linux内核下不能用.
> 运行linux命令uname -r 可以查看linux内核版本, docker官方文档说linux内核版本不能低于3.13
> 升级linux内核 : `sudo apt-get install linux-image-generic-lts-trusty`   

3. 高版本的linux内核不支持aufs的存储类型,建议用devicemapper存储类型

## 封装原则
1. 容器要有专职, 尽量一个容器只有一个服务,原则上说一个进程就一个容器,不要让一个容器里面有多个进程,进程越大,耦合性越大.
2. 容器内可以用supervisiod管理进程,防止进程异常退出.
3. 环境变量作为容器配置项, `Dockerfile`中可以用 `ENV` 设置环境变量, `docker run` 命令可以用 `-e` 设置环境变量.
**注意:设置的环境命令都是root用户的**. 如果想让Apache 用户也使用这些环境变量, 执行下面shell命令 
```js
env | grep JD_  | sed  "s/^/export /g" >> /etc/apache2/envvars
```
表示以`JD_ `开头的环境变量都设置为Apache的环境变量.
如果是一个纯前端的网站项目,你可以获得环境变量, 可以在index.html 中加载一个php文件: 在json.php 中获得环境变量输出.   

## docker的坑
- `--link` 链接容器. 
> 用docker自带的`--link`把多个容器链接在以前, 有重启或升级的问题, 
> 比如很多容器都依赖于 db 这个容器, 然后db容器重启了, 重启时docker分配的ip会变, 导致其他依赖于db的容器都要重启.`--link` 链接的容器还有启动顺序的问题, 需要先启动db容器再启动其他依赖于db的容器, 这样导致 `--link`和`--restart=always`不能一起用
> 如果一起用会发现宿主机重启了, docker容器并没有全部重启,因为这时候docker容器是同时被启动的,并不知道启动顺序. 最后决定不用 `--link` 链接容器了.
> 另外有两种链接容器的方法,一种是给容器设置固定ip , 这个方法比较复杂: 
另外还有一种简单的链接方式, 可以用宿主机的端口链接, 比如一个mysql容器,先设置宿主机的3306端口映射到mysql容器中. 
然后查宿主机的内网ip , 用ifconfig 查,eth0的网卡可以看见内网ip, 假设内网ip为10.128.130.175 , docker容器是可以访问这个宿主机内网ip的, 这样其他容器要链接mysql容器,链接数据库时 链接 10.128.130.175:3306 即可. 
我们可以在docker run启动容器时用 --add-host 参数为容器设置一个hosts .这样容器内代码可以用指定的域名去访问数据库, 不用关心内网ip的变化.

- pid的问题(1)
> docker容器中的进程有时会生成pid文件, 比如Apache进程会生成的pid文件为 `/var/run/apache2/apache2.pid`, 当进程启动时,这个pid文件就存在,当进程退出时,这个pid文件也会被删除, 我们把正在运行的容器用docker commit 提交为镜像时会把pid文件也提交到镜像中,这样从新镜像运行容器时,容器可能因为已经存在pid文件而无法启动. 
> 以Apache为例,可能就会报 `httpd(pid 1) ready runing` 之类的错误 , 报错告诉你httpd正在运行,但其实并没有运行只是存在pid文件而已. 
> 所以最好是用docker stop 把容器停掉, 再用docker commit 创建镜像.

- pid的问题(2)
> 还可能会出现在docker run时设置`--restart=always` 参数的时候, 设置了此参数容器退出了会自动重启, 宿主机重启了容器也能自动重启. 但是容器在重启的时候很容易pid文件存在.pid文件存在时进程会自动退出, 但又因为设置了`--restart=always` 进程退出的那一瞬间 容器又自动重启, 所以容器就在那里不断的退出再自动重启退出再自动重启. 此时 运行命令 docker ps 是能看见容器是运行中的状态. 
> 但是用 `docker exec -it container_name bash` 始终进不了容器, 会报如下错误:
```js
Cannot run exec command 0eb8e17609dd78c9137c62d94cfaa62795de161d643fc3cb00387b60f11090be in container 8837b983fe2f08f5f3b9999259d5f255a83774b19282b6f9c21a9d688f7f7f2a: No active container exists with ID 8837b983fe2f08f5f3b9999259d5f255a83774b19282b6f9c21a9d688f7f7f2a
No active container exists with ID 
```
这句的意思是说 找不到有效的容器. 但是docker ps又看见容器是在运行中, 为什么会找不到有效的容器？ 这是因为这个容器现在其实一直在不断重启中, 所以进不去.

> 解决方法, 可以在容器启动命令脚本（如 /run.sh） 中 加上一句删除pid文件的代码, 如 rm /var/run/apache2/apache2.pid 这样在启动进程之前强制删除了pid文件,就不会重复重启了.

- docker容器的hosts文件.

> 在正在运行的容器 用docker exec 进入修改 /etc/hosts 文件 ,这个容器被重启后会发现 hosts文件会被还原. 所以不要直接修改hosts文件, 需要增加hosts ,在docker run时 用 --add-host 参数.

- 虚拟目录不会提交到镜像
> Dockerfile 中 VOLUME 指定的目录 或 docker run 时 -v 参数指定的目录, 在docker commit 时不会提交到镜像中. 如果-v 参数指定的容器内的目录原本有文件, 原本的文件都会被删除, 只存在宿主机目录的文件. 

- docker容器的重启.
> 容器一个容器运行中apache 我们要重启Apache , 应该怎么重启？ 可能新手会 docker exec -it container_name bash 进入容器, 然后运行 service apache2 restart 启动Apache , 这样是不能启动apache的, 只会把容器停止掉. 因为容器的主进程就是Apache , 主进程退出时会退出容器, 在重启apache的时候 主进程先退出了, 这时候docker容器也跟着退出了,所以Apache不会重启. 要重启Apache 用docker命令: docker restart container_name 

- 退出容器的方法

> 如果是docker run 运行一个容器, 没有加 -d 参数让它后台运行, 这时候 ctrl+c 退出进程也会让容器停止, 如果先退出但不停止容器可以ctrl+p 然后 ctrl+q


## Dockerfile编写技巧

- 将Ubuntu的源设置为国内的源,这样安装软件会快很多 RUN sed -i "s/archive\.ubuntu\.com/mirrors\.163\.com/g" /etc/apt/sources.list
- RUN
> Dockerfile 中可以RUN执行系统命令创建镜像.不能用RUN命令来常驻进程. 比如不能运行 RUN gearmand -d .

- ONBUILD
> ONBUILD修饰的命令在子Dockerfile文件中也会被执行,举例说明:
一个Dockerfile中有ONBUILD命令, 如 ONBUILD ADD . /app/src , 运行 docker build -t Image_name . 创建一个名为Image_name的镜像. 另外在创建一个Dockerfile , 第一个行是 FROM Image_name 现在这个Dockerfile是继承于前一个Dockerfile的,现在这个Dockerfile在build时会执行他父Dockerfile的ONBUILD命令, 所以现在这个Dockerfile在build时也会执行 ADD . /app/src 这个命令.

- ENTRYPOINT
> 感觉 ENTRYPOINT 会比 CMD 更省资源, ENTRYPOINT 使用时用数组形式.如:
entrypoint ["/init.sh", "/usr/bin/supervisord", "-n", "-c", "/etc/supervisord.conf"]
/init.sh 是一个初始化脚本,初始化脚本内容大概为: 
```js
!/bin/bash
set -e
执行一些初始化代码
exec "$@"
```
> 最后要跟上exec "$@" ,这样才能让init.sh 脚本后的 supervisord被执行.


- .dockerignore
.dockerignore文件中列的文件不会被 ADD或COPY 指令添加到容器中.


## 好用的docker镜像

- jwilder/nginx-proxy 这是一个nginx反向代理.
> 启动nginx反向代理:

```js
docker run --name nginx -d -p 80:80 -v /var/run/docker.sock:/tmp/docker.sock -t --restart=always jwilder/nginx-proxy
```
> 再启动其他容器, 如: 

```js
docker run -e VIRTUAL_HOST=yourdomain.com -d tutum/apache-php
```
> nginx的容器会监听其他容器的启动, 并根据VIRTUAL_HOST设置域名.这样可以通过 yourdomain.com 访问刚才启动的容器中的网站了.
tutum/apache-php 这个镜像是一个好用的apache环境.

- 清理docker
```js
 docker info  // 可以查看docker的信息, /var/lib/docker/devicemapper/devicemapper 目录下存放了docker的文件, 可以用du -h --max-depth=1 看文件的大小.
```

- 删除为none的镜像,可以立马回收空间:
```js
docker images --no-trunc| grep none | awk '{print $3}' | xargs -r docker rmi  
```

- 删除退出了的容器:

```js
docker rm `docker ps -a | grep Exited | awk '{print $1 }’ 
```

- 删除没有用的镜像. （有容器运行的镜像不会被删除）:

```js
docker rmi `docker images -aq`  
```


----------

> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
