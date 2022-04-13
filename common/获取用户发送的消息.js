const sha1 = require("sha1");
const config = require('../config');
const userInfo = require("./commonent/userInfo");

/**
 * 接口设置一直配置失败的问题
 * ngrok http 3000 --authtoken  登录ngrok复制 Connect your account 里面的内容
 * ngrok authtoken 1x9hm6FAJcoDSfwfsAa24WNUv8H_r2bKf76zTS5zmvYaGLGJ
 */

module.exports = () => {
  return async (req, res, next) => {
    const {signature, echostr, timestamp, nonce} = req.query;
    const {token} = config;
    const str = sha1([timestamp, nonce, token].sort().join(''));

    if (req.method === 'GET') {
      if (str === signature) {
        res.send(echostr);
      } else {
        res.end('error');
      }
    } else if (req.method === 'POST') {
      if (str !== signature) {
        res.end('error')
      }

      const result = await userInfo.getUserMessage(req);
      const _p = await userInfo.parseXMLAsync(result);
      const _data = userInfo.formatterData(_p);
      console.log(_data, 44)
    } else {
      res.end('error')
    }
  }
}

