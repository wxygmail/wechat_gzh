const xml2js = require("xml2js");

const userInfo = {
  /*
  *
  * <xml><ToUserName><![CDATA[gh_a92f2c70d38e]]></ToUserName> 开发者ID
    <FromUserName><![CDATA[oTw965rZZKy8aEDYLkpurAxDfh_k]]></FromUserName> 用户的openID
    <CreateTime>1648025987</CreateTime>  发送的时间戳
    <MsgType><![CDATA[text]]></MsgType>  消息的类型
    <Content><![CDATA[111]]></Content>  内容
    <MsgId>23594054985837342</MsgId> 消息ID 3天有效期
    </xml>
  *
  * */
  getUserMessage: (req) => {
    return new Promise((resolve, reject) => {
      let xmlData = '';
      req.on('data', data => {
        //流式数据拼接 data(Buffer)
        xmlData += data.toString();
      }).on('end', () => {
        resolve(xmlData)
      })
    })
  },
  /**
   * 解析XML数据
   * 将xml解析为js对象数据
   */
  parseXMLAsync: (data) => {
    return new Promise((resolve, reject) => {
      xml2js.parseString(data, (err, v) => {
        if (!err) {
          resolve(v)
        } else {
          reject('解析xml对象出了问题：', err)
        }
      });
    })
  },
  /**
   * 格式化数据
   * @param data
   */
  formatterData: (data) => {
    let message = {}
    const {xml} = data;
    if (Object.prototype.toString.call(xml) === '[object Object]') {
      for (const xmlKey in xml) {
        const v = xml[xmlKey];
        if (Array.isArray(v) && v.length > 0) {
          message[xmlKey] = v[0];
        }
      }
    }
    return message;
  }
}

module.exports = userInfo
