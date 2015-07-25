title: "Docker学习笔记(2)"
date: 2015-06-19 19:58:28
description: Docker学习笔记[私有registry, 配置多台容器, Jenkins]
tags:
- docker
---

## docker 私有registry

- 启动 registry
```js
docker run -d -p 5000:5000 --name registry registry:0.9.1
```

- 镜像打tag
**docker tag IMAGE[:TAG] [REGISTRY:HOST/][USERNAME/]NAME[:TAG]**
```js
docker tag ubuntu/ubuntu:14.04 10.221.238.100:5000/ubuntu/ubuntu:14.04
```

- push到Registry：


**可能遇到 无法push image到私有仓库**
> 编辑 /etc/default/docker
```js
DOCKER_OPTS="--insecure-registry ip地址:端口号"
```
> service docker restart


## 配置多台容器
- `docker-compose.yml`

```js
mysql:
   image: mysql:5.5
   ports:
     - "3306:3306"
   volumes:
     - /var/lib/docker/vfs/dir/dataxc:/var/lib/mysql
   hostname: mydb.server.com

tomcat:
   image: tomcat:7.0.55
   ports:
      - "8080:8080"
   links:
      - mysql:db
   environment:
      - TOMCAT_USER=admin
      - TOMCAT_PASS=admin
   hostname: tomcat.server.com
```

- 启动多个容器
`docker-compose up -d`

- 停止多个容器
`docker-compose stop`

- 查看容器
`docker-compose ps`

- 删除多个容器
`docker-compose rm`


## Jenkins

`docker create` 只创建容器，不启动

> 安装[http://pkg.jenkins-ci.org/debian/](http://pkg.jenkins-ci.org/debian/)

> 启动

```js
docker run -d -p 8080:8080 --name jenkins -v /usr/bin/docker:/usr/bin/docker -v /var/run/docker.sock:/var/run/docker.sock jenkins
```
**遇到`dial unix /var/run/docker.sock: permission denied.`解决办法:**
```js
sudo service docker stop
sudo rm -rf /var/run/docker.sock/
(docker.sock had somehow been created as a directory - not sure how)
sudo service docker start
sudo chmod 777 /var/run/docker.sock

然后再启动
```

### 默认jenkins不安装git
#### 直接安装
>系统管理"->"管理插件"中找到"可选插件"选项卡,左上角的过滤搜索窗口中可以用输入Git来查找。
选择git plugin，jenkins会自动为我们添加其依赖的插件

#### 手动安装
>系统管理"->"管理插件"中找到"高级", 然后去 [http://updates.jenkins-ci.org/download/plugins](http://updates.jenkins-ci.org/download/plugins) 下载 `credentials.hpi` `git-client.hpi` `scm-api.hpi` `git.hpi`, 并依次安装,最后记得重启jenkins

```js
REGISTRY_URL=10.221.238.100:5000
cp /root/apache-maven-3.3.3-bin.tar.gz $WORKSPACE/maven
docker build -t csphere/maven:3.3.3 $WORKSPACE/maven
if docker ps -a | grep -i maven ; then
   docker rm -f maven
fi
docker create --name maven csphere/maven3.3.3
docker cp maven:/hello/target/hello.war $WORKSPACE/hello
docker build -t $REGSITRY_URL/csphere/hello:1.0 $WORKSPACE/hello
docker push $REGSITRY_URL/csphere/hello:1.0
if docker ps -a | gerp -i hello; then
   docker rm -f hello
fi
docker run -d -p 80:8080 --name hello $REGSITRY_URL/csphere/hello:1.0
```


# 参考文档
- [http://stackoverflow.com/questions/26710153/remote-access-to-a-private-docker-registry](http://stackoverflow.com/questions/26710153/remote-access-to-a-private-docker-registry)
- [https://discuss.csphere.cn/](https://discuss.csphere.cn/)
- [http://blog.csdn.net/disappearedgod/article/details/43406019](http://blog.csdn.net/disappearedgod/article/details/43406019)
- [git插件下载地址](http://updates.jenkins-ci.org/download/plugins)
- [http://blog.csdn.net/csfreebird/article/details/7899629](http://blog.csdn.net/csfreebird/article/details/7899629)
- [dial unix /var/run/docker.sock: permission denied解决办法](https://github.com/gliderlabs/registrator/issues/35#issuecomment-101493655)

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
