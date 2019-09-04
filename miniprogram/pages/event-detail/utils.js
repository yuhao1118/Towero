/* API 列表 */
// 1. /event/{event_key}                            获取到赛事信息
// 2. /event/{event_key}/teams/simple               获取到参赛队伍信息
// 3. /event/{event_key}/rankings                   获取到排名信息，以及各队比赛小分总分
// 4. /event/{event_key}/alliances                  获取到联盟信息，Alliance name有可能会缺少
// 5. /event/{event_key}/awards                     获取到奖项信息
// 6. /event/{event_key}/oprs                       获取到全部Opr信息
// 7. /event/{event_key}/teams/keys                 获取全部team_key

import { teamSort, oprSort, dateReplace } from '../../utils/methodList';

var app = getApp();

var utils = {
  // 请求 eventInfo Api函数
  eventInfo: function(that) {
    var eventKey = that.data.eventKey;

    app.httpsRequest(`/event/${eventKey}`, res => {
      //   新增两个起始日期的属性
      if (res.hasOwnProperty('start_date')) {
        res.start_date_str = dateReplace(res.start_date);
      }

      if (res.hasOwnProperty('end_date')) {
        res.end_date_str = dateReplace(res.end_date);
      }

      that.setData({
        eventInfo: res
      });
    });
  },

  // 请求 teamInfo Api函数
  teamInfo: function(that) {
    var eventKey = that.data.eventKey;
    app.httpsRequest(`/event/${eventKey}/teams/simple`, res => {
      res.sort(teamSort);
      that.setData({
        teamInfoArray: res
      });
    });
  },

  //   请求排名 Api函数
  rankInfo: function(that) {
    var eventKey = that.data.eventKey;

    app.httpsRequest(`/event/${eventKey}/rankings`, res => {
      var { extra_stats_info, sort_order_info, rankings } = res;
      var teamInfoObj = that.data.teamInfoObj; // 以team_key为属性的对象
      console.log(teamInfoObj);

      // 确保有排名信息
      if (rankings) {
        // 为ranking添加队伍信息
        for (var i in rankings) {
          var curTeamRanking = rankings[i]; // 当前队伍的排名信息
          var { extra_stats, sort_orders, team_key } = curTeamRanking; // 获取team_key
          var extra_stats_str = '';
          var sort_orders_str = '';

          //   添加team_info属性
          curTeamRanking.team_info = teamInfoObj[team_key];

          //   处理extra_stats_str属性
          for (var j in extra_stats_info) {
            var { name, precision } = extra_stats_info[j];
            var value = extra_stats[j];
            extra_stats_str += name + ': ' + value.toFixed(precision) + ' ';
          }

          //   处理sort_orders_str
          for (var j in sort_order_info) {
            var { precision, name } = sort_order_info[j];
            var value = sort_orders[j];
            sort_orders_str += name + ': ' + value.toFixed(precision) + ' ';
          }

          //   拼接与详细得分有关的字符串
          curTeamRanking.score_str = extra_stats_str + sort_orders_str;
        }
      }

      that.setData({
        rankArray: res.rankings
      });
    });
  },

  //    请求opr Api函数
  oprInfo: function(that) {
    var eventKey = that.data.eventKey;
    var oprArray = [];

    app.httpsRequest(`/event/${eventKey}/oprs`, res => {
      var oprObj = res; // 未经处理的所有opr数据
      var teamInfoObj = that.data.teamInfoObj; // 以team_key为属性的对象

      app.httpsRequest(`/event/${eventKey}/teams/keys`, res => {
        for (var i in res) {
          var teamKey = res[i];
          var oprs = app
            .jsonSafeProp('oprObj.oprs.' + teamKey, oprObj)
            .toFixed(2);
          var dprs = app
            .jsonSafeProp('oprObj.dprs.' + teamKey, oprObj)
            .toFixed(2);
          var ccwms = app
            .jsonSafeProp('oprObj.ccwms.' + teamKey, oprObj)
            .toFixed(2);
          var teamInfo = app.jsonSafeProp(
            'teamInfoObj.' + teamKey,
            teamInfoObj
          );

          oprArray.push({
            oprs: oprs,
            dprs: dprs,
            ccwms: ccwms,
            team_info: teamInfo
          });
        }

        oprArray.sort(oprSort);

        that.setData({
          oprArray: oprArray
        });
      });
    });
  },

  //   将teamInfoArray转换为以team_key为属性的对象
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

  // 页面跳转携参函数
  linkParam: function(options, that) {
    that.setData({
      eventKey: options.event_key
    });
  }
};

module.exports = {
  utils: utils
};
