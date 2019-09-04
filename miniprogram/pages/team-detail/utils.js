/* API 列表 */
// 1. /team/{team_key}                          通过team_key查询队伍信息
// 2. /team/{team_key}/events/keys              通过team_key查询所有event_key
// 3. /team/{team_key}/events/{year}            查看队伍指定一年的所有event

import { getEventYears, dateSort, dateReplace } from '../../utils/methodList';

var app = getApp();

var utils = {
  // 请求 teamInfo Api函数
  teamInfo: function(that) {
    var teamKey = that.data.teamKey;

    app.httpsRequest(`/team/${teamKey}`, res => {
      that.setData({
        teamInfo: res
      });
    });
  },

  // 获取eventYears函数
  eventYears: function(that) {
    var teamKey = that.data.teamKey;
    
    app.httpsRequest(`/team/${teamKey}/events/keys`, res => {
      var eventYears = getEventYears(res);
      var selectedYear = eventYears.length > 0 ? eventYears[0] : null; // 设置null而不是undefined
      that.setData({
        eventYears: eventYears,
        selectedYear: selectedYear // 设置eventYears的同时设置默认选择的年份为最近一年
      });

      // 数组长度大于0才说明参加过比赛
      if (that.data.eventYears.length > 0) {
        this.teamYearEvent(that); // 获取默认选择年份的比赛信息
      }
    });
  },

  // 请求 teamYearEvent Api函数
  teamYearEvent: function(that) {
    var teamKey = that.data.teamKey;
    var selectedYear = that.data.selectedYear;

    app.httpsRequest(`/team/${teamKey}/events/${selectedYear}`, res => {
      for (var i in res) {
        var eventInfo = res[i];

        //   新增两个起始日期的属性
        if (eventInfo.hasOwnProperty('start_date')) {
          eventInfo.start_date_str = dateReplace(eventInfo.start_date);
        }

        if (eventInfo.hasOwnProperty('end_date')) {
          eventInfo.end_date_str = dateReplace(eventInfo.end_date);
        }
      }

      res.sort(dateSort); //  按日期从小到大排序

      that.setData({
        eventInfoArray: res
      });
    });
  },

  // 年份选择器
  selectYear: function(event, that) {
    that.setData({
      selectedYear: event.detail
    });
  },

  // tab切换函数
  tabChange: function(event, that) {
    that.setData({
      activeTabs: event.detail.index
    });
  },

  // 页面跳转携参函数
  linkParam: function(options, that) {
    that.setData({
      teamKey: options.team_key
    });
  }
};

module.exports = {
    utils: utils
};
