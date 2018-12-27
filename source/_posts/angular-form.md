---
title: "angular 使用 multipart/form-data 上传文件, sails.js 接收文件"
date: 2015-12-17 10:00:28
tags:
- AngularJS
- sails


---

angular multipart/form-data,  sails.js 接收文件出现取不到值
<!-- more -->




## angular 上传文件

```js
$http({
  method: 'POST',
  url: 'url',
  headers: {
    'Content-Type': undefined
  },
  transformRequest: function(data) {
    var formData = new FormData();
    angular.forEach(function(value, key){
      formData.append(key, value);
    });
    return formData;
  },
  data: {
    file: 'xxxx',
    otherData: 'xxxxx'  
  }
});
```

## sails 接收文件

```js
var fs = require('fs');
var Promise = require('bluebird');

new Promise(function(resolve, reject) {
    req.file('file').upload(function(err, newFiles) {
      if(err || !newFiles || !newFiles[0]) {
        return reject(err);
      }
      resolve(newFiles[0]);
    });
  })
  .then(function(file) {
    filePath = file.fd;
    var stream = fs.createReadStream(filePath);
    return stream;
  })
  .then(function(stream){
    // do something
  })
  .catch(function(e){
    // do something
  })
  .finally(function() {
    fs.unlink(filePath, function(err) {
      if(err) {
        sails.log.warn(err);
      }
    });
  });
```

如果仅有文件上传, 或者上传的文件较小,不会发生问题,
但是既上传文件又上传其他字段
![](/img/angularjs/form_data.png)

会导致 sails 无法取得 requestNo 的数据

故 使用 `sails` 接收  ` multipart/form-data` 时, 前端上传时文件必须放最后面

```js
var fd = new FormData();
fd.append('requestNo', data.requestNo);
// file文件必须放最后面
fd.append('file', data.file);


return $http({
    method: 'POST',
    url: 'url',
    headers: {
      'Content-Type': undefined
    },
    data: fd,
    transformRequest: angular.identity
  })
  .then(function(data) {
    return data && data.data || {};
  });
```


# 参考文档:

- [http://stackoverflow.com/questions/29764633/sails-js-form-post-not-submitting-any-data](http://stackoverflow.com/questions/29764633/sails-js-form-post-not-submitting-any-data)

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇

