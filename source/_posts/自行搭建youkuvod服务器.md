title: 自行搭建youkuvod服务器
date: 2015-02-20 13:54:26
description: 由于azure服务器到期,转至coding.net,自行搭建youkuvod服务器环境可提高速度
tags:
- js
- youkuvod
---


# 注意事项

1. 菜鸟作品, 大神请略过
2. 直接可用脚本[greasyfork-youkuvod](https://greasyfork.org/zh-CN/scripts/2837-youkuvod)
3. 担心服务器垮掉才出现本文
1. 搭建后默认只能使用硕鼠解析;飞驴解析需要申请token
2. 请正确使用coding.net提供的空间,不要浪费.....


# 使用coding.net搭建服务器
- 申请账号: [https://coding.net/register](https://coding.net/register)
- 新建项目
![youkuvod](/img/youkuvod/1.png)

> 填写地址 `https://github.com/xinshangshangxin/youkuvod.git`

![youkuvod](/img/youkuvod/2.png)

> 点击创建后等待

![youkuvod](/img/youkuvod/3.png)

> 点击演示按钮

![youkuvod](/img/youkuvod/4.png)
![youkuvod](/img/youkuvod/5.png)
![youkuvod](/img/youkuvod/6.png)
![youkuvod](/img/youkuvod/7.png)

> 点击 一键部署后等待; 如果等待时间 过长; 请点击按钮 `重启`
> 出现如图所示部署成功

![youkuvod](/img/youkuvod/9.png)

> **[可略过此步]** 默认只开启硕鼠解析;飞驴解析需要申请 token; 请到[飞驴](https://www.flvxz.com/docs.php?doc=api)申请
> 飞驴token设置点击左侧`环境变量` 

![youkuvod](/img/youkuvod/8.png)

> **添加脚本** 
> chrome 需要 [Tampermonkey](https://chrome.google.com/extensions/detail/dhdgffkkebhmkfjojejmpbldmpobfkfo);如果无法打开网址,请自行百度
> firefox 请自行寻找,IE 再见~~
>> 可以直接添加 [greasyfork](https://greasyfork.org/zh-CN/scripts/2837-youkuvod)的脚本修改
>> 也可以复制[coding.net](https://coding.net/u/youkuvod/p/youkuvod/git/raw/master/index.js) 新建脚本  
> 方法如图:

![youkuvod](/img/youkuvod/12.png)


> **修改脚本**

![youkuvod](/img/youkuvod/11.png)


> 打开优酷, 进行测试; 
> 出现优酷页面设置(如图) 成功!!

![youkuvod](/img/youkuvod/10.png)



