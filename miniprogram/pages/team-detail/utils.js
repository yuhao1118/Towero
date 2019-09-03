/* API 列表 */
// 1. /team/{team_key}                          通过team_key查询队伍信息
// 2. /team/{team_key}/events/keys              通过team_key查询所有event_key
// 3. /team/{team_key}/events/{year}            查看队伍指定一年的所有event

import { getEventYears, dateSort } from '../../utils/arrayProcess';

var app = getApp();

// 请求 teamInfo Api函数
function teamInfo(that) {
  var teamKey = that.data.teamKey;
  app.httpsRequest(`/team/${teamKey}`, res => {
    that.setData({
      teamInfo: res
    });
  });
}

// 获取eventYears函数
function eventYears(that) {
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
      teamYearEvent(that); // 获取默认选择年份的比赛信息
    }
  });
}

// 请求 teamYearEvent Api函数
function teamYearEvent(that) {
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
}

// 日期替换器，将eventInfo里的起始日期的属性替换成英文简写
function dateReplace(dateStr) {
  var date = new Date(dateStr);
  var tempArr = date.toDateString().split(' ');
  var res = tempArr[1] + ' ' + tempArr[2]; // 只返回日月即可，年份由另外的属性获取
  return res;
}

// 年份选择器
function selectYear(event, that) {
  that.setData({
    selectedYear: event.detail
  });
}

// tab切换函数
function tabChange(event, that) {
  that.setData({
    activeTabs: event.detail.index
  });
}

// 页面跳转携参函数
function linkParam(options, that) {
  that.setData({
    teamKey: options.team_key,
    pageFrom: options.page_from
  });
}

module.exports = {
  selectYear: selectYear,
  tabChange: tabChange,
  linkParam: linkParam,
  teamInfo: teamInfo,
  eventYears: eventYears,
  teamYearEvent: teamYearEvent
};
