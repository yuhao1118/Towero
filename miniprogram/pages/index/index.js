//index.js
var app = getApp();

Page({
  data: {},

  onLoad: function() {},

  onTeamDetail: function() {
    wx.navigateTo({
      url: `/pages/team-detail/team-detail?team_key=frc6766&page_from=main_page`
    });
  },
  onEventDetail: function() {},
  onTeamEvent: function() {}
});
