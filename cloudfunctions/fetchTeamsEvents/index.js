// 用于获取所有队伍和赛事信息，并添加到数据库
// 定时任务，每天0点0分自动触发

// 云函数入口文件
const cloud = require('wx-server-sdk');
const request = require('request'); // 获取request模块，用于http请求

cloud.init();

const db = cloud.database({
  env: 'frcevent-test-62914c'
}); // 获取数据库数据，需要等cloud.init()初始化完毕

// 云函数入口函数
exports.main = async (event, context) => {
  var baseLink = 'https://www.thebluealliance.com/api/v3'; // 请求链接主体
  var tbaAuthKey =
    'kbxvOnS2csBH6fzQ8zijLw2f1k135fWp8NgTEfPRg1n8hYqh7SSUo9VJ3JEBlnIg'; // tba请求认证key

  var teamLastModified = ''; // 小程序提供的最后修改事件
  var eventLastModified = ''; // 小程序提供的最后修改事件

  var teamRequestOptions = {
    // request模块的配置选项
    url: baseLink + '/teams/all/simple',
    headers: {
      'content-type': 'application/json', // 文本类型为Json
      'X-TBA-Auth-Key': tbaAuthKey, // tba请求认证key
      'If-Modified-Since': teamLastModified //最后一次修改头的时间
    }
  };

  var eventRequestOptions = {
    // request模块的配置选项
    url: baseLink + '/events/all/simple',
    headers: {
      'content-type': 'application/json', // 文本类型为Json
      'X-TBA-Auth-Key': tbaAuthKey, // tba请求认证key
      'If-Modified-Since': eventLastModified //最后一次修改头的时间
    }
  };

  new Promise((resolve, reject) => {
    // 请求所有队伍信息，并更新数据库（如果需要）
    console.log('teamRequestOptions', teamRequestOptions);
    request(teamRequestOptions, (error, response, data) => {
      var res = {
        data: JSON.parse(data),
        header: response.headers,
        statusCode: response.statusCode
      };

      console.log('teamRes', res);

      // 刷新数据库
      if (!error && res.statusCode == 200 && res.data.length > 0) {
        //   TODO
        // 小程序暂时不支持批量导入数据
      }
    });

    // 请求所有赛事信息，并更新数据库（如果需要）
    console.log('eventRequestOptions', eventRequestOptions);
    request(eventRequestOptions, (error, response, data) => {
      var res = {
        data: JSON.parse(data),
        header: response.headers,
        statusCode: response.statusCode
      };

      console.log('eventRes', res);

      // 刷新数据库
      if (!error && res.statusCode == 200 && res.data.length > 0) {
        //   TODO
        // 小程序暂时不支持批量导入数据
      }
    });
  });
};
