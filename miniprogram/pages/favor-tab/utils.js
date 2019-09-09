/* API 列表 */
// 1. /event/{event_key}/simple                            获取到赛事信息
// 2. /team/{team_key}/simple                              获取到队伍信息

import { dateReplace } from '../../utils/methodList';

var app = getApp();

var utils = {
  // 获取收藏key数组，并http请求具体数据
  getFavorArray: function(that) {
    // 获取收藏key数组
    app.getFavor((teamKeyArray, eventKeyArray) => {
      // 对应函数完成http请求
      this.eventKey2Info(eventKeyArray, that);
      this.teamKey2Info(teamKeyArray, that);
    });
  },

  // 循环event_key数组，请求event_info
  eventKey2Info: function(eventKeyArray, that) {
    var eventInfoArray = []; // 每次都必须完全刷新
    var requestCount = 0; // 请求是异步返回数据的，通过计数判断是否所有请求都完成

    for (var i in eventKeyArray) {
      var curEventkey = eventKeyArray[i]; // 当前循环的event_key

      app.httpsRequest(`/event/${curEventkey}/simple`, res => {
        //   新增两个起始日期的属性
        if (res.hasOwnProperty('start_date')) {
          res.start_date_str = dateReplace(res.start_date);
        }

        if (res.hasOwnProperty('end_date')) {
          res.end_date_str = dateReplace(res.end_date);
        }

        // 添加到info数组
        eventInfoArray.push(res);

        requestCount += 1;

        if (requestCount == eventKeyArray.length) {
          // 在key数组为空时，直接会刷新空info数组
          that.setData({
            eventInfoArray: eventInfoArray
          });
        }
      });
    }
    // 在key数组为空时，直接会刷新空info数组
    that.setData({
      eventInfoArray: eventInfoArray
    });
  },

  // 循环team_key数组，请求team_info
  teamKey2Info: function(teamKeyArray, that) {
    var teamInfoArray = []; // 每次都必须完全刷新
    var requestCount = 0; // 请求是异步返回数据的，通过计数判断是否所有请求都完成

    for (var i in teamKeyArray) {
      var curTeamkey = teamKeyArray[i]; // 当前循环的event_key

      app.httpsRequest(`/team/${curTeamkey}/simple`, res => {
        // 添加到info数组
        teamInfoArray.push(res);

        requestCount += 1;

        if (requestCount == teamKeyArray.length) {
          // 在key数组为空时，直接会刷新空info数组
          that.setData({
            teamInfoArray: teamInfoArray
          });
        }
      });
    }

    // 在key数组为空时，直接会刷新空info数组
    that.setData({
      teamInfoArray: teamInfoArray
    });
  },

  //   跳转到下一个event-detail页函数
  eventCardClick: function(event) {
    var eventKey = event.detail;

    wx.navigateTo({
      url: `/pages/event-detail/event-detail?event_key=${eventKey}`
    });
  },

  //   跳转到下一个team-detail页函数
  teamCardClick: function(event) {
    var teamKey = event.detail;

    wx.navigateTo({
      url: `/pages/team-detail/team-detail?team_key=${teamKey}`
    });
  }
};

module.exports = {
  utils: utils
};
