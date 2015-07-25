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
                        } else {
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
        } else {
            changeContext(userPath);
        }
    });
}


function changeContext(filename) {
    var index = 0;
    var hasChange = false;
    var arr = [];
    eachLine(filename, function(line) {
        if (/^```.*/.test(line)) {
            index++;
            if (/^```\s*$/.test(line)) {
                if (index % 2 === 1) {
                    hasChange = true;
                    line = '```' + codeStyle;
                }
            }
        }
        arr.push(line);
    }).then(function() {
        if (hasChange) {
            fs.writeFile(filename, arr.join('\n') + '\n', function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('修改 ' + filename + ' 成功~');
                }
            });
        } else {
            //console.log(filename + ' 无需修改~');
        }
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
                } else {
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
                } else {
                    throw new Error('No more lines to read.');
                }
            } else {
                readToSeparator(getLine);
            }
        } else {
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
            } else {
                finish();
            }
        }

        function continueCb(continueReading) {
            if (continueReading !== false) {
                newRead();
            } else {
                finish();
                reader.close();
            }
        }

        function readNext() {
            reader.nextLine(function(line) {
                var last = !reader.hasNextLine();

                if (asyncCb) {
                    cb(line, last, continueCb);
                } else {
                    if (cb(line, last) !== false) {
                        newRead();
                    } else {
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
