// 云收藏展示页

/* API 列表 */
// 1. /event/{event_key}/simple                            获取到赛事信息
// 2. /team/{team_key}/simple                              获取到队伍信息

import { utils } from '/utils.js';

Page({
  data: {
    teamInfoArray: new Array(), // 存放teamInfo卡片的数组
    eventInfoArray: new Array() // 存放eventInfo卡片的数组
  },

  onShow: function() {
    this.getTabBar().init(); // 更新tabbar选中态
    utils.getFavorArray(this);  // 刷新页面数据
  },

  // 点击team-card触发事件
  onTeamCardClick: function(event) {
    utils.teamCardClick(event);
  },

  // 点击event-card触发事件
  onEventCardClick: function(event) {
    utils.eventCardClick(event);
  }
});
