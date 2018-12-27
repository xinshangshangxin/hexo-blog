---
title: '[转]MongoDB命令行操作'
date: 2015-08-18 18:15:54
tags:
- mongodb


---

MongoDB命令行操作
<!-- more -->



2.1 查看服务器上的数据库  
> show dbs  

2.2 切换数据库  
切换到temp数据库(从默认的test数据库)  
> use temp  


2.3 查看当前数据库中的所有集合  
> show collections  
 
  
2.4 创建数据库  

**mongo中创建数据库采用的也是use命令，如果use后面跟的数据库名不存在，那么mongo将会新建该数据库。不过，实际上只执行use命令后，mongo是不会新建该数据库的，直到你像该数据库中插入了数据**
> use test2 

`switched to db test2`
> show dbs  

`到这里并没有看到刚才新建的test2数据库`
> db.hello.insert({"name":"testdb"})
  
`该操作会在test2数据库中新建一个hello集合，并在其中插入一条记录。  `

> show dbs 
 
```js
test    (empty)  
test2   0.203125GB  
```
> show collections  

```js
hello  
system.indexes  
```
`这样，便可以看到mongo的确创建了test2数据库，其中有一个hello集合。 ` 
  
2.5 删除数据库  
> db.dropDatabase()  

```js
{ "dropped" : "test2", "ok" : 1 }  
```
  
2.6 查看当前数据库  
> db   

`test2`
`可以看出删除test2数据库之后，当前的db还是指向它，只有当切换数据库之后，test2才会彻底消失` 

3.1 新建collection  
> db.createCollection("Hello")  

```js
{ "ok" : 1 }  
```

> show collections  

```js
Hello  
system.indexes  
从上面2.4也可以看出，直接向一个不存在的collection中插入数据也能创建一个collection。  
```

> db.hello2.insert({"name":"lfqy"})  
> show collections   

```js
Hello  
hello2  
system.indexes  
```

3.2 删除collection  

> db.Hello.drop()  

```js
true  
返回true说明删除成功，false说明没有删除成功。  
```

> db.hello.drop()  

```js
false  
不存在名为hello的collection，因此，删除失败。  
```
  
3.3 重命名collection  

`将hello2集合重命名为HELLO`
> show collections  

```js
hello2  
system.indexes  
```
> db.hello2.renameCollection("HELLO")  

```js
{ "ok" : 1 }  
```
> show collections  

```js
HELLO  
system.indexes  
```
  
3.4 查看当前数据库中的所有collection 
 
> show collections  
  
3.5 索引操作  
`在HELLO集合上，建立对ID字段的索引，1代表升序`

> db.HELLO.ensureIndex({ID:1})  

```js
在HELLO集合上，建立对ID字段、Name字段和Gender字段建立索引  
```
> db.HELLO.ensureIndex({ID:1,Name:1,Gender:-1})  
```js
查看HELLO集合上的所有索引  
```

> db.HELLO.getIndexes()  

```js
删除索引用db.collection.dropIndex()，有一个参数，可以是建立索引时指定的字段，也可以是getIndex看到的索引名称。  
```
> db.HELLO.dropIndex( "IDIdx" )  
> db.HELLO.dropIndex({ID:1})  
  
3.6 为集合中的每一条记录添加一个字段  
`为user集合中的每一条记录添加一个名为ex的字段，并赋值为barrymore`

> db.user.update({},{$set:{"ex":"barrymore"}},false,true)  
  
3.7 重命名字段  
`将集合中的所有记录的gender字段的名字修改为sex  `

> db.user.update({},{$rename:{"gender":"sex"}},false,true)  
  
3.8 删除字段  
`删除集合中所有记录的ex字段  `
> db.user.update({},{"$unset":{"ex":1}},false,true)  


4.1 向user集合中插入两条记录  

> db.user.insert({'name':'Gal Gadot','gender':'female','age':28,'salary':11000})  
> db.user.insert({'name':'Mikie Hara','gender':'female','age':26,'salary':7000})  
  
4.2 同样也可以用save完成类似的插入操作  
> db.user.save({'name':'Wentworth Earl Miller','gender':'male','age':41,'salary':33000})

