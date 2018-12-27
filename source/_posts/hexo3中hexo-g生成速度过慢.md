---
title: hexo3中hexo g生成速度过慢
date: 2015-06-29 14:05:37
tags:
- hexo


---

hexo g 时间过长
<!-- more -->



## 原因
```plain
Hexo 3 中的 highlight.js 会试图分析 `` ` 中的代码内容可能属于哪种语言,内容越长,分析时间就越长

在Hexo 2 自带的语法高亮插件 highlight.js 在遇到没有语言说明的代码时是统一当成纯文本
```

## 解决办法:
在没有语言说明符的代码段后面加上 类似`js` 的说明符;

考虑到有很多md文件,所以拿node.js写了自动修改 [hexo3_speed_up](https://gist.github.com/xinshangshangxin/2fa9cecf2423185bcb3a)

## 使用说明
```plain
node speed_up.js [md文件夹(source/_posts)或文件路径(默认为当前文件夹)] [说明符(默认为js)]
```


```js
var fs = require('fs');
var path = require('path');

var userPath = path.resolve(process.argv[2] || './');
var codeStyle = process.argv[3] || 'js';

explorer(userPath);
function explorer(path) {
    fs.stat(path, function(err, stat) {
        if (err) {
            console.log(err);
            return;
        }
        if (stat.isDirectory()) {
            fs.readdir(path, function(err, files) {
                //err 为错误 , files 文件名列表包含文件夹与文件
                if (err) {
                    console.log('error:\n' + err);
                    return;
                }
                files.forEach(function(file) {
                    fs.stat(path + '/' + file, function(err, stat) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        if (stat.isDirectory()) {
                            // 如果是文件夹遍历
                            explorer(path + '/' + file);
                        }
                        else {
                            // 读出所有的文件
                            var fileName = path + '/' + file;
                            if (/.*\.md$/.test(fileName) && !/node_modules/.test(fileName)) {
                                //console.log(fileName);
                                changeContext(fileName);
                            }
                        }
                    });
                });
            });
        }
        else {
            changeContext(userPath);
        }
    });
}


function changeContext(filename) {
    var index = 0;
    var arr = [];
    eachLine(filename, function(line) {
        if (/```.*/.test(line)) {
            index++;
            if (/```\s*$/.test(line)) {
                if (index % 2 === 1) {
                    line = '```' + codeStyle;
                }
            }
        }
        arr.push(line);
    }).then(function() {
        fs.writeFile(filename, arr.join('\n') + '\n', function(err) {
            if (err) {
                console.log(err);
            }
            else {
                console.log('修改 ' + filename + ' 成功~');
            }
        });
    });
}


/*****以下代码来自 https://github.com/nickewing/line-reader/blob/master/lib/line_reader.js*****/
// 这样 就不需要 安装 node_modules了
var StringDecoder = require('string_decoder').StringDecoder;

function LineReader(fd, cb, separator, encoding, bufferSize) {
    var filePosition = 0,
        encoding = encoding || 'utf8',
        separator = separator || '\n',
        bufferSize = bufferSize || 1024,
        buffer = new Buffer(bufferSize),
        bufferStr = '',
        decoder = new StringDecoder(encoding),
        closed = false,
        eof = false,
        separatorIndex = -1;

    function close() {
        if (!closed) {
            fs.close(fd, function(err) {
                if (err) {
                    throw err;
                }
            });
            closed = true;
        }
    }

    function readToSeparator(cb) {
        function readChunk() {
            fs.read(fd, buffer, 0, bufferSize, filePosition, function(err, bytesRead) {
                var separatorAtEnd;

                if (err) {
                    throw err;
                }

                if (bytesRead < bufferSize) {
                    eof = true;
                    close();
                }

                filePosition += bytesRead;

                bufferStr += decoder.write(buffer.slice(0, bytesRead));

                if (separatorIndex < 0) {
                    separatorIndex = bufferStr.indexOf(separator);
                }

                separatorAtEnd = separatorIndex === bufferStr.length - 1;
                if (bytesRead && (separatorIndex === -1 || separatorAtEnd) && !eof) {
                    readChunk();
                }
                else {
                    cb();
                }
            });
        }

        readChunk();
    }

    function hasNextLine() {
        return bufferStr.length > 0 || !eof;
    }

    function nextLine(cb) {
        function getLine() {
            var ret = bufferStr.substring(0, separatorIndex);

            bufferStr = bufferStr.substring(separatorIndex + separator.length);
            separatorIndex = -1;
            cb(ret);
        }

        if (separatorIndex < 0) {
            separatorIndex = bufferStr.indexOf(separator);
        }

        if (separatorIndex < 0) {
            if (eof) {
                if (hasNextLine()) {
                    separatorIndex = bufferStr.length;
                    getLine();
                }
                else {
                    throw new Error('No more lines to read.');
                }
            }
            else {
                readToSeparator(getLine);
            }
        }
        else {
            getLine();
        }
    }

    this.hasNextLine = hasNextLine;
    this.nextLine = nextLine;
    this.close = close;

    readToSeparator(cb);
}

function open(filename, cb, separator, encoding, bufferSize) {
    fs.open(filename, 'r', parseInt('666', 8), function(err, fd) {
        var reader;
        if (err) {
            throw err;
        }

        reader = new LineReader(fd, function() {
            cb(reader);
        }, separator, encoding, bufferSize);
    });
}

function eachLine(filename, cb, separator, encoding, bufferSize) {
    var finalFn,
        asyncCb = cb.length == 3;

    function finish() {
        if (finalFn && typeof finalFn === 'function') {
            finalFn();
        }
    }

    open(filename, function(reader) {
        function newRead() {
            if (reader.hasNextLine()) {
                setImmediate(readNext);
            }
            else {
                finish();
            }
        }

        function continueCb(continueReading) {
            if (continueReading !== false) {
                newRead();
            }
            else {
                finish();
                reader.close();
            }
        }

        function readNext() {
            reader.nextLine(function(line) {
                var last = !reader.hasNextLine();

                if (asyncCb) {
                    cb(line, last, continueCb);
                }
                else {
                    if (cb(line, last) !== false) {
                        newRead();
                    }
                    else {
                        finish();
                        reader.close();
                    }
                }
            });
        }

        newRead();
    }, separator, encoding, bufferSize);

    return {
        then: function(cb) {
            finalFn = cb;
        }
    };
}
```




# 参考文档
- [http://hahack.com/codes/hexo-3-speed-up/](http://hahack.com/codes/hexo-3-speed-up/)

-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇

