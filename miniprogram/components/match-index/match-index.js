// components/match-index/match-index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    matchInfo: Object,
    curTeam: String // 当前队伍编号
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    //   点击team-card自动触发event事件（可以bind），同时返回teamKey
    //  将match-card触发的event点击事件转发给pages
    onClick: function(event) {
      var teamKey = event.detail;
      this.triggerEvent('event', teamKey);
    }
  }
});