5.1 查找集合中的所有记录
> db.user.find()  

5.2 查找集合中的符合条件的记录

5.2.1 单一条件  
5.2.1.1 Exact Equal:  
`查询age为了23的数据  `
> db.user.find({"age":23})  

```js
{ "_id" : ObjectId("52442736d8947fb501000001"), "name" : "lfqy", "gender" : "male", "age" : 23, "salary" : 15 }  
```
5.2.1.2 Great Than:  

`查询salary大于5000的数据`

> db.user.find({salary:{$gt:5000}})  

```js
{ "_id" : ObjectId("52453cfb25e437dfea8fd4f4"), "name" : "Gal Gadot", "gender" : "female", "age" : 28, "salary" : 11000 }  
{ "_id" : ObjectId("52453d8525e437dfea8fd4f5"), "name" : "Mikie Hara", "gender" : "female", "age" : 26, "salary" : 7000 }  
{ "_id" : ObjectId("52453e2125e437dfea8fd4f6"), "name" : "Wentworth Earl Miller", "gender" : "male", "age" : 41, "salary" : 33000 }
```  

5.2.1.3 Fuzzy Match  
`查询name中包含'a'的数据`


> db.user.find({name:/a/})  

```js
{ "_id" : ObjectId("52453cfb25e437dfea8fd4f4"), "name" : "Gal Gadot", "gender" : "female", "age" : 28, "salary" : 11000 }  
{ "_id" : ObjectId("52453d8525e437dfea8fd4f5"), "name" : "Mikie Hara", "gender" : "female", "age" : 26, "salary" : 7000 }  
{ "_id" : ObjectId("52453e2125e437dfea8fd4f6"), "name" : "Wentworth Earl Miller", "gender" : "male", "age" : 41, "salary" : 33000 }  
```

`查询name以G打头的数据`
> db.user.find({name:/^G/})  

```js
{ "_id" : ObjectId("52453cfb25e437dfea8fd4f4"), "name" : "Gal Gadot", "gender" : "female", "age" : 28, "salary" : 11000 }  
```
  
5.2.2 多条件"与"  
`查询age小于30，salary大于6000的数据`

> db.user.find({age:{$lt:30},salary:{$gt:6000}})  


```js
{ "_id" : ObjectId("52453cfb25e437dfea8fd4f4"), "name" : "Gal Gadot", "gender" : "female", "age" : 28, "salary" : 11000 }  
{ "_id" : ObjectId("52453d8525e437dfea8fd4f5"), "name" : "Mikie Hara", "gender" : "female", "age" : 26, "salary" : 7000 }  
{ "_id" : ObjectId("52454155d8947fb70d000000"), "name" : "not known", "sex_orientation" : "male", "age" : 13, "salary" : 30000 }  
```
  
5.2.3 多条件"或"  
`查询age小于25，或者salary大于10000的记录`

> db.user.find({$or:[{salary:{$gt:10000}},{age:{$lt:25}}]})  

```js
{ "_id" : ObjectId("52442736d8947fb501000001"), "name" : "lfqy", "gender" : "male", "age" : 23, "salary" : 15 }  
{ "_id" : ObjectId("52453cfb25e437dfea8fd4f4"), "name" : "Gal Gadot", "gender" : "female", "age" : 28, "salary" : 11000 }  
{ "_id" : ObjectId("52453e2125e437dfea8fd4f6"), "name" : "Wentworth Earl Miller", "gender" : "male", "age" : 41, "salary" : 33000 }  
{ "_id" : ObjectId("52454155d8947fb70d000000"), "name" : "not known", "sex_orientation" : "male", "age" : 13, "salary" : 30000 }  
```

5.2.4不等于查询  
`查询年龄不等于23的记录(这里返回结果中，会包含没有年龄字段的记录)`

> db.user.find({"age":{ $ne: 23}})  

