const sha1 = require("sha1");
const config = require('../config');

/*
* ngrok 开启本地服务（穿透外网） ngrok http 端口号
*/
/*
{
  signature: '03bb5b65b1ba396502a905c01701b0698f579e71', //微信的加密签名
  echostr: '8258349752542748155',  //微信的随机字符串
  timestamp: '1647844659',   //微信发送的时间戳
  nonce: '766527368'  //微信的随机数字
 }
将 timestamp、nonce、token 按字典序排序 将排序好的内容拼接成字符串进行sha1加密
加密后的字符串与signature比对， === 返回 echostr 给微信服务器 else 返回 error
*/
module.exports = () => {
  return (req, res, next) => {
    console.log(req.query)
    const {signature, echostr, timestamp, nonce} = req.query;
    const {token} = config;
    const _arrSort = [timestamp, nonce, token].sort();
    const str = sha1(_arrSort.join(''));
    if (str === signature) {
      res.send(echostr);
    } else {
      res.end('error');
    }
  }
}
