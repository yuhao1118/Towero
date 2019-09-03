//index.js
var app = getApp();

Page({
  data: {
    teamNumber: Number
  },

  onLoad: function() {},

  onTeamNumberInput: function(event) {
    this.setData({
      teamNumber: event.detail.value
    });
  },

  onTeamDetail: function() {
    wx.navigateTo({
      url: `/pages/team-detail/team-detail?team_key=frc${this.data.teamNumber}&page_from=main_page`
    });
  },

  onEventDetail: function() {},

  onTeamEvent: function() {}
});