```js
{ "_id" : ObjectId("52453cfb25e437dfea8fd4f4"), "name" : "Gal Gadot", "gender" : "female", "age" : 28, "salary" : 11050 }  
{ "_id" : ObjectId("52453d8525e437dfea8fd4f5"), "name" : "Mikie Hara", "gender" : "female", "age" : 26, "salary" : 7050 }  
{ "_id" : ObjectId("52453e2125e437dfea8fd4f6"), "name" : "Wentworth Earl Miller", "gender" : "male", "age" : 41, "salary" : 33000 }  
{ "_id" : ObjectId("52454155d8947fb70d000000"), "name" : "not known", "sex_orientation" : "male", "age" : 13, "salary" : 30000 }  
{ "_id" : ObjectId("524562d681c83a5bf26fc286"), "gender" : "female1", "salary" : 50 }  
{ "_id" : ObjectId("524563e881c83a5bf26fc287"), "gender" : "x" }  
{ "_id" : ObjectId("5245648081c83a5bf26fc288"), "gender" : "x" }  
{ "_id" : ObjectId("5245648e81c83a5bf26fc289"), "age" : "x" }  
{ "_id" : ObjectId("524564c181c83a5bf26fc28a"), "age" : "x", "gender" : 4 }  
```

5.2.5 利用正则表达式的查询  
`查询名字中含有字母E的记录(i表示忽略大小写)`
> db.user.find({name:/E/i})  

`也可以用：`  

> db.user.find({name:{$regex:'E',$options:'i'}})  

```js
{ "_id" : ObjectId("52453d8525e437dfea8fd4f5"), "age" : 26, "ex" : "barrymore", "gender" : "female", "name" : "Mikie Hara", "salary" : 7050 }  
{ "_id" : ObjectId("52453e2125e437dfea8fd4f6"), "age" : 41, "ex" : "barrymore", "gender" : "male", "name" : "Wentworth Earl Miller", "salary" : 33000 }  
```

`查询名字中含有字母E的记录(默认区分大小写) `
> db.user.find({name:/E/})  

`等价于：`  

> db.user.find({name:{$regex:'E'}})  

```js
{ "_id" : ObjectId("52453e2125e437dfea8fd4f6"), "age" : 41, "ex" : "barrymore", "gender" : "male", "name" : "Wentworth Earl Miller", "salary" : 33000 }  
```

`查询某个字段以“.0”结尾的记录 `
> db.user.find(name:/\.0$/)  


**这里的"//"中的内容表示是正则表达式，"."需要转义，"$"符号表示结尾**

5.3 查找符合条件的第一条记录

> db.user.findOne({$or:[{salary:{$gt:10000}},
{age:{$lt:25}}]})  

```js
{  
    "_id" : ObjectId("52442736d8947fb501000001"),  
    "name" : "lfqy",  
    "gender" : "male",  
    "age" : 23,  
    "salary" : 15  
}  
```

5.4 查询记录的指定字段


`查询user集合中所有记录的name,age,salary,sex_orientation字段  `

> db.user.find({},{name:1,age:1,salary:1,sex_orientation:true})  

```js
{ "_id" : ObjectId("52442736d8947fb501000001"), "name" : "lfqy", "age" : 23, "salary" : 15 }  
{ "_id" : ObjectId("52453cfb25e437dfea8fd4f4"), "name" : "Gal Gadot", "age" : 28, "salary" : 11000 }  
{ "_id" : ObjectId("52453d8525e437dfea8fd4f5"), "name" : "Mikie Hara", "age" : 26, "salary" : 7000 }  
{ "_id" : ObjectId("52453e2125e437dfea8fd4f6"), "name" : "Wentworth Earl Miller", "age" : 41, "salary" : 33000 }  
{ "_id" : ObjectId("52454155d8947fb70d000000"), "name" : "not known", "sex_orientation" : "male", "age" : 13, "salary" : 30000 }  
```

**注意：这里的1表示显示此列的意思，也可以用true表示。  
可以看到，默认_id，字段都是显示的。如果要其不显示，只需将其显示指定为false:**

> db.user.find({},{name:1,age:1,salary:1,sex_orientation:true,_id:false})  

5.5 查询指定字段的数据，并去重

`查询gender字段的数据，并去掉重复数据  `
> db.user.distinct('gender')  

```js
[ "male", "female" ]  
```

5.6 对查询结果集的操作

5.6.1 pretty print  

`为了方便，mongo也提供了pretty print工具db.collection.pretty()或者是db.collection.forEach(printjson)`

  
> db.user.find().pretty()  

