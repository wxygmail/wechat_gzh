const express = require('express');
// const auth = require('../middle/auth');
const getUser = require('../common/实现自定义回复内容');
const app = express();
//接收处理所有消息
// app.use(auth());
app.use(getUser());
//监听端口号
app.listen(3000, () => {
  console.log('服务器启动了~')
})
