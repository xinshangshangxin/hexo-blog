title: html5 本地图片预览
date: 2015-03-24 19:06:47
tags:
- html5
---

> 在没有把图片提交到服务器之前，把图片的内容显示在客户端上
<!-- more -->

```js
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>test</title>
</head>
<body>
    <input type="file" accept="image/*" id="img"/>
    <img id="showImg" alt="待显示的图片"/>

    <script>
        window.onload = function() {
            var fileInput = document.getElementById('img');
            fileInput.addEventListener('change', function(e) {
                // 获取files
                var files = e.target.files;
                // 获取单个file
                if (files && files.length) {
                    var file = files[0];


                    // 通过 FileReader
                    var reader = new FileReader();
                    reader.onload = function(event) {
                        var image = new Image();
                        image.src = event.target.result;
                        image.width = 100;
                        document.body.appendChild(image);
                    };
                    reader.readAsDataURL(file);

                    // ----------------------------------------

                    // 通过 window.URL 工具从 file 对象生成一个可用的 URL
                    var URL = window.URL || window.webkitURL;
                    var imgURL = URL.createObjectURL(file);
                    // 显示
                    document.getElementById('showImg').src = imgURL;

                    setTimeout(function() {
                        // 使用下面这句可以在内存中释放对此 url 的伺服
                        URL.revokeObjectURL(imgURL);
                        // 再次设置无效!
                        document.getElementById('showImg').src = imgURL;
                    }, 1000);
                }
            });
        }
    </script>
</body>
</html>
```

> 调用 URL.createObjectURL 的时候，浏览器自动在内存中开辟空间，用于伺服这个 URL，也就是使得这个 URL 可以请求成功；

# 参考资料:

- [http://www.huangwenchao.com.cn/2015/03/html5-image-preview.html](http://www.huangwenchao.com.cn/2015/03/html5-image-preview.html)
- [http://www.ruanyifeng.com/blog/2012/08/file_upload.html](http://www.ruanyifeng.com/blog/2012/08/file_upload.html)


-----------------------

> ### 文章若有纰漏请大家补充指正,谢谢~~
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇
