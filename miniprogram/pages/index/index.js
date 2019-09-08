//index.js
var app = getApp();

Page({
  data: {
    teamNumber: Number,
    eventKey: String,
    showPopUp: false, // 是否显示弹出层
    selectedYear: 2019, // picker当前选中的年份
    eventYearsArray: [2019, 2018, 2017], // 存放从1992年到max_season的赛事年份数组，倒叙
    pickerDefaultSelected: 0 // picker默认选择索引
  },

  onLoad: function() {},

  onShow: function() {
    this.getTabBar().init(); // 更新tabbar选中态
  },

  onTeamNumberInput: function(event) {
    this.setData({
      teamNumber: event.detail.value
    });
  },

  onEventKeyInput: function(event) {
    this.setData({
      eventKey: event.detail.value
    });
  },

  onTeamDetail: function() {
    wx.navigateTo({
      url: `/pages/team-detail/team-detail?team_key=frc${this.data.teamNumber}&page_from=main_page`
    });
  },

  onEventDetail: function() {
    wx.navigateTo({
      url: `/pages/event-detail/event-detail?event_key=${this.data.eventKey}&page_from=main_page`
    });
  },

  onTeamEvent: function() {
    console.log('click');
    this.setData({
      showPopUp: true
    });
  }
});
