/*  队伍详情页
    启动参数：1. team_key  --  e.g. frc6766
            2. page_from      --  从哪个界面跳转来。可选值：event, main_page
    示例：/pages/team-detail/team-detail?team_key=frc6766&page_from=event
*/
import {
  selectYear,
  tabChange,
  linkParam,
  teamInfo,
  eventYears,
  teamYearEvent
} from "/utils";

var app = getApp();

/* API 列表 */
// 1. /team/{team_key}                          通过team_key查询队伍信息
// 2. /team/{team_key}/events/keys              通过team_key查询所有event_key
// 3. /team/{team_key}/events/{year}            查看队伍指定一年的所有event

Page({
  // 页面的初始数据
  data: {
    activeTabs: 0, // 当前激活的Tab的索引
    teamKey: String, // team_key -- e.g. frc6766 用于从缓存里索引队伍信息
    pageFrom: String, // 从哪个界面跳转来
    teamInfo: Object, // 从缓存中索引到的队伍信息
    eventYears: Array, // eventKeys处理去重得到的队伍参赛年份数组
    selectedYear: Number, // 当前选中的参赛年份（指定一年）
    eventInfoArray: Array // 从缓存中索引到的赛事信息数组
  },

  // 生命周期函数--监听页面加载
  onLoad: function(options) {
    linkParam(options, this); //   保存跳转参数
    teamInfo(app, this);
    eventYears(app, this);
  },

  // 切换Tab事件
  onTabChange: function(event) {
    tabChange(event, this); //   刷新tab切换数据
  },

  // 切换年份选择器事件
  onSelectYear: function(event) {
    selectYear(event, this); //   刷新选择器数据
    teamYearEvent(app, this);
  },

  // 用户点击右上角分享
  onShareAppMessage: function() {}
});
