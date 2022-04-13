module.exports = (option = {}) => {
  const message = {...option}
  const _msg = {
    text: '你好',
    image: '图片',
    location: '地理位置',
    event: '123'
  }
  message.content = _msg[option.msgType];
  return message;
}
