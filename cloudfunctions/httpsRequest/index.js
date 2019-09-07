// 用于转发https请求
// 云函数入口文件
const cloud = require('wx-server-sdk');
const request = require('request'); // 获取request模块，用于http请求

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  var baseLink = 'https://www.thebluealliance.com/api/v3'; // 请求链接主体
  var tbaAuthKey =
    'kbxvOnS2csBH6fzQ8zijLw2f1k135fWp8NgTEfPRg1n8hYqh7SSUo9VJ3JEBlnIg'; // tba请求认证key
  var api = event.api; // 小程序端提供的请求api
  var lastModified = event.lastModified; // 小程序提供的最后修改事件
  var requestOptions = {
    // request模块的配置选项
    url: baseLink + api,
    headers: {
      'content-type': 'application/json', // 文本类型为Json
      'X-TBA-Auth-Key': tbaAuthKey, // tba请求认证key
      'If-Modified-Since': lastModified //最后一次修改头的时间
    }
  };

  // 以promise的方式返回数据给小程序端
  return new Promise((resolve, reject) => {
    console.log('requestOptions', requestOptions);
    request(requestOptions, (error, response, data) => {
      var res = {
        data: JSON.parse(data),
        header: response.headers,
        statusCode: response.statusCode
      };

      console.log('res', res);

      //   返回数据给小程序端
      resolve(res);
    });
  });
};
