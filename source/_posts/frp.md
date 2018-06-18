---
layout: post
title: "[内网穿透] ubuntu上搭建frp"
description: "frp服务器端和客户端,unbutu开机启动以及作为socket5代理"
date: 2018-06-18 13:34:32
tags:
    - frp
    - 内网穿透
---

## 服务器端
**[官方中文文档, 很清晰](https://github.com/fatedier/frp/blob/master/README_zh.md)**
1. 进入 [`frp release`](https://github.com/fatedier/frp/releases) 界面, 选择对应服务器版本的版本(比如 64位的linux选择 `frp_0.20.0_linux_amd64.tar.gz`)
2. 解压 `tar zxvf frp_0.20.0_linux_amd64.tar.gz`
3. 进入 `frp_0.20.0_linux_amd64`, 编辑 `frps.ini`
```Ini
# frps.ini
[common]
bind_port = frp运行端口,需要开放防火墙
vhost_http_port = http服务端口,可以 和 bind_port 相同
```

4. 启动 `./frps -c ./frps.ini`

## 客户端
1. 进入 [`frp release`](https://github.com/fatedier/frp/releases) 界面, 选择对应客户端版本(比如 macOS选择 `frp_0.20.0_darwin_amd64.tar.gz`)
2. 解压 `tar zxvf frp_0.20.0_darwin_amd64.tar.gz`
3.  进入 `frp_0.20.0_darwin_amd64`, 编辑 `frpc.ini`
```Ini
# frpc.ini
[common]
server_addr = 上一步的服务器地址
server_port = 上一步填写的端口

[web]
type = http
local_port = 本机http服务端口
custom_domains = www.yourdomain.com
```
4. 启动`./frpc -c ./frpc.ini`
5. 将 `www.yourdomain.com` 的域名 A 记录解析到服务器地址
6. 访问 `www.yourdomain.com:${vhost_http_port}` 其中 `vhost_http_port`为上一步绑定的端口


## 自定义二级域名, 并且去除访问时的端口
**(替换 `frp.yourdomain.com` 为你自定义的二级域名 )**

1. 服务器端 `frps.ini`
```Ini
# frps.ini
[common]
bind_port = frp运行端口,需要开放防火墙
vhost_http_port = http服务端口,可以 和 bind_port 相同
subdomain_host = frp.yourdomain.com
```

2. 去除访问时需要输入端口 (`nginx` 反向代理)
```Nginx
server {
    server_name *.frp.yourdomain.com;
    listen 80;
    listen 443 ssl http2;

    ssl_certificate /etc/nginx/ssl/*.frp.yourdomain.com.cer;
    ssl_certificate_key /etc/nginx/ssl/*.frp.yourdomain.com.key;

    location / {
        # vhost_http_port 为 上面绑定的端口
        proxy_pass http://127.0.0.1:vhost_http_port;
        # 设置 host
        proxy_set_header Host $http_host;
    }
}
```

3. 客户端 `frpc.ini`
```Ini
# frpc.ini
[common]
server_addr = 上一步的服务器地址
server_port = 上一步填写的端口

[web]
type = http
local_port = 本机http服务端口
subdomain = test
```

4. 访问 `test.yourdomain.com`

## 搭建 `socket5` 代理
**注意, 以下配置均在 服务器端!!**
1. 服务器端配置 `frpc.ini`
```Ini
# frpc.ini
[common]
server_addr = 127.0.0.1
server_port = 第一步填写的端口

[plugin_socks5]
type = tcp
remote_port = 服务器端开放的一个 tcp 端口, 用于通信
plugin = socks5
plugin_user = 设置用户名
plugin_passwd = 设置密码
```

2. 启动,设置代理访问
```bash
env ALL_PROXY=socks5h://${plugin_user}:${plugin_passwd}@服务器地址:服务器开放的tcp端口 curl https://www.google.com --verbose
```


## ubuntu16 加入开机启动项
1. 添加 `/lib/systemd/system/frps.service`
```Ini
[Unit]
Description=frps
After=network.target

[Service]
TimeoutStartSec=30
ExecStart=${frps的绝对路径} -c ${frps.ini的绝对路径}
ExecStop=/bin/kill $MAINPID

[Install]
WantedBy=multi-user.target
```

2. 启用 `frps.service`
```bash
systemctl enable frps
systemctl start frps
systemctl status frps 
```

## 服务器 安装脚本

1. `frps 安装` (token认证,日志,dashboard,开机启动)
```bash
# 配置
frp_download_url="https://github.com/fatedier/frp/releases/download/v0.20.0/frp_0.20.0_linux_amd64.tar.gz"
dir="要下载 frp 存放的路径"
bind_port="frp运行端口"
host="自定义二级域名"
token="token认证访问"
log_name="日志名称"
dashboard_port="dashboard 端口"
dashboard_user=admin
dashboard_pwd=admin
# 配置结束


dir=${dir%/}
frp_tar_gz_name=${frp_download_url##*/}
frp_type=${frp_tar_gz_name%.tar.gz}

if [ -e ${dir}/${frp_type}.tar.gz ]; then
  echo "${dir}/${frp_type}.tar.gz exists, skip download"
else
  wget ${frp_download_url} -P ${dir}
fi

if [ -e ${dir}/${frp_type} ]; then
  echo "${dir}/${frp_type} exists, skip tar zxvf";
else
  cd ${dir}
  tar zxvf ${frp_type}.tar.gz
fi


function get_base(){
  local conf_str=`cat <<EOF
[common]
bind_port = ${bind_port}
vhost_http_port = ${bind_port}
subdomain_host = ${host}
log_file = ${dir}/${frp_type}/${log_name}
token = ${token}
EOF
`
  echo -e "${conf_str}";
}

function get_dashboard() {
  if [ -z "dashboard_port" ]; then
    return
  fi

  local conf_str=`cat <<EOF
dashboard_port = ${dashboard_port}
dashboard_user = ${dashboard_user}
dashboard_pwd = ${dashboard_pwd}
EOF
`
  echo -e "${conf_str}";
}


function set_frps_ini() {
  conf_str=`cat <<EOF
$(get_base)
$(get_dashboard)
EOF
`
echo -e "${conf_str}" > ${dir}/${frp_type}/frps.ini
}


function generate_service() {
  (
cat << EOF
[Unit]
Description=frps
After=network.target

[Service]
TimeoutStartSec=30
ExecStart=${dir}/${frp_type}/frps -c ${dir}/${frp_type}/frps.ini
ExecStop=/bin/kill \$MAINPID

[Install]
WantedBy=multi-user.target
EOF
) > /lib/systemd/system/frps.service
}


function set_service() {
  if [ -e "/lib/systemd/system/frps.service" ]; then
    read -r -p "/lib/systemd/system/frps.service已存在,覆盖 [N/y] " input
    if [ ${input} = "Y" -o ${input} = 'y' ]; then
      generate_service
    fi
  fi
}

function start_service() {
  systemctl enable frps
  systemctl restart frps
  systemctl status frps 
}


set_frps_ini 
set_service
start_service
```

2. `socket5 frpc 安装` (token, 代理认证, 开机自启)
```bash
# 配置
frp_type="frp文件夹, 比如 frp_0.20.0_linux_amd64"
dir="下载 frp 存放的路径"
server_addr=127.0.0.1
server_port="frps运行端口"
token="frps设置的token"
log_name="日志"
remote_port="开放的tcp, 用于socket5代理端口"
plugin_user="代理用户名"
plugin_passwd="代理端口"
# 配置结束


dir=${dir%/}
log_file="${dir}/${frp_type}/${log_name}"

if [ ! -e ${dir}/${frp_type} ]; then
  echo "${dir}/${frp_type} not exists; please run frps.sh first";
  exit 1
fi

(
cat <<EOF
[common]
server_addr = ${server_addr}
server_port = ${server_port}
token = ${token}
log_file = ${log_file}

[plugin_socks5]
type = tcp
remote_port = ${remote_port}
plugin = socks5
plugin_user = ${plugin_user}
plugin_passwd = ${plugin_passwd}
use_encryption = true
use_compression = true
EOF
) >  ${dir}/${frp_type}/frpc.ini


function generate_service() {
  (
cat << EOF
[Unit]
Description=frpc
After=network.target

[Service]
TimeoutStartSec=30
ExecStart=${dir}/${frp_type}/frpc -c ${dir}/${frp_type}/frpc.ini
ExecStop=/bin/kill \$MAINPID

[Install]
WantedBy=multi-user.target
EOF
) > /lib/systemd/system/frpc.service
}

function set_service() {
  if [ -e "/lib/systemd/system/frpc.service" ]; then
    read -r -p "/lib/systemd/system/frpc.service已存在,覆盖 [N/y] " input
    if [ ${input} = "Y" -o ${input} = 'y' ]; then
      generate_service
    fi
  fi
}

function start_service() {
  systemctl enable frpc
  systemctl restart frpc
  systemctl status frpc 
}

set_service
start_service
```

# 参考文档
[frp官方中文文档](https://github.com/fatedier/frp/blob/master/README_zh.md)  
<br>

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**

> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
