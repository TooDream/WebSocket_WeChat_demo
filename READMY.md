node app.js 开启服务器

安装包：

```yarn add socket.io express```

> 文档查询：
>
> https://socket.io/docs/v4/

#### **app.js基本框架：（关于sokcet.io的基本代码）**

```js
var app = require('express')()
// var server = require('http').createServer(app)
var server = require('http').Server(app)
var io = require('socket.io')(server)
// 记录所有已经登录过的用户
const users = []

server.listen(3000, () => {
  console.log('服务器启动成功了')
})

// express处理静态资源
// 把public目录设置为静态资源目录
app.use(require('express').static('public'))

app.get('/', function(req, res) {
  res.redirect('/index.html')
})

// 这两个不是自定义事件，是关于连接和断开连接所触发的事件
io.on('connection',socket => {
    socket.on('disconnect', () => {
        
    })
}
```

#### **socket关于事件的操作：**

```js
socket.on('name', function(data){})		// 注册事件
socket.emit('name', data)	//发送事件
io.emit('name', d)		// 全局广播事件
每一个发送对应一个注册事件
```

#### **jQuery操作：**

注册事件、获取事件this、给标签增加类名、获取兄弟标签、移除类名

```js
$('#login_avatar li').on('click', function() {
  $(this)
    .addClass('now')
    .siblings() //给其余头像移除选中框
    .removeClass('now')
})
```

插入标签

```js
$('.box-bd').append(`
    <div class="system">
      <p class="message_system">
        <span class="content">${data.username}加入了群聊</span>
      </p>
    </div>
  `)

```

获取标签val并trim

```js
var username = $('#username')
    .val()
    .trim()
```

获取属性值和设置属性值

```js
 $('#login_avatar li.now img').attr('src')
 $('#login_avatar li.now img').attr('src',data.avatar)
```

元素HTML结构清空

```js
$('.user-list ul').html('')
```

元素text内容赋值

```js
$('#userCount').text(data.length)
$('#userCount').text('总人数为8')
```

获取标签最后一个孩子、get(0)为获取当前标签

```js
$('.box-bd')
    .children(':last')
    .get(0)
    .scrollIntoView(false)
```

> get()原本为一个jQuery对象，0为这个对象中所指的标签，也就是当前标签
>
> scrollIntoView()为原生的DOM事件，参数为false时表示滚动到这个元素的最底部的可视化区域，ture则为最顶部。

处理图片上传

```js
$('#file').on('change', function() {
  var file = this.files[0]
  // 需要把这个文件发送到服务器， 借助于H5新增的fileReader
  var fr = new FileReader()
  // 读取成Base64的编码
  fr.readAsDataURL(file)
  fr.onload = function() {
    socket.emit('sendImage', {
      username: username,
      avatar: avatar,
      img: fr.result
    })
  }
})
```

找到最后一个img（img:last）并等其加载完成执行回调函数

```js
$('.box-bd img:last').on('load', function() {
    scrollIntoView()
  })
```

jquery 监听“ctrl”加“enter”键同时按下

```js
$("#chat_area").keydown(function(e){
    //触发事件“ctrl+enter”键
    if (e.ctrlKey && e.which == 13){
        console.log("按下ctrl+enter键");
    }
});
```



#### 表情插件jQuery-Emoji

```html
<!-- 表情插件 -->
<script src="lib/jquery-mCustomScrollbar/script/jquery.mCustomScrollbar.min.js"></script>
<script src="lib/jquery-emoji/js/jquery.emoji.min.js"></script>
<script src="js/jquery-1.12.4.js"></script>
样式
<link rel="stylesheet" href="lib/jquery-mCustomScrollbar/css/jquery.mCustomScrollbar.min.css"/>
<link rel="stylesheet" href="lib/jquery-emoji/css/jquery.emoji.css"/>
```

index.js

```js
// 初始化jquery-emoji插件
$(".face").on("click", function () {
  $("#content").emoji({
    // 设置触发表情的按钮
    button: ".face",
    showTab: true,
    animation: "slide",
    position: "topRight",
    icons: [
      {
        name: "QQ表情",
        path: "lib/jquery-emoji/img/qq/",	// 引入对应的表情文件夹
        maxNum: 91,
        excludeNums: [41, 45, 54],
        file: ".gif",
      },
    ],
  });
});
```

index.html

```html
内容区域
当使用textarea标签时，不能正确地显式表情，因为textarea只能显示文字，所以表情会被解析成对应的编码
<textarea class="text" id="content" contenteditable></textarea>
正确显示应该使用div来显示内容
<!-- div添加一个属性：contenteditable -->
<div class="text" id="content" contenteditable></div>
```