```js
{  
    "_id" : ObjectId("52442736d8947fb501000001"),  
    "name" : "lfqy",  
    "gender" : "male",  
    "age" : 23,  
    "salary" : 15  
}  
{  
    "_id" : ObjectId("52453cfb25e437dfea8fd4f4"),  
    "name" : "Gal Gadot",  
    "gender" : "female",  
    "age" : 28,  
    "salary" : 11000  
}  
{  
    "_id" : ObjectId("52453d8525e437dfea8fd4f5"),  
    "name" : "Mikie Hara",  
    "gender" : "female",  
    "age" : 26,  
    "salary" : 7000  
}  
{  
    "_id" : ObjectId("52453e2125e437dfea8fd4f6"),  
    "name" : "Wentworth Earl Miller",  
    "gender" : "male",  
    "age" : 41,  
    "salary" : 33000  
}  
{  
    "_id" : ObjectId("52454155d8947fb70d000000"),  
    "name" : "not known",  
    "sex_orientation" : "male",  
    "age" : 13  
}  
```
5.6.2 指定结果集显示的条目  
5.6.2.1 显示结果集中的前3条记录  

> db.user.find().limit(3)  

```js
{ "_id" : ObjectId("52442736d8947fb501000001"), "name" : "lfqy", "gender" : "male", "age" : 23, "salary" : 15 }  
{ "_id" : ObjectId("52453cfb25e437dfea8fd4f4"), "name" : "Gal Gadot", "gender" : "female", "age" : 28, "salary" : 11000 }  
{ "_id" : ObjectId("52453d8525e437dfea8fd4f5"), "name" : "Mikie Hara", "gender" : "female", "age" : 26, "salary" : 7000 } 
```
 
5.6.2.2 查询第1条以后的所有数据  

> db.user.find().skip(1)  

```js
{ "_id" : ObjectId("52453cfb25e437dfea8fd4f4"), "name" : "Gal Gadot", "gender" : "female", "age" : 28, "salary" : 11000 }  
{ "_id" : ObjectId("52453d8525e437dfea8fd4f5"), "name" : "Mikie Hara", "gender" : "female", "age" : 26, "salary" : 7000 }  
{ "_id" : ObjectId("52453e2125e437dfea8fd4f6"), "name" : "Wentworth Earl Miller", "gender" : "male", "age" : 41, "salary" : 33000 }  
{ "_id" : ObjectId("52454155d8947fb70d000000"), "name" : "not known", "sex_orientation" : "male", "age" : 13, "salary" : 30000 }  
```

5.6.2.3 对结果集排序  
`升序`

> db.user.find().sort({salary:1})  

```js
{ "_id" : ObjectId("52442736d8947fb501000001"), "name" : "lfqy", "gender" : "male", "age" : 23, "salary" : 15 }  
{ "_id" : ObjectId("52453d8525e437dfea8fd4f5"), "name" : "Mikie Hara", "gender" : "female", "age" : 26, "salary" : 7000 }  
{ "_id" : ObjectId("52453cfb25e437dfea8fd4f4"), "name" : "Gal Gadot", "gender" : "female", "age" : 28, "salary" : 11000 }  
{ "_id" : ObjectId("52454155d8947fb70d000000"), "name" : "not known", "sex_orientation" : "male", "age" : 13, "salary" : 30000 }  
{ "_id" : ObjectId("52453e2125e437dfea8fd4f6"), "name" : "Wentworth Earl Miller", "gender" : "male", "age" : 41, "salary" : 33000 }  
```

`降序`
  
> db.user.find().sort({salary:-1})  

```js
{ "_id" : ObjectId("52453e2125e437dfea8fd4f6"), "name" : "Wentworth Earl Miller", "gender" : "male", "age" : 41, "salary" : 33000 }  
{ "_id" : ObjectId("52454155d8947fb70d000000"), "name" : "not known", "sex_orientation" : "male", "age" : 13, "salary" : 30000 }  
{ "_id" : ObjectId("52453cfb25e437dfea8fd4f4"), "name" : "Gal Gadot", "gender" : "female", "age" : 28, "salary" : 11000 }  
{ "_id" : ObjectId("52453d8525e437dfea8fd4f5"), "name" : "Mikie Hara", "gender" : "female", "age" : 26, "salary" : 7000 }  
{ "_id" : ObjectId("52442736d8947fb501000001"), "name" : "lfqy", "gender" : "male", "age" : 23, "salary" : 15 }  
```

