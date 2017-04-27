layout: post
title: "mac运行hadoop出现 Error: Java heap space"
description: "mac 运行hadoop出现 Error: Java heap space"
date: 2017-04-27 16:51:38
tags:
 - Hadoop
---

## 问题:

`Error: Java heap space`  

![hadoop](/img/hadoop/1.png)

## 解决方案:

- 编辑文件 `/usr/local/Cellar/hadoop/2.7.3/libexec/etc/hadoop/mapred-site.xml` 添加 `Xmx4096m`

```xml
<configuration>
  <property>
    <name>mapred.child.java.opts</name>
    <value>-Xmx4096m</value>
  </property>
</configuration>
```

- 或者在运行hadoop之前 `export HADOOP_OPTS="-Xmx4096m"`

- 或者对Hadoop 2+, 修改 `mapreduce.map.java.opts`
 
 
 # 参考文档
 - [http://stackoverflow.com/questions/15609909/error-java-heap-space?answertab=active#tab-top](http://stackoverflow.com/questions/15609909/error-java-heap-space?answertab=active#tab-top)
 
 -----------------------
 
 > **文章若有纰漏请大家补充指正,谢谢~~**
 
 > [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
