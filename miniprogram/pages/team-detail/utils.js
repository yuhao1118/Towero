/* API 列表 */
// 1. /team/{team_key}                          通过team_key查询队伍信息
// 2. /team/{team_key}/events/keys              通过team_key查询所有event_key
// 3. /team/{team_key}/events/{year}            查看队伍指定一年的所有event

import { getEventYears, dateSort, dateReplace } from '../../utils/methodList';

var app = getApp();

var utils = {
  // 请求 teamInfo Api函数
  teamInfo: function(that) {
    var teamKey = that.data.teamKey;

    app.httpsRequest(`/team/${teamKey}`, res => {
      that.setData({
        teamInfo: res
      });

      // 设置页面标题
      var title = 'Team ' + app.jsonSafeProp('res.team_number', res);
      wx.setNavigationBarTitle({
        title: title
      });
    });
  },

  // 获取eventYears函数
  eventYears: function(that) {
    var teamKey = that.data.teamKey;

    app.httpsRequest(`/team/${teamKey}/events/keys`, res => {
      var eventYears = getEventYears(res);
      var selectedYear = eventYears.length > 0 ? eventYears[0] : null; // 设置null而不是undefined
      that.setData({
        eventYears: eventYears,
        selectedYear: selectedYear // 设置eventYears的同时设置默认选择的年份为最近一年
      });

      // 数组长度大于0才说明参加过比赛
      if (that.data.eventYears.length > 0) {
        this.teamYearEvent(that); // 获取默认选择年份的比赛信息
      }
    });
  },

  // 请求 teamYearEvent Api函数
  teamYearEvent: function(that) {
    var teamKey = that.data.teamKey;
    var selectedYear = that.data.selectedYear;
    var eventInfoWithTitleArray = [
      //   {
      //     title: '', // title-bar显示值
      //     eventInfoArray: new Array() // 分类后的eventInfoArray
      //   }
    ]; // 有title-bar的数组

    app.httpsRequest(`/team/${teamKey}/events/${selectedYear}`, res => {
      for (var i in res) {
        var eventInfo = res[i];

        //   新增两个起始日期的属性
        if (eventInfo.hasOwnProperty('start_date')) {
          eventInfo.start_date_str = dateReplace(eventInfo.start_date);
        }

        if (eventInfo.hasOwnProperty('end_date')) {
          eventInfo.end_date_str = dateReplace(eventInfo.end_date);
        }
      }

      res.sort(dateSort); //  按日期从小到大排序

      for (var i in res) {
        var curEventInfo = res[i]; // 当前循环的eventInfo对象
        var { event_type_string } = curEventInfo; // event类型
        var hasTitle = false; // 是否已经存在标题

        for (var j in eventInfoWithTitleArray) {
          var curEFWTObj = eventInfoWithTitleArray[j]; // 循环当前对象
          var { title, eventInfoArray } = curEFWTObj;

          //   找到已有标题
          if (event_type_string == title) {
            eventInfoArray.push(curEventInfo);
            hasTitle = true;
          }
        }

        //   循环结束且没有找到已有标题则新增一个EFWT对象
        if (!hasTitle) {
          var newEFWTObj = {
            title: event_type_string,
            eventInfoArray: new Array()
          };

          newEFWTObj.eventInfoArray.push(curEventInfo);
          eventInfoWithTitleArray.push(newEFWTObj);
        }
      }

      that.setData({
        eventInfoWithTitleArray: eventInfoWithTitleArray
      });
    });
  },

  // 年份选择器
  selectYear: function(event, that) {
    that.setData({
      selectedYear: event.detail
    });
  },

  //   跳转到下一个team-event页函数
  teamCardClick: function(event, that) {
    var eventKey = event.detail;
    var teamKey = that.data.teamKey;

    // team-event跳转到另一个team-event的,pageFrom参数继承于父页
    wx.navigateTo({
      url: `/pages/team-event/team-event?team_key=${teamKey}&event_key=${eventKey}&page_from=team`
    });
  },

  // 页面跳转携参函数
  linkParam: function(options, that) {
    var teamKey = options.team_key;

    that.setData({
      teamKey: options.team_key
    });
  }
};

module.exports = {
  utils: utils
};