`也可以将排序依据的字段，写在一个list里面，如下： `

> db.user.find().sort([("salary",1),("name",-1)]) 



5.7 统计查询结果中记录的条数

5.7.1 统计集合中的所有记录条数  

> db.user.find().count()  

```js
5  
```

5.7.2 查询符合条件的记录数  

`查询salary小于4000或大于10000的记录数`

> db.user.find({$or: [{salary: {$lt:4000}}, {salary: {$gt:10000}}]}).count()  

```js
4  
```




5.8 查询存在(或不存在)指定字段的记录

`查询不存在age字段，但是有gender字段，并且ex为barrymore的记录`

> db.user.find({"age":{$exists:false},"gender":{$exists:true},"ex":"barrymore"})  

```js
{ "_id" : ObjectId("524562d681c83a5bf26fc286"), "ex" : "barrymore", "gender" : "female1", "salary" : 50 }  
{ "_id" : ObjectId("524563e881c83a5bf26fc287"), "ex" : "barrymore", "gender" : "x" }  
{ "_id" : ObjectId("5245648081c83a5bf26fc288"), "ex" : "barrymore", "gender" : "x" } 
```

6.1 删除整个集合中的所有数据

> db.test.insert({name:"asdf"})  
> show collections  

```js
book  
system.indexes  
test  
user  
```

`到这里新建了一个集合，名为test。`  
`删除test中的所有记录。  `
> db.test.remove()  
> show collections  

```js
book  
system.indexes  
test  
user  
```
> db.test.find()
  
`可见test中的记录全部被删除`

**注意db.collection.remove()和drop()的区别，remove()只是删除了集合中所有的记录，而集合中原有的索引等信息还在，而drop()则把集合相关信息整个删除(包括索引)**

6.2 删除集合中符合条件的所有记录

> db.user.remove({name:'lfqy'})

> db.user.find()

```js
{ "_id" : ObjectId("52453cfb25e437dfea8fd4f4"), "name" : "Gal Gadot", "gender" : "female", "age" : 28, "salary" : 11000 }
{ "_id" : ObjectId("52453d8525e437dfea8fd4f5"), "name" : "Mikie Hara", "gender" : "female", "age" : 26, "salary" : 7000 }
{ "_id" : ObjectId("52453e2125e437dfea8fd4f6"), "name" : "Wentworth Earl Miller", "gender" : "male", "age" : 41, "salary" : 33000 }
{ "_id" : ObjectId("52454155d8947fb70d000000"), "name" : "not known", "sex_orientation" : "male", "age" : 13, "salary" : 30000 }
```

> db.user.find()
```js
{ "_id" : ObjectId("52453cfb25e437dfea8fd4f4"), "name" : "Gal Gadot", "gender" : "female", "age" : 28, "salary" : 11000 }
{ "_id" : ObjectId("52453d8525e437dfea8fd4f5"), "name" : "Mikie Hara", "gender" : "female", "age" : 26, "salary" : 7000 }
{ "_id" : ObjectId("52453e2125e437dfea8fd4f6"), "name" : "Wentworth Earl Miller", "gender" : "male", "age" : 41, "salary" : 33000 }
{ "_id" : ObjectId("52454155d8947fb70d000000"), "name" : "not known", "sex_orientation" : "male", "age" : 13, "salary" : 30000 }
{ "_id" : ObjectId("52455cc825e437dfea8fd4f8"), "name" : "2", "gender" : "female", "age" : 28, "salary" : 2 }
{ "_id" : ObjectId("52455d8a25e437dfea8fd4fa"), "name" : "1", "gender" : "female", "age" : 28, "salary" : 1 }
```

> db.user.remove( {salary :{$lt:10}})
> db.user.find()

