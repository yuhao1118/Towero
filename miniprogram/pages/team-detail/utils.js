/* API 列表 */
// 1. /team/{team_key}                          通过team_key查询队伍信息
// 2. /team/{team_key}/events/keys              通过team_key查询所有event_key
// 3. /team/{team_key}/events/{year}            查看队伍指定一年的所有event

import { getEventYears } from "../../utils/arrayProcess";

// 请求 teamInfo Api函数
// app          --      app全局对象
function teamInfo(app, that) {
  var teamKey = that.data.teamKey;
  app.httpsRequest(`/team/${teamKey}`, res => {
    that.setData({
      teamInfo: res
    });
  });
}

// 获取eventYears函数
// app          --      app全局对象
function eventYears(app, that) {
  var teamKey = that.data.teamKey;
  app.httpsRequest(`/team/${teamKey}/events/keys`, res => {
    var eventYears = getEventYears(res);
    that.setData({
      eventYears: eventYears,       
      selectedYear: eventYears[0]       // 设置eventYears的同时设置默认选择的年份为最近一年
    });
  });
}

// 请求 teamYearEvent Api函数
// app          --      app全局对象
function teamYearEvent(app, that) {
  var teamKey = that.data.teamKey;
  var selectedYear = that.data.selectedYear;
  app.httpsRequest(`/team/${teamKey}/events/${selectedYear}`, res => {
    that.setData({
      eventInfoArray: res
    });
  });
}

// 年份选择器
// event        --      包含当前选择的年份的对象
function selectYear(event, that) {
  that.setData({
    selectedYear: event.detail
  });
}

// tab切换函数
// event        --      包含当前选中的tab的对象
function tabChange(event, that) {
  that.setData({
    activeTabs: event.detail.index
  });
}

// 页面跳转携参函数
// options        --      包含跳转时携带的参数的对象
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
