// components/match-card/match-card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    match: Object, //  比赛队伍及得分细节
    type: String, // 比赛类型： qm, qf, sf, f
    curTeam: Number // 当前队伍
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
    onRedClick: function(event) {
      var index = event.target.id;
      var teamKey = this.properties.match.alliances.red.team_keys[index];
      this.triggerEvent('event', teamKey);
    },

    //   点击team-card自动触发event事件（可以bind），同时返回teamKey
    onBlueClick: function(event) {
      var index = event.target.id;
      var teamKey = this.properties.match.alliances.blue.team_keys[index];
      this.triggerEvent('event', teamKey);
    }
  }
});