```{ "_id" : ObjectId("52453cfb25e437dfea8fd4f4"), "name" : "Gal Gadot", "gender" : "female", "age" : 28, "salary" : 11000 }
{ "_id" : ObjectId("52453d8525e437dfea8fd4f5"), "name" : "Mikie Hara", "gender" : "female", "age" : 26, "salary" : 7000 }
{ "_id" : ObjectId("52453e2125e437dfea8fd4f6"), "name" : "Wentworth Earl Miller", "gender" : "male", "age" : 41, "salary" : 33000 }
{ "_id" : ObjectId("52454155d8947fb70d000000"), "name" : "not known", "sex_orientation" : "male", "age" : 13, "salary" : 30000 }
```

6.3  删除集合中符合条件的一条记录
> db.user.find()

```js
{ "_id" : ObjectId("52453cfb25e437dfea8fd4f4"), "name" : "Gal Gadot", "gender" : "female", "age" : 28, "salary" : 11000 }
{ "_id" : ObjectId("52453d8525e437dfea8fd4f5"), "name" : "Mikie Hara", "gender" : "female", "age" : 26, "salary" : 7000 }
{ "_id" : ObjectId("52453e2125e437dfea8fd4f6"), "name" : "Wentworth Earl Miller", "gender" : "male", "age" : 41, "salary" : 33000 }
{ "_id" : ObjectId("52454155d8947fb70d000000"), "name" : "not known", "sex_orientation" : "male", "age" : 13, "salary" : 30000 }
{ "_id" : ObjectId("52455de325e437dfea8fd4fb"), "name" : "1", "gender" : "female", "age" : 28, "salary" : 1 }
{ "_id" : ObjectId("52455de925e437dfea8fd4fc"), "name" : "2", "gender" : "female", "age" : 28, "salary" : 2 }
```

> db.user.remove({salary :{$lt:10}},1)
> db.user.find()

```js
{ "_id" : ObjectId("52453cfb25e437dfea8fd4f4"), "name" : "Gal Gadot", "gender" : "female", "age" : 28, "salary" : 11000 }
{ "_id" : ObjectId("52453d8525e437dfea8fd4f5"), "name" : "Mikie Hara", "gender" : "female", "age" : 26, "salary" : 7000 }
{ "_id" : ObjectId("52453e2125e437dfea8fd4f6"), "name" : "Wentworth Earl Miller", "gender" : "male", "age" : 41, "salary" : 33000 }
{ "_id" : ObjectId("52454155d8947fb70d000000"), "name" : "not known", "sex_orientation" : "male", "age" : 13, "salary" : 30000 }
{ "_id" : ObjectId("52455de925e437dfea8fd4fc"), "name" : "2", "gender" : "female", "age" : 28, "salary" : 2 }
```

`当然，也可以是db.user.remove({salary :{$lt:10}},true)`


7 更新操作
```js
db.collection.update(查询条件, 
	更新内容,
	[默认是false，不存在update的记录,不插入,true为插入], 
	[默认false,只更新找到的第一条记录，如果这个参数为true,就把按条件查出来多条记录全部更新。] )
```

7.1 赋值更新

> db.user.find()

```js
{ "_id" : ObjectId("52453cfb25e437dfea8fd4f4"), "name" : "Gal Gadot", "gender" : "female", "age" : 28, "salary" : 11000 }
{ "_id" : ObjectId("52453d8525e437dfea8fd4f5"), "name" : "Mikie Hara", "gender" : "female", "age" : 26, "salary" : 7000 }
{ "_id" : ObjectId("52453e2125e437dfea8fd4f6"), "name" : "Wentworth Earl Miller", "gender" : "male", "age" : 41, "salary" : 33000 }
{ "_id" : ObjectId("52454155d8947fb70d000000"), "name" : "not known", "sex_orientation" : "male", "age" : 13, "salary" : 30000 }
{ "_id" : ObjectId("52455f8925e437dfea8fd4fd"), "name" : "lfqy", "gender" : "male", "age" : 28, "salary" : 1 }
{ "_id" : ObjectId("5245607525e437dfea8fd4fe"), "name" : "lfqy", "gender" : "male", "age" : 28, "salary" : 2 }
```


