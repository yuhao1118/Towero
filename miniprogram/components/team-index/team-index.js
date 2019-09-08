// components/team-index/team-index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    teamInfo: Object, // 队伍信息对象
    eventYears: Array, // 队伍参赛年份数组
    selectedYear: Number // 当前选择的年份
  },

  /**
   * 组件的初始数据
   */
  data: {
    yearCellClick: false // 年份单元格显示弹出层
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //   年份单元格点击事件
    onYearCellClick: function() {
      this.setData({
        yearCellClick: true
      });
    },

    // 弹出层关闭事件
    onPopUpClose: function() {
      this.setData({
        yearCellClick: false
      });
    },

    // 选择器改变事件
    onPickerConfirm: function(event) {
      var selectedYear = event.detail.value;
      this.setData({
        selectedYear: selectedYear,
        yearCellClick: false  // confirm后设置弹出层为关闭状态
      });

      this.triggerEvent("event", selectedYear);
    }
  }
});
