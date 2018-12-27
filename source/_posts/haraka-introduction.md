---

layout: post
title: haraka收发邮件初级教程
date: 2018-02-04 13:47:16
tags:
- haraka


---

haraka没有开箱即用, 需要一番配置, 本文简单介绍了如何使用haraka和qq邮箱通讯
<!-- more -->



# 安装并初始化
## 需要有自定义域名和修改域名解析的权限
*本地测试接收邮件可以不使用自定义域名, 外网接收邮件, 本地/外网发送邮件都需要设置域名解析 MX 设置*
## 全局安装haraka
```bash
# 注意 H 为大写
npm install -g Haraka
```

## 生成配置文件
```bash
# ~/.haraka 为配置文件目录, 自行更改
haraka -i ~/.haraka
```

## 启动测试
```bash
# 因为需要监听25端口, 部分账户需要sudo,   ~/.haraka为配置目录
haraka -c ~/.haraka
```

## 安装测试工具 `swaks` (非必须, 但是安装后测试方便)
```js
apt -y install swaks
```

# 接受邮件配置
## 进入配置文件夹
```bash
cd ~/.haraka/config
```

## 修改日志level, 方便查看错误
`vim log.ini`, 将 level 改成debug, 保存并退出
```bash
level=debug
```

## 修改QUEUE配置为 `test_queue`
`vim plugins`, 注释 `queue/smtp_forward`, 添加 `test_queue`, 使用之后,接收到的邮件内容会写入`/tmp/mail.eml`文件
```bash
# QUEUE
# queues: discard  qmail-queue  quarantine  smtp_forward  smtp_proxy
# Queue mail via smtp - see config/smtp_forward.ini for where your mail goes
# queue/smtp_forward
test_queue
```
![](/img/haraka/1.png)


## 修改 `host_list`, 设置允许接受哪些后缀的 email 地址, 将你的域名填入
`vim host_list`, 添加你的域名, 比如 `example.com`
```bash
# 第一行是原来的host
example.com
```

## 测试接受邮件
### a) 使用 `swaks` 测试接受邮件 (如果有域名, 可看下一步, 直接用外网域名测试)
下面命令中`-t to@example.com` 为本地接受地址, 域名后缀需要在`host_list`中存在  `-s localhost`为指定使用本地服务
```bash
swaks -f from@qq.com -t to@example.com -s localhost
```
查看是否收到邮件: `cat /tmp/mail.eml`
![](/img/haraka/2.png)


### b) 配置MX记录,接收外部邮件 (如果没有域名, 请看上一步)
1. 将 MX 解析到安装 `Haraka` 的服务器, 以下为阿里云解析设置, 其它请自行谷歌配置
![](/img/haraka/3.png)
![](/img/haraka/4.png)
2. 把你的域名地址写入到 `host_list` (上面已经做过了)
3. `haraka -c ~/.haraka` 启动服务
4. 使用qq邮箱发送邮件
![](/img/haraka/5.png)
5. 查看是否收到邮件 `cat /tmp/mail.eml`
如下图对 `suLK1CBoYXJha2Eg1f3OxA==` 使用GBK的base64解密后为`测试 haraka 正文`. 解密地址  [https://1024tools.com/base64](https://1024tools.com/base64)

![](/img/haraka/7.png)
![](/img/haraka/8.png)

# 发送邮件配置 (必须有域名和 `MX` 记录)
## 配置 `MX` 记录 (上面已经做过了), 进入配置目录 `cd ~/.haraka/config`
## 启用 `auth/flat_file` 配置
`vim plugins`, 放开 `auth/flat_file` 的注释
![](/img/haraka/9.png)
## 添加 `auth_flat_file` 配置文件
`vim auth_flat_file.ini`(新建文件), 其中 `users` 为配置用户名和密码
```bash
[core]
methods=PLAIN,LOGIN
[users]
username=password
```
## 启动haraka服务
`haraka -c ~/.haraka`
## 使用 `swaks` 测试发送邮件
其中`from@example.com`改成你域名后缀, `to@qq.com`改成你要接收的地址, `-s localhost`使用本地服务
```js
swaks -f from@example.com -t to@qq.com -au username -ap password -s localhost
```
## 指定非localhost地址发送邮件
因为 `auth/flat_file` 针对 `localhost` 地址会忽略 `TLS` 要求, 当指定server后会发送失败, 从日志中可以看到 `[auth/flat_file] Auth disabled for insecure public connection`

```bash
# 指定sever 发送
swaks -f from@example.com -t to@qq.com -au username -ap password -s example.com
```
## 新建 plugin 忽略 `TSL` 要求
### 创建 新plugin
```bash
haraka -c ~/.haraka -p auth/insecure_flat_file
```
### 复制 `flat_file` 并修改成忽略TSL 要求
将[原来flat_file.js](https://github.com/haraka/Haraka/blob/bfa2156f961da0988c5e05b2e3c5582511e11b4d/plugins/auth/flat_file.js#L19), 注释掉如图所示的这一行, 然后将内容写入 `insecure_flat_file.js`
![](/img/haraka/10.png)
`vim ~/.haraka/plugins/auth/insecure_flat_file.js`
```js
// Auth against a flat file

exports.register = function () {
    const plugin = this;
    plugin.inherits('auth/auth_base');
    plugin.load_flat_ini();
};

exports.load_flat_ini = function () {
    const plugin = this;
    plugin.cfg = plugin.config.get('auth_flat_file.ini', function () {
        plugin.load_flat_ini();
    });
};

exports.hook_capabilities = function (next, connection) {
    const plugin = this;
    // don't allow AUTH unless private IP or encrypted
    if (!connection.remote.is_private && !connection.tls.enabled) {
        connection.logdebug(plugin,"Auth continue, but insecure public connection");
    }

    let methods = null;
    if (plugin.cfg.core && plugin.cfg.core.methods ) {
        methods = plugin.cfg.core.methods.split(',');
    }
    if (methods && methods.length > 0) {
        connection.capabilities.push('AUTH ' + methods.join(' '));
        connection.notes.allowed_auth_methods = methods;
    }
    next();
};

exports.get_plain_passwd = function (user, connection, cb) {
    const plugin = this;
    if (plugin.cfg.users[user]) {
        return cb(plugin.cfg.users[user].toString());
    }
    return cb();
};
```

### 修改 plugins, 使用 insecure_flat_file
`vim ~/.haraka/config/plugins`, 添加`auth/insecure_flat_file`
```js
# AUTH plugins require TLS before AUTH is advertised, see
#     https://github.com/haraka/Haraka/wiki/Require-SSL-TLS
# auth/flat_file
# auth/auth_proxy
# auth/auth_ldap
auth/insecure_flat_file
```
### 启动haraka服务 并测试
```js
haraka -c ~/.haraka
swaks -f from@example.com -t to@qq.com -au username -ap password -s example.com
```



# 参考文档
- [Creating Your Own E-Mail service with Haraka](https://thihara.github.io/Creating-E-Mail-Service-with-Haraka/)
- [官方文档](https://haraka.github.io/README.html)
- [官方视频](https://www.youtube.com/watch?v=6twKXMAsPsw&feature=youtu.be)


-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**

> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇

