const axios = require('request-promise-native');
const fs = require('fs');
const {
  appID,
  baseUrl,
  appsecret
} = require('../config')

class AccessToken {
  constructor() {
  }

  /**
   * 获取 access_token，从微信服务器上获取
   * 当前事件 + 服务器的有效时间 + 5分钟的过渡事件 = access_token 的过期时间
   */
  getAccessToken() {
    const url = `${baseUrl}/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`;
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url,
        json: true
      }).then((res) => {
        // 设置过期时间
        // 5分钟 * 60 = 300s ， 单位换算需要✖️ 1000
        res.expires_in = Date.now() + (res.expires_in + 5 * 60) * 1000;
        resolve(res)
      }).catch(err => reject('获取access_token失败：', err))
    })
  }

  /**
   * 保存 access_token
   */
  saveAccessToken(data) {
    // writeFile 是异步写入函数
    const {writeFile} = fs;
    return new Promise((resolve, reject) => {
      // 需要转换成字符串，直接存续对象会变成 [Object object]
      const at = JSON.stringify(data);
      writeFile('../file/accessTokenFile.text', at, err => {
        console.log('err',err)
        if (!err) {
          resolve();
        } else {
          reject('access_token保存失败：', err);
        }
      })
    })
  }

  /**
   * 读取 access_token
   */
  readAccessToken() {
    return new Promise((resolve, reject) => {
      const {readFile} = fs;
      readFile('../file/accessTokenFile.text', 'utf8', (err, data) => {
        if (err) {
          reject('读取access_token失败：', err)
        } else {
          resolve(data);
        }
      })

    })
  }

  /**
   * 验证 access_token 是否过期
   */
  isExpiredAccessToken(data) {
    // 是否有数据、过期时间有无、access_token是否存在
    if (!data && !data.expires_in && !data.access_token) {
      return false;
    } else {
      // 检验access_token是否在有效期之内
      return data.expires_in > Date.now();
    }
  }

  /**
   * 疯转一个读取access_token的函数
   */
  fetchAccessToken() {
    // return new Promise((resolve, reject) => {
    //   at.readAccessToken().then(async res => {
    //     // 本地有文件
    //     // 判断access_token是否过期
    //     if (at.isExpiredAccessToken(res)) {
    //       resolve(res)
    //     } else {
    //       // 已过期，重新获取≈
    //       const gat = await this.getAccessToken();
    //       await this.saveAccessToken(gat);
    //       resolve(gat)
    //     }
    //   }).catch(async err => {
    //     // 本地无文件
    //     const gat = await this.getAccessToken();
    //     await this.saveAccessToken(gat);
    //     resolve(gat)
    //   })
    // })

    //简化封装
    return this.readAccessToken()
      .then(async res => {
        // 本地有文件
        // 判断access_token是否过期
        if (this.isExpiredAccessToken(res)) {
          return Promise.resolve(res);
        } else {
          // 已过期，重新获取
          const gat = await this.getAccessToken();
          await this.saveAccessToken(gat);
          return Promise.resolve(gat)
        }
      })
      .catch(async err => {
        // 本地无文件
        const gat = await this.getAccessToken();
        console.log(gat, 12313)
        await this.saveAccessToken(gat);
        return Promise.resolve(gat)
      }).then(result => {
        this.access_token = result.access_token;
        this.expires_in = result.expires_in;
        return Promise.resolve(result);
      })
  }

}

const at = new AccessToken();
at.fetchAccessToken().then(res => {
  console.log(res, 123)
  console.log(at.access_token, 123)
}).catch(err => {
  console.log(err, 99)
})


