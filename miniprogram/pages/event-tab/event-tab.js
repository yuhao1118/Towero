// 搜索s赛事页

import { utils } from '/utils.js';

Page({
  data: {
    isIphoneX: false, //为iPhone X做底部tabbar适配
    scrollIndex: 0, // 第几次触碰到页面底部计数，默认为0，不为空
    isSearch: false, // 是否处于搜索状态，决定要加载的数组，以及loading组件
    searchValue: String, // 搜索数据字符串
    lastSearchFinish: false, // 上一次搜索是否完成
    lastLoadFinish: false, // 上一次懒加载是否完成（若未完成，在这期间的触底不加入计数）
    hasNextEvent: true, // 是否还有赛事信息可加载，决定是否显示loading
    defaultEventArray: new Array(), // 默认显示的eventInfo数组，一次50个，懒加载，必须初始化
    searchEventArray: Array, // 搜索结果返回的eventInfo数组，无需初始化，因为每次都会给赋值一个数组
    showPopUp: false, // 是否显示弹出层
    selectedYear: Number, // picker当前选中的年份
    selectedMonth: Number, // picker当前选中的月份
    pickerColumn: [ // picker多列选择对象
        {
            values: Array, // 存放从1992年到max_season的赛事年份数组，倒叙
            className: 'YearColumn',
            defaultIndex: 0,
          },
          {
            values: [ // 存放每年的全部月份
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'June',
                'July',
                'Aug',
                'Sept',
                'Oct',
                'Nov',
                'Dec'
              ],
            className: 'MonthColumn',
            defaultIndex: 0
          }
    ],
  },

  // 生命周期函数--监听页面加载
  onLoad: function(options) {
    utils.load(this);
  },

  // 生命周期函数--监听页面显示
  onShow: function() {
    this.getTabBar().init(); // 更新tab-bar选中态
  },

  // 触底自动触发函数
  onReachBottom: function() {
    utils.reachBottom(this);
  },

  // 搜索事件触发函数
  onSearch: function(event) {
    utils.search(event, this);
  },

  // 取消搜索触发函数
  onSearchCanel: function() {
    utils.searchCancel(this);
  },

  // 点击event-card触发事件
  onEventCardClick: function(event) {
    utils.eventCardClick(event);
  },

  // 搜索框filter按钮点击事件
  onFilterClick: function() {
    utils.filterClick(this);
  },

  // 弹出层关闭事件
  onPopUpClose: function() {
    utils.popUpClose(this);
  },

  // 年份picker
  onPickerConfirm: function(event) {
    utils.pickerConfirm(event, this);
  },

  // 用户点击右上角分享
  onShareAppMessage: function() {}
});
