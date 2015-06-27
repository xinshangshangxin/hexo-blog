var Folder = function(name) {
    this.name = name;
    this.parent = null;
    this.files = [];
};

Folder.prototype.add = function(file) {
    file.parent = this; // 设置父对象
    this.files.push(file);
};

Folder.prototype.scan = function() {
    console.log('开始扫描文件夹: ' + this.name);
    for (var i = 0, file, files = this.files; file = files[i++];) {
        file.scan();
    }
};


Folder.prototype.remove = function() {
    if (!this.parent) {
        return;
    }

    for (var files = this.parent.files, l = files.length - 1; l >= 0; l--) {
        var file = files[l];
        if (file === this) {
            files.splice(l, 1);
        }
    }
};

/************File*************/
var File = function(name) {
    this.name = name;
    this.parent = null;
};

File.prototype.add = function() {
    throw new Error('文件下面不能添加文件');
};

File.prototype.scan = function() {
    console.log('开始扫描文件:  ' + this.name);
};

File.prototype.remove = function() {
    if (!this.parent) {
        return;
    }

    for (var files = this.parent.files, l = files.length - 1; l >= 0; l--) {
        var file = files[l];
        if (file === this) {
            files.splice(l, 1);
        }
    }
};


var folder = new Folder('study');
var folder1 = new Folder('JavaScript');
var folder2 = new Folder('angular');

var file1 = new File('js');
var file2 = new File('ng');
var file3 = new File('设计模式');

folder1.add(file1);
folder2.add(file2);

folder.add(folder1);
folder.add(folder2);
folder.add(file3);

folder1.remove();

folder.scan();

/*
 开始扫描文件夹: study
 开始扫描文件夹: angular
 开始扫描文件:  ng
 开始扫描文件:  设计模式
 */