> db.user.update({name:'lfqy'},{$set:{age:23}},false,true)
> db.user.find()


```js
{ "_id" : ObjectId("52453cfb25e437dfea8fd4f4"), "name" : "Gal Gadot", "gender" : "female", "age" : 28, "salary" : 11000 }
{ "_id" : ObjectId("52453d8525e437dfea8fd4f5"), "name" : "Mikie Hara", "gender" : "female", "age" : 26, "salary" : 7000 }
{ "_id" : ObjectId("52453e2125e437dfea8fd4f6"), "name" : "Wentworth Earl Miller", "gender" : "male", "age" : 41, "salary" : 33000 }
{ "_id" : ObjectId("52454155d8947fb70d000000"), "name" : "not known", "sex_orientation" : "male", "age" : 13, "salary" : 30000 }
{ "_id" : ObjectId("52455f8925e437dfea8fd4fd"), "name" : "lfqy", "gender" : "male", "age" : 23, "salary" : 1 }
{ "_id" : ObjectId("5245607525e437dfea8fd4fe"), "name" : "lfqy", "gender" : "male", "age" : 23, "salary" : 2 }
db.user.find()
{ "_id" : ObjectId("52453cfb25e437dfea8fd4f4"), "name" : "Gal Gadot", "gender" : "female", "age" : 28, "salary" : 11000 }
{ "_id" : ObjectId("52453d8525e437dfea8fd4f5"), "name" : "Mikie Hara", "gender" : "female", "age" : 26, "salary" : 7000 }
{ "_id" : ObjectId("52453e2125e437dfea8fd4f6"), "name" : "Wentworth Earl Miller", "gender" : "male", "age" : 41, "salary" : 33000 }
{ "_id" : ObjectId("52454155d8947fb70d000000"), "name" : "not known", "sex_orientation" : "male", "age" : 13, "salary" : 30000 }
{ "_id" : ObjectId("52455f8925e437dfea8fd4fd"), "name" : "lfqy", "gender" : "male", "age" : 23, "salary" : 1 }
{ "_id" : ObjectId("5245607525e437dfea8fd4fe"), "name" : "lfqy", "gender" : "male", "age" : 23, "salary" : 2 }
```

> db.user.update({name:'lfqy1'},{$set:{age:23}},true,true)
> db.user.find()

```js
{ "_id" : ObjectId("52453cfb25e437dfea8fd4f4"), "name" : "Gal Gadot", "gender" : "female", "age" : 28, "salary" : 11000 }
{ "_id" : ObjectId("52453d8525e437dfea8fd4f5"), "name" : "Mikie Hara", "gender" : "female", "age" : 26, "salary" : 7000 }
{ "_id" : ObjectId("52453e2125e437dfea8fd4f6"), "name" : "Wentworth Earl Miller", "gender" : "male", "age" : 41, "salary" : 33000 }
{ "_id" : ObjectId("52454155d8947fb70d000000"), "name" : "not known", "sex_orientation" : "male", "age" : 13, "salary" : 30000 }
{ "_id" : ObjectId("52455f8925e437dfea8fd4fd"), "name" : "lfqy", "gender" : "male", "age" : 23, "salary" : 1 }
{ "_id" : ObjectId("5245607525e437dfea8fd4fe"), "name" : "lfqy", "gender" : "male", "age" : 23, "salary" : 2 }
{ "_id" : ObjectId("5245610881c83a5bf26fc285"), "age" : 23, "name" : "lfqy1" }
```


> db.user.update({name:'lfqy'},{$set:{interest:"NBA"}},false,true)
> db.user.find()


```js
{ "_id" : ObjectId("52453cfb25e437dfea8fd4f4"), "name" : "Gal Gadot", "gender" : "female", "age" : 28, "salary" : 11000 }
{ "_id" : ObjectId("52453d8525e437dfea8fd4f5"), "name" : "Mikie Hara", "gender" : "female", "age" : 26, "salary" : 7000 }
{ "_id" : ObjectId("52453e2125e437dfea8fd4f6"), "name" : "Wentworth Earl Miller", "gender" : "male", "age" : 41, "salary" : 33000 }
{ "_id" : ObjectId("52454155d8947fb70d000000"), "name" : "not known", "sex_orientation" : "male", "age" : 13, "salary" : 30000 }
{ "_id" : ObjectId("5245610881c83a5bf26fc285"), "age" : 23, "name" : "lfqy1" }
{ "_id" : ObjectId("52455f8925e437dfea8fd4fd"), "age" : 23, "gender" : "male", "interest" : "NBA", "name" : "lfqy", "salary" : 1 }
{ "_id" : ObjectId("5245607525e437dfea8fd4fe"), "age" : 23, "gender" : "male", "interest" : "NBA", "name" : "lfqy", "salary" : 2 }
```

