/* API 列表 */
// 1. /team/{team_key}/event/{event_key}/status     队伍赛事情况简介
// 2. /team/{team_key}/event/{event_key}/matches    队伍比赛
// 3. /event/{event_key}/oprs                       获取到全部Opr信息
// 4. /team/{team_key}/event/{event_key}/awards     队伍获奖信息
// 5. /event/{event_key}/teams/simple               获取该赛事所有参赛队伍信息: Award需要队伍nickname
// 6. /team/{team_key}/simple                       获取队伍信息
// 7. /event/{event_key}/simple                     获取赛事信息

import { teamSort, matchSort, brFilter } from '../../utils/methodList';

var app = getApp();

var utils = {
  // 请求 teamInfo eventInfo Api函数
  teamEventInfo: function(that) {
    var eventKey = that.data.eventKey;
    var teamKey = that.data.teamKey;

    app.httpsRequest(`/event/${eventKey}/simple`, eventRes => {
      app.httpsRequest(`/team/${teamKey}/simple`, teamRes => {
        that.setData({
          eventInfo: eventRes ? eventRes : {},
          teamInfo: teamRes ? teamRes : {}
        });

        // 设置页面标题
        var title =
          app.jsonSafeProp('teamRes.team_number', teamRes) +
          '@' +
          app.jsonSafeProp('eventRes.name', eventRes);

        wx.setNavigationBarTitle({
          title: title
        });
      });
    });
  },

  //   请求summary Api函数
  summaryInfo: function(that) {
    var teamKey = that.data.teamKey;
    var eventKey = that.data.eventKey;

    app.httpsRequest(`/team/${teamKey}/event/${eventKey}/status`, res => {
      if (res) {
        // 去<b> </b>
        var {
          alliance_status_str,
          overall_status_str,
          playoff_status_str
        } = res;
        res.alliance_status_str = brFilter(alliance_status_str);
        res.overall_status_str = brFilter(overall_status_str);
        res.playoff_status_str = brFilter(playoff_status_str);

        // 整合小分总分字符串
        var sort_orders = app.jsonSafeProp('res.qual.ranking.sort_orders', res);
        var sort_order_info = app.jsonSafeProp('res.qual.sort_order_info', res);

        if (sort_orders && sort_orders.length > 0) {
          var sort_orders_str = '';

          for (var i in sort_order_info) {
            var { precision, name } = sort_order_info[i];
            var value = sort_orders[i];

            sort_orders_str += name + ': ' + value.toFixed(precision) + ' ';
          }

          // 添加sort_orders_str属性
          res.sort_orders_str = sort_orders_str;
        }

        that.setData({
          summaryInfo: res
        });
      } else {
        that.setData({
          summaryInfo: {}
        });
      }
    });
  },

  //   请求matches Api函数
  matchesInfo: function(that) {
    var teamKey = that.data.teamKey;
    var eventKey = that.data.eventKey;

    var matchInfo = {
      qm: [],
      qf: [],
      sf: [],
      f: []
    };

    app.httpsRequest(`/team/${teamKey}/event/${eventKey}/matches`, res => {
      for (var i in res) {
        var curMatchObj = res[i];
        var { comp_level } = curMatchObj;

        // 增加team_numbers属性
        var blueTeamKey = app.jsonSafeProp(
          'curMatchObj.alliances.blue.team_keys',
          curMatchObj
        );
        var redTeamKey = app.jsonSafeProp(
          'curMatchObj.alliances.red.team_keys',
          curMatchObj
        );

        // 替换蓝方teamKey
        if (blueTeamKey && blueTeamKey.length > 0) {
          var blueTeamNumber = [];

          for (var i in blueTeamKey) {
            var teamNumber = blueTeamKey[i].replace('frc', '');
            blueTeamNumber.push(teamNumber);
          }

          curMatchObj.alliances.blue.team_numbers = blueTeamNumber;
        }

        // 替换红方teamKey
        if (redTeamKey && redTeamKey.length > 0) {
          var redTeamNumber = [];

          for (var i in redTeamKey) {
            var teamNumber = redTeamKey[i].replace('frc', '');
            redTeamNumber.push(teamNumber);
          }

          curMatchObj.alliances.red.team_numbers = redTeamNumber;
        }

        // 将比赛分类
        if (
          comp_level == 'qm' ||
          comp_level == 'qf' ||
          comp_level == 'sf' ||
          comp_level == 'f'
        ) {
          matchInfo[comp_level].push(curMatchObj);
        }
      }

      matchInfo.qm.sort(matchSort);
      matchInfo.qf.sort(matchSort);
      matchInfo.sf.sort(matchSort);
      matchInfo.f.sort(matchSort);

      that.setData({
        matchInfo: matchInfo ? matchInfo : {}
      });
    });
  },

  //   请求opr Api函数
  oprInfo: function(that) {
    var teamKey = that.data.teamKey;
    var eventKey = that.data.eventKey;

    app.httpsRequest(`/event/${eventKey}/oprs`, res => {
      var oprObj = {
        opr: Number,
        dpr: Number,
        ccwm: Number
      };

      if (res.hasOwnProperty('oprs')) {
        Object.keys(res.oprs).forEach(key => {
          if (key == teamKey) {
            var opr = app.jsonSafeProp('res.oprs.' + key, res).toFixed(2);
            var dpr = app.jsonSafeProp('res.dprs.' + key, res).toFixed(2);
            var ccwm = app.jsonSafeProp('res.ccwms.' + key, res).toFixed(2);

            oprObj = {
              opr: opr,
              dpr: dpr,
              ccwm: ccwm
            };
          }
        });
      }

      that.setData({
        oprObj: oprObj ? oprObj : {}
      });
    });
  },

  //   请求award Api函数
  awardInfo: function(that) {
    var teamKey = that.data.teamKey;
    var eventKey = that.data.eventKey;

    app.httpsRequest(`/team/${teamKey}/event/${eventKey}/awards`, res => {
      var teamInfoObj = that.data.teamInfoObj; // 以team_key为属性的对象

      // 增加team_info属性
      for (var i in res) {
        var awardInfo = res[i];
        var { recipient_list } = awardInfo;

        // recipient_list也是一个数组，里面有获奖队伍的team_key
        for (var j in recipient_list) {
          var recipientInfo = recipient_list[j];
          var { team_key } = recipientInfo;

          if (team_key) {
            var teamInfo = teamInfoObj[team_key];

            // 增加team_info属性
            recipientInfo.team_info = teamInfo;
          }
        }
      }

      that.setData({
        awardsArray: res ? res : []
      });
    });
  },

  //   将teamInfoArray转换为以team_key为属性的对象: Award需要队伍nickname
  teamInfo2Obj: function(that) {
    var eventKey = that.data.eventKey;
    var teamInfoObj = {};
    app.httpsRequest(`/event/${eventKey}/teams/simple`, res => {
      res.sort(teamSort);

      for (var i in res) {
        var teamInfo = res[i]; // 获取单独队伍信息

        //   以team_key为属性添加到teamInfoObj
        if (teamInfo.hasOwnProperty('key')) {
          var teamKey = teamInfo.key;
          teamInfoObj[teamKey] = teamInfo;
        }
      }

      that.setData({
        teamInfoObj: teamInfoObj
      });
    });
  },

  //   跳转到下一个team-event页函数
  teamCardClick: function(event, that) {
    var teamKey = event.detail;
    var eventKey = that.data.eventKey;
    var pageFrom = that.data.pageFrom;

    // team-event跳转到另一个team-event的,pageFrom参数继承于父页
    wx.navigateTo({
      url: `/pages/team-event/team-event?team_key=${teamKey}&event_key=${eventKey}&page_from=${pageFrom}`
    });
  },

  //   跳转队伍/赛事信息函数
  naviClick: function(that) {
    var pageFrom = that.data.pageFrom;
    if (pageFrom == 'team') {
      // 从team来的去event页

      var eventKey = that.data.eventKey;
      wx.navigateTo({
        url: `/pages/event-detail/event-detail?event_key=${eventKey}`
      });
    }

    if (pageFrom == 'event') {
      // 从event来的去team页

      var teamKey = that.data.teamKey;
      wx.navigateTo({
        url: `/pages/team-detail/team-detail?team_key=${teamKey}`
      });
    }
  },

  // 分享小程序函数
  shareAppMessage: function(that) {
    var eventName = that.data.eventInfo.name;
    var teamNumber = that.data.teamInfo.team_number;
    var eventKey = that.data.eventKey;
    var teamKey = that.data.teamKey

    return {
      title: `${teamNumber} @ ${eventName}`,
      path: `/pages/team-tab/team-tab?link_type=team_event&team_key=${teamKey}&event_key=${eventKey}`
    };
  },

  // 页面跳转携参函数
  linkParam: function(options, that) {
    var fabIcon = '';

    if (options.page_from == 'team') {
      fabIcon = 'label';
    }

    if (options.page_from == 'event') {
      fabIcon = 'friends';
    }

    that.setData({
      teamKey: options.team_key,
      eventKey: options.event_key,
      pageFrom: options.page_from,
      fabIcon: fabIcon
    });
  }
};

module.exports = {
  utils: utils
};
