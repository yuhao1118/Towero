import { dateReplace, monthFormat } from '../../utils/methodList';
/* API 列表 */
// 1. /status                          获取到max_season赛季

var app = getApp();

var utils = {
  // 获取20个赛事，追加式添加
  getEvents: function(that, index) {
    var db = wx.cloud.database();
    var defaultEventArray = that.data.defaultEventArray;
    var selectedDate =
      that.data.selectedYear + monthFormat(that.data.selectedMonth);
    var gap = 20; // 单次请求为20个赛事信息
    var skip = index * gap; // 需要跳过的

    console.log(selectedDate);

    db.collection('events')
      .where({
        start_date: db.RegExp({
          regexp: selectedDate,
          options: 'i'
        })
      })
      .skip(skip)
      .limit(gap)
      .get()
      .then(res => {
        // 合并到已有的数据中
        for (var i in res.data) {
          var eventInfo = res.data[i];

          //   新增两个起始日期的属性
          if (eventInfo.hasOwnProperty('start_date')) {
            eventInfo.start_date_str = dateReplace(eventInfo.start_date);
          }

          if (eventInfo.hasOwnProperty('end_date')) {
            eventInfo.end_date_str = dateReplace(eventInfo.end_date);
          }

          defaultEventArray.push(eventInfo);
        }

        that.setData({
          defaultEventArray: defaultEventArray,
          scrollIndex: index, // 每次加载完都更新一次index值
          lastLoadFinish: true, // 设置当前懒加载完成
          hasNextEvent : false
        });
      })
      .catch(err => {
        console.error(err);
      });
  },

  // 触底函数
  reachBottom: function(that) {
    var lastLoadFinish = that.data.lastLoadFinish;
    var index = that.data.scrollIndex;

    that.setData({
        hasNextEvent : true
    })

    if (lastLoadFinish) {
      index += 1;
      this.getEvents(that, index);
    }
  },

  // 搜索函数
  search: function(event, that) {
    var searchValue = event.detail; // 获取到的搜索字符串
    var db = wx.cloud.database();
    var selectedYear = parseInt(that.data.selectedYear);
    var _ = db.command; // 数据库高级功能command
    var name_raw = searchValue.match(/^[A-Za-z][A-Za-z\s]*[A-Za-z]$/gi); // 模糊匹配队名正则表达式
    var name_regexp = name_raw ? name_raw.toString() : searchValue; // 数据库查询正则表达式接收匹配后的字符串

    that.setData({
      lastSearchFinish: false, // 加载loading
      searchValue: searchValue,
      isSearch: true
    });

    db.collection('events')
      .where(
        _.and([
          {
            year: _.eq(selectedYear) // 精确匹配赛事字段
          },
          {
            name: db.RegExp({
              // 或模糊匹配赛事名称字段
              regexp: name_regexp,
              options: 'i'
            })
          }
        ])
      )
      .get({
        success: res => {
          for (var i in res.data) {
            var eventInfo = res.data[i];
            //   新增两个起始日期的属性
            if (eventInfo.hasOwnProperty('start_date')) {
              eventInfo.start_date_str = dateReplace(eventInfo.start_date);
            }

            if (eventInfo.hasOwnProperty('end_date')) {
              eventInfo.end_date_str = dateReplace(eventInfo.end_date);
            }
          }
          that.setData({
            searchEventArray: res.data, // 查询到的数组
            lastSearchFinish: true
          });
        }
      });
  },

  // 取消搜索
  searchCancel: function(that) {
    that.setData({
      isSearch: false,
      searchEventArray: null
    });
  },

  //   跳转到下一个event-detail页函数
  eventCardClick: function(event) {
    var eventKey = event.detail;

    wx.navigateTo({
      url: `/pages/event-detail/event-detail?event_key=${eventKey}`
    });
  },

  // 搜索框filter按钮点击事件
  filterClick: function(that) {
    that.setData({
      showPopUp: true
    });
  },

  // 弹出层关闭事件
  popUpClose: function(that) {
    that.setData({
      showPopUp: false
    });
  },

  pickerConfirm: function(event, that) {
    var selectedYear = event.detail.value[0];
    var selectedMonth = event.detail.index[1] + 1;

    var selectedYearIndex = event.detail.index[0];
    var selectedMonthIndex = event.detail.index[1];

    var pickerColumn = that.data.pickerColumn;
    var index = 0;

    // 更新pickerColumn的默认选择
    pickerColumn[0].defaultIndex = selectedYearIndex;
    pickerColumn[1].defaultIndex = selectedMonthIndex;

    that.setData({
      scrollIndex: index, // 重新选择年份后清空之前的index
      defaultEventArray: [], // 重新选择年份后清空之前的eventinfo
      pickerColumn: pickerColumn,
      selectedYear: selectedYear,
      selectedMonth: selectedMonth,
      showPopUp: false // confirm后设置弹出层为关闭状态
    });

    // 重新选择年份后更新defaultEventArray
    this.getEvents(that, index);
  },

  //   启动初始化函数
  load: function(that) {
    app.httpsRequest('/status', res => {
      var eventYearsArray = [];
      var { current_season, max_season } = res; // 获取当前赛季年份和最大赛季年份
      var start_year = 1992; // 比赛成立年份
      var index = that.data.scrollIndex;
      var pickerColumn = that.data.pickerColumn;
      var curDate = new Date();

      // 创建picker显示数组，倒叙
      for (var i = max_season; i >= start_year; i--) {
        eventYearsArray.push(i); // 添加赛事年份数组
      }

      //   更新年份列
      pickerColumn[0].values = eventYearsArray;
      pickerColumn[0].defaultIndex = max_season - current_season; // 让picker默认选择当前年份的索引而不是最大赛季年份

      //   更新月份列
      //   默认选择当前月份的赛事, 否则为下一年2月比赛
      pickerColumn[1].defaultIndex = current_season != curDate.getFullYear() ? 1 : curDate.getMonth();
      var selectedMonth = current_season != curDate.getFullYear() ? 2 : curDate.getMonth() + 1;

      that.setData({
        isIphoneX: app.data.isIphoneX,
        pickerColumn: pickerColumn,
        selectedYear: current_season, // 默认选择为当前年份
        selectedMonth: selectedMonth // 默认选择为当前月份
      });

      this.getEvents(that, index);
    });
  }
};

module.exports = {
  utils: utils
};
