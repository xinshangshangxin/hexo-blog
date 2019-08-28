---
layout: post
title: '[内网穿透] ubuntu上搭建 nps'
date: 2019-08-27 17:55:13

tags:
  - nps
  - 内网穿透
---

`nps` 服务器端和客户端, `ubuntu` 开机启动

<!-- more -->

## 服务器端

### 下载

从 [release](https://github.com/cnlh/nps/releases) 下载和服务器匹配的最新版本 到 `<nps_dir>`

### 配置

1. 假设设置端口 `8888`, 服务器 IP 为 `1.1.1.1`
2. 打开文件 `${nps_dir}/conf/nps.conf`
3. 修改

   ```bash
   http_proxy_port=8888
   https_proxy_port=
   bridge_port=8888
   web_port=8888
   public_vkey=
   web_host=1.1.1.1
   web_password=<自定义password>
   auth_key=
   auth_crypt_key=
   ```

### 开机启动

```bash
tee /lib/systemd/system/nps.service <<-'EOF'
[Unit]
Description=nps server
After=network.target
Documentation=https://github.com/cnlh/nps
[Service]
User=root
Group=root
ExecStart=<nps_dir>/nps
Restart=always
RestartSec=30s
[Install]
WantedBy=multi-user.target
EOF
```

```bash
systemctl enable nps
systemctl daemon-reload
systemctl restart nps
# 查看日志, 是否启动
journalctl -f -u nps
```

### 一键安装[脚本](http://static.xinshangshangxin.com/shell-tools/nps/nps.sh)(macos/linux)

```bash
bash -c "$(wget -O - http://static.xinshangshangxin.com/shell-tools/nps/nps.sh)"
```

## 客户端

### 下载客户端

从 [release](https://github.com/cnlh/nps/releases) 下载 `npc` 最新版本 到 `<nps_dir>`

### 无配置启动

```bash
${nps_dir}/npc -server=${server} -vkey=${vkey}
```

### 一键安装启动[脚本](http://static.xinshangshangxin.com/shell-tools/nps/npc.sh)(macos/linux)

```bash
bash -c "$(wget -O - http://static.xinshangshangxin.com/shell-tools/nps/npc.sh)"
```

# 参考文档

[nps 官方中文文档](https://github.com/cnlh/nps)  
<br>

---

> **文章若有纰漏请大家补充指正,谢谢~~**

> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG 殇
