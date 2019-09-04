// components/event-card/event-card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    eventInfo: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //   点击event-card自动触发event事件（可以bind），同时返回eventKey
    onClick: function() {
        var eventKey = this.properties.eventInfo.key
        this.triggerEvent("event", eventKey);
    }
  }
});
