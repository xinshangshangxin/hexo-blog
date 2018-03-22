---
layout: post
title: 申请letsencrypt安装泛域名
description: "在VPS上申请letsencrypt泛域名, 利用阿里云dns自动申请证书并且加入nginx"
date: 2018-02-22 18:33:28
tags:
- letsencrypt
---

## 域名申请工具 [acme.sh](https://github.com/Neilpang/acme.sh)

### 下载安装 acme.sh
```bash
curl https://get.acme.sh | sh
```

### 重启 `terminal`
```bash
# 重启zsh
exec zsh -l
```

## 生成安装泛域名证书
### 申请阿里云 `Api_key` 和 `Ali_Secret` (可以按照 [acme.sh](https://github.com/Neilpang/acme.sh#7-automatic-dns-api-integration) 进行设置)
1. 访问 [https://ram.console.aliyun.com](https://ram.console.aliyun.com)
2. 左侧菜单点击 用户管理, 右上角点击创建新用户
3. 填写用户名, 点击确定, 注意保存 `AccessKeyId` 和 `AccessKeySecret`
   ![](/img/letsencrypt/001.png)  
   ![](/img/letsencrypt/002png)
4. 添加授权
   ![](/img/letsencrypt/003.png)
   ![](/img/letsencrypt/004.png)

## 申请 证书

```bash
export Ali_Key="上面申请的AccessKeyId"
export Ali_Secret="上面申请的AccessKeySecret"
# 把下面的 *.demo.com 改成 *.your.domain
acme.sh --issue --dns dns_ali -d *.demo.com --dnssleep 0
```

## 安装cert并重启nginx

```bash
# *.demo.com 改成 *.your.domain
# /etc/nginx/ssl/*.demo.com.key 和 /etc/nginx/ssl/*.demo.com.cer 改成你想要在 nginx.conf中引入配置的路径

acme.sh --install-cert -d "*.demo.com" \
--key-file       "/etc/nginx/ssl/*.demo.com.key"  \
--fullchain-file "/etc/nginx/ssl/*.demo.com.cer" \
--reloadcmd     "systemctl reload nginx"
```

## nginx.conf

```plain
server {
    server_name any-pre-domain.demo.com;
    listen 80;
    listen 443 ssl;

    # 配置你上面 --fullchain-file 的路径
    ssl_certificate /etc/nginx/ssl/*.demo.com.cer;
    # 配置你上面 --key-file 的路径
    ssl_certificate_key /etc/nginx/ssl/*.demo.com.key;

    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**

> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇


