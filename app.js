/*
  启动聊天的服务端程序
*/
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

io.on('connection',socket => {
  socket.on('login',data => {
    let user = users.find(item => item.username === data.username)
    if(user) {
      socket.emit('loginError',{msg: '登陆失败'})
    }else {
      users.push(data)
      //告诉用户，登录成功
      socket.emit('loginSuccess',data)

      //io.emit广播事件
      io.emit('addUser', data)

      //告诉所有用户聊天室中的在线人数
      io.emit('userList',users)

      // 将username和avator存起来，断开连接时与对应用户匹配并进行删除
      socket.username = data.username
      socket.avatar = data.avatar
    }
  })

  // 用户断开的功能（不是自定义事件）
  // 监听用户的断开
  socket.on('disconnect',() => {
    //找到当前用户的坐标进行删除
    let idx = users.findIndex(item => item.username === socket.username)
    users.splice(idx,1)

    //广播有人离开了聊天室
    io.emit('delUser',{
      username: socket.username,
      avatar: socket.avatar
    })

    //广播用户列表发生的变化
    io.emit('userList',users)
  })

  // 监听聊天的消息
  socket.on('sendMessage',data => {
    io.emit('receiveMessage',data)
  })

  // 接收图片信息
  socket.on('sendImage', data => {
    // 广播给所有用户
    io.emit('receiveImage', data)
  })
})