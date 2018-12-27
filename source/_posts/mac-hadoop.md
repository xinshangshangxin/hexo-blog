---
layout: post
title: "[转]Mac OS X EI Capitan 下安装及配置伪分布式 Hadoop 环境"
date: 2017-04-26 12:30:23
tags:
  - Hadoop


---

转载并进行适当修改
<!-- more -->



## 预装环境变量

- [Homebrew](https://brew.sh/)

- [JDK8](http://www.oracle.com/technetwork/java/javase/downloads/index.html)

- Xcode( App Store 更新/下载)


## 配置 SSH

为了保证远程登录管理 Hadoop 及 Hadoop 节点用户共享的安全性，Hadoop 需要配置使用 SSH 协议

- 打开系统偏好设置-共享-远程登录-允许访问-所有用户

- 打开<终端>，分别输入  

```bash
ssh-keygen -t dsa -P '' -f ~/.ssh/id_dsa
cat ~/.ssh/id_dsa.pub >>~/.ssh/authorized_keys
```

- 配置好之后，输入  `ssh localhost`, 登录成功即配置完成

## 安装及配置 Hadoop  

### 安装 Hadoop   
- <终端>输入  
```bash
brew install hadoop
```

### *配置伪分布式 Hadoop*  

<br>
#### 配置 `hadoop-env.sh`  
```bash
open /usr/local/Cellar/hadoop/2.7.3/libexec/etc/hadoop/hadoop-env.sh
```

将  
> ```plain
 export HADOOP_OPTS="$HADOOP_OPTS -Djava.net.preferIPv4Stack=true"
```

修改为  
```plain
export HADOOP_OPTS="$HADOOP_OPTS -Djava.net.preferIPv4Stack=true -Djava.security.krb5.realm= -Djava.security.krb5.kdc="
```

#### 配置 `yarn-env.sh`  
```bash
oopen /usr/local/Cellar/hadoop/2.7.3/libexec/etc/hadoop/yarn-env.sh
```

添加  
```plain
YARN_OPTS="$YARN_OPTS -Djava.security.krb5.realm=OX.AC.UK -Djava.security.krb5.kdc=kdc0.ox.ac.uk:kdc1.ox.ac.uk"
```

#### 配置 `core-site.xml`  
```plain
open /usr/local/Cellar/hadoop/2.7.3/libexec/etc/hadoop/core-site.xml
```

修改为:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<!--
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License. See accompanying LICENSE file.
-->

<!-- Put site-specific property overrides in this file. -->
<configuration>
  <property>  
    <name>fs.defaultFS</name>             
    <value>hdfs://localhost:9000</value>          
  </property>
</configuration>
```

#### 配置 `hdfs-core.xml`  

```bash
open /usr/local/Cellar/hadoop/2.7.3/libexec/etc/hadoop/hdfs-site.xml
```

配置为:  
```xml
<configuration>
  <property>
       <name>dfs.replication</name>
       <value>1</value>
  </property>
</configuration>
```

#### 配置 `mapred-site.xml`  

```bash
cp /usr/local/Cellar/hadoop/2.7.3/libexec/etc/hadoop/mapred-site.xml.template /usr/local/Cellar/hadoop/2.7.3/libexec/etc/hadoop/mapred-site.xml
open /usr/local/Cellar/hadoop/2.7.3/libexec/etc/hadoop/mapred-site.xml
```

配置为:  
```xml
<configuration>
  <property>
    <name>mapreduce.framework.name</name>
    <value>yarn</value>
  </property>
  <property>
    <name>mapred.child.java.opts</name>
    <value>-Xmx4096m</value>
  </property>
</configuration>
```

#### 配置 `yarn-site.xml`

```bash
open /usr/local/Cellar/hadoop/2.7.3/libexec/etc/hadoop/yarn-site.xml
```

配置为:
```xml
<configuration>

<!-- Site specific YARN configuration properties -->
 <property>
     <name>yarn.nodemanager.aux-services</name>
     <value>mapreduce_shuffle</value>
 </property>
</configuration>
```

### 格式化 `HDFS`
```bash
rm -rf /tmp/hadoop-tanjiti
hadoop namenode -format
```

### 启动  

- 启动 `HDFS`   
```bash
/usr/local/Cellar/hadoop/2.7.3/sbin/start-dfs.sh
```

- 启动 MapReduce
```bash
/usr/local/Cellar/hadoop/2.7.3/sbin/start-yarn.sh
```

- 检查启动情况    
```bash
jps
```

> 结果  
```plain
1536
6594 NameNode
6818 SecondaryNameNode
65478 Jps
6694 DataNode
6950 ResourceManager
7051 NodeManager
1982 Launcher
15903 GradleDaemon
```

- 运行 MapReduce 自带实例  
```bash
hadoop jar /usr/local/Cellar/hadoop/2.7.3/libexec/share/hadoop/mapreduce/hadoop-mapreduce-examples-2.7.3.jar pi 2 5
```

### 可视化查看

- Cluster Status [http://localhost:8088](http://localhost:8088)
- HDFS status [http://localhost:50070](http://localhost:50070)
- secondaryNamenode [http://localhost:50090](http://localhost:50090)




# 转载
- [https://github.com/100steps/Blogs/issues/10](https://github.com/100steps/Blogs/issues/10)

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**

> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇

