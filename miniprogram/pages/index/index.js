//index.js
var app = getApp();

Page({
  data: {
    teamNumber: Number,
    eventKey: String
  },

  onLoad: function() {},

  onShow: function() {
    this.getTabBar().init();      // 更新tabbar选中态
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

  onTeamEvent: function() {}
});
