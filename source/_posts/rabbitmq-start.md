---
layout: post
title: rabbitmq安装并配置
description: "按照官方文档在ubuntu上安装rabbitmq记录"
date: 2018-02-08 11:33:28
tags:
- rabbitmq
---

## 安装
[官方安装文档](https://www.rabbitmq.com/install-debian.html#apt)

### [rabbitmq 依赖 Erlang](https://www.rabbitmq.com/which-erlang.html)
```bash
wget https://packages.erlang-solutions.com/erlang-solutions_1.0_all.deb
sudo dpkg -i erlang-solutions_1.0_all.deb

sudo apt-get update
sudo apt-get install erlang
```

### Ubuntu 16.04安装rabbitmq
```bash
# add  Apt repository
echo "deb https://dl.bintray.com/rabbitmq/debian xenial main" | sudo tee /etc/apt/sources.list.d/bintray.rabbitmq.list

# add public key 
wget -O- https://dl.bintray.com/rabbitmq/Keys/rabbitmq-release-signing-key.asc | sudo apt-key add -

# update the package list
sudo apt-get update

# Install rabbitmq-server package
sudo apt-get install rabbitmq-server
```

## 配置
### [配置文件位置](https://www.rabbitmq.com/configure.html#config-location)
```plain
Generic UNIX - $RABBITMQ_HOME/etc/rabbitmq/
Debian - /etc/rabbitmq/
RPM - /etc/rabbitmq/
Mac OSX (Homebrew) - ${install_prefix}/etc/rabbitmq/, the Homebrew prefix is usually /usr/local
Windows - %APPDATA%\RabbitMQ\
```

### [`rabbitmq.conf`(*从RabbitMQ 3.7.0开始*)](https://www.rabbitmq.com/configure.html#config-file)

如果不存在 `rabbitmq.conf`, 可以手动创建一个, 使用默认配置请忽略
自己配置按照 *[官方 example](https://github.com/rabbitmq/rabbitmq-server/blob/master/docs/rabbitmq.conf.example)* 进行修改

```conf
# 修改 rabbitmq 端口
listeners.tcp.default = 2018
# 修改 rabbitmq 管理页面端口
management.listener.port = 12018
```

### 打开管理页面 
```bash
sudo rabbitmq-plugins enable rabbitmq_management
```

### 查看用户 
```bash
sudo rabbitmqctl list_users
```

### 新增管理员用户 
```bash
sudo rabbitmqctl add_user rabbitmqAdmin password
sudo rabbitmqctl set_user_tags rabbitmqAdmin administrator
```

### 限制 queue的大小
```bash
sudo rabbitmqctl set_policy --priority 1 --apply-to queues seneca seneca '{"max-length": 1000}'
```

## 启动/暂停/状态
```bash
# ubuntu 16.04
systemctl restart rabbitmq-server.service
systemctl start rabbitmq-server.service
systemctl stop rabbitmq-server.service
systemctl status rabbitmq-server.service
```


# 参考文档
[官方文档](https://www.rabbitmq.com/configure.html)  
<br>

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**

> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
