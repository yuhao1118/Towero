// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init()

// 云函数入口函数
exports.main = () => {
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const wxContext = cloud.getWXContext()

  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}
