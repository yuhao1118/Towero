// components/award-card/award-card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    awardInfo: Object
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    //   触发event事件（可以bind），同时返回teamKey
    onClick: function(event) {
      var index = event.target.id;
      var teamKey = this.properties.awardInfo.recipient_list[index].team_key;
      if (teamKey) {
        this.triggerEvent('event', teamKey);
      }
    }
  }
});
