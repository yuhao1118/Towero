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
    onClick: function() {
        var eventKey = this.properties.eventInfo.key
        this.triggerEvent("event", eventKey);
    }
  }
});