7.2 增值更新

> db.user.find()

```js
{ "_id" : ObjectId("52453cfb25e437dfea8fd4f4"), "name" : "Gal Gadot", "gender" : "female", "age" : 28, "salary" : 11000 }
{ "_id" : ObjectId("52453d8525e437dfea8fd4f5"), "name" : "Mikie Hara", "gender" : "female", "age" : 26, "salary" : 7000 }
{ "_id" : ObjectId("52453e2125e437dfea8fd4f6"), "name" : "Wentworth Earl Miller", "gender" : "male", "age" : 41, "salary" : 33000 }
{ "_id" : ObjectId("52454155d8947fb70d000000"), "name" : "not known", "sex_orientation" : "male", "age" : 13, "salary" : 30000 }
{ "_id" : ObjectId("5245610881c83a5bf26fc285"), "age" : 23, "name" : "lfqy1" }
{ "_id" : ObjectId("52455f8925e437dfea8fd4fd"), "age" : 23, "gender" : "male", "interest" : "NBA", "name" : "lfqy", "salary" : 1 }
{ "_id" : ObjectId("5245607525e437dfea8fd4fe"), "age" : 23, "gender" : "male", "interest" : "NBA", "name" : "lfqy", "salary" : 2 }
```


> db.user.update({gender:'female'},{$inc:{salary:50}},false,true)
> db.user.find()

```js
{ "_id" : ObjectId("52453cfb25e437dfea8fd4f4"), "name" : "Gal Gadot", "gender" : "female", "age" : 28, "salary" : 11050 }
{ "_id" : ObjectId("52453d8525e437dfea8fd4f5"), "name" : "Mikie Hara", "gender" : "female", "age" : 26, "salary" : 7050 }
{ "_id" : ObjectId("52453e2125e437dfea8fd4f6"), "name" : "Wentworth Earl Miller", "gender" : "male", "age" : 41, "salary" : 33000 }
{ "_id" : ObjectId("52454155d8947fb70d000000"), "name" : "not known", "sex_orientation" : "male", "age" : 13, "salary" : 30000 }
{ "_id" : ObjectId("5245610881c83a5bf26fc285"), "age" : 23, "name" : "lfqy1" }
{ "_id" : ObjectId("52455f8925e437dfea8fd4fd"), "age" : 23, "gender" : "male", "interest" : "NBA", "name" : "lfqy", "salary" : 1 }
{ "_id" : ObjectId("5245607525e437dfea8fd4fe"), "age" : 23, "gender" : "male", "interest" : "NBA", "name" : "lfqy", "salary" : 2 }
```


关于更新操作（db.collection.update(criteria, objNew, upsert, multi )），要说明的是，如果upsert为true，那么在没有找到符合更新条件的情况下，mongo会在集合中插入一条记录其值满足更新条件的记录(其中的字段只有更新条件中涉及的字段，字段的值满足更新条件)，然后将其更新（注意，如果更新条件是$lt这种不等式条件，那么upsert插入的记录只会包含更新操作涉及的字段，而不会有更新条件中的字段。这也很好理解，因为没法为这种字段定值，mongo索性就不取这些字段）。如果符合条件的记录中没有要更新的字段，那么mongo会为其创建该字段，并更新。


# 参考文档

- [http://blog.csdn.net/xia7139/article/details/12570569](http://blog.csdn.net/xia7139/article/details/12570569)



-----------------------

> **文章若有纰漏请大家补充指正,谢谢~~**
> [http://blog.xinshangshangxin.com](http://blog.xinshangshangxin.com) SHANG殇

