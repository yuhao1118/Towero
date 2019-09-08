// 搜索队伍页

import { utils } from '/utils.js';

Page({
  data: {
    isIphoneX: false, //为iPhone X做底部tabbar适配
    scrollIndex: 0, // 第几次触碰到页面底部计数，默认为0，不为空
    isSearch: false, // 是否处于搜索状态，决定要加载的数组，以及loading组件
    searchValue: String, // 搜索数据字符串
    lastSearchFinish: false, // 上一次搜索是否完成
    lastLoadFinish: false, // 上一次懒加载是否完成（若未完成，在这期间的触底不加入计数）
    defaultTeamArray: new Array(), // 默认显示的teamInfo数组，一次50个，懒加载，必须初始化
    searchTeamArray: Array // 搜索结果返回的teamInfo数组，无需初始化，因为每次都会给赋值一个数组
  },

  // 生命周期函数--监听页面加载
  onLoad: function(options) {
    utils.load(this);
    var index = this.data.scrollIndex;
    utils.getTeams(this, index);
  },

  // 生命周期函数--监听页面显示
  onShow: function() {
    this.getTabBar().init(); // 更新tab-bar选中态
  },

  // 触底自动触发函数
  onReachBottom: function() {
    utils.reachBottom(this);
  },

  // 搜索事件触发函数
  onSearch: function(event) {
    utils.search(event, this);
  },

  // 取消搜索触发函数
  onSearchCanel: function() {
    utils.searchCancel(this);
  },

  // 点击team-card触发事件
  onTeamCardClick: function(event) {
    utils.teamCardClick(event);
  },

  // 用户点击右上角分享
  onShareAppMessage: function() {}
});
