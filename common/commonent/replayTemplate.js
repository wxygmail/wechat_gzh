module.exports = (option = {}) => {
  const {msgType} = option
  let relplayMsg = `<xml>
  <ToUserName><![CDATA[${option.toUserName}]]></ToUserName>
  <FromUserName><![CDATA[${option.fromUserName}]]></FromUserName>
  <CreateTime>${Date.now()}</CreateTime>
  <MsgType><![CDATA[${option.msgType}]]></MsgType>`

  const _temp = {
    //文本
    text: `<Content><![CDATA[${option.content}]]></Content>`,
    //图片
    image: `
      <Image>
        <MediaId><![CDATA[${option.mediaId}]]></MediaId>
     </Image>`,
    //语音
    voice: `
      <Voice>
        <MediaId><![CDATA[${option.mediaId}]]></MediaId>
      </Voice>`,
    //视频
    video: `
      <Video>
        <MediaId><![CDATA[${option.mediaId}]]></MediaId>
        <Title><![CDATA[${option.title}]]></Title>
        <Description><![${option.description}]]></Description>
      </Video>`,
    //音乐
    music: `
      <Music>
        <Title><![CDATA[${option.title}]]></Title>
        <Description><![CDATA[${option.description}]]></Description>
        <MusicUrl><![CDATA[${option.musicUrl}]]></MusicUrl>
        <HQMusicUrl><![CDATA[${option.HQmusicUrl}]]></HQMusicUrl>
        <ThumbMediaId><![CDATA[${option.mediaId}]]></ThumbMediaId>
      </Music>`,
    //图文
    news: () => {
      let str = `<ArticleCount>${option.content.length}</ArticleCount><Articles>`

      option.content.forEach(v => {
        str += `
          <item>
            <Title><![CDATA[${v.title}]]></Title>
            <Description><![CDATA[${v.description}]]></Description>
            <PicUrl><![CDATA[${v.picUrl}]]></PicUrl>
            <Url><![CDATA[${v.url}]]></Url>
          </item>`
      })
      return str += '</Articles>'
    },
    event: () => {
      const _ev = {
        subscribe: `<Event><![CDATA[${option.content}]]></Event>`,
        unsubscribe: `<Event><![CDATA[${option.content}]]></Event>`
      }[option.eventType]
      return _ev;
    }
  }
  if (Object.prototype.toString.call(_temp[msgType]) === '[object Function]') {
    relplayMsg += _temp[msgType]();
  } else {
    relplayMsg += _temp[msgType];
  }

  relplayMsg += `</xml>`
  return relplayMsg;
}
