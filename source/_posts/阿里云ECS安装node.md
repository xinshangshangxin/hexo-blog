title: 阿里云ECS安装node
date: 2015-03-03 17:54:39
description: 借了个阿里云的账号尝试安装nodejs,其实和linux一样....
tags:
- ECS
- node
---

# 安装过程

- 确认服务器有nodejs编译及依赖相关软件 *没有运行下面命令安装*

```js
yum -y install gcc gcc-c++ openssl-devel
```

- 下载Node
```js
wget http://nodejs.org/dist/v0.10.24/node-v0.10.24.tar.gz
```

- 解压Node源码包
```js
tar zxvf node-v0.10.24.tar.gz

cd node-v0.10.24
```

- 配置
```js
 ./configure --prefix=/usr/local/node
```

- 编译,安装  **编译时间较长!**
```js
 make && make install
```

- 配置Node环境
```js
vim /etc/profile
```

> 输入 `i` 进行插入 `原来的文件内容不要改~~`

```js
export NODE_HOME=/usr/local/node
export PATH=$NODE_HOME/bin:$PATH
export NODE_PATH=$NODE_HOME/lib/node_modules:$PATH
```
> 按`esc`键, 然后输入 `:wq` 回车退出

- 重启生效
```js
source /etc/profile
```

- 测试
```js
node -v && npm -v
```
> 出现 版本号正确~~~
