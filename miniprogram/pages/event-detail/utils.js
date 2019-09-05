/* API 列表 */
// 1. /event/{event_key}                            获取到赛事信息
// 2. /event/{event_key}/teams/simple               获取到参赛队伍信息
// 3. /event/{event_key}/rankings                   获取到排名信息，以及各队比赛小分总分
// 4. /event/{event_key}/alliances                  获取到联盟信息，Alliance name有可能会缺少
// 5. /event/{event_key}/awards                     获取到奖项信息
// 6. /event/{event_key}/oprs                       获取到全部Opr信息
// 7. /event/{event_key}/teams/keys                 获取全部team_key
// 8. /event/{event_key}/matches                    获取全部比赛信息

import {
  teamSort,
  oprSort,
  matchSort,
  dateReplace
} from '../../utils/methodList';

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

          //   添加team_number 临时队号没有team_info
          curTeamRanking.team_number = team_key.replace('frc', '');

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

      Object.keys(res.oprs).forEach(key => {
        var teamKey = key;
        var teamNumber = teamKey.replace('frc', '');
        var oprs = app
          .jsonSafeProp('oprObj.oprs.' + teamKey, oprObj)
          .toFixed(2);
        var dprs = app
          .jsonSafeProp('oprObj.dprs.' + teamKey, oprObj)
          .toFixed(2);
        var ccwms = app
          .jsonSafeProp('oprObj.ccwms.' + teamKey, oprObj)
          .toFixed(2);
        var teamInfo = app.jsonSafeProp('teamInfoObj.' + teamKey, teamInfoObj);

        oprArray.push({
          oprs: oprs,
          dprs: dprs,
          ccwms: ccwms,
          key: teamKey,
          team_number: teamNumber,
          team_info: teamInfo
        });
      });

      oprArray.sort(oprSort);

      that.setData({
        oprArray: oprArray
      });
    });
  },

  //    请求alliances Api函数
  allianceInfo: function(that) {
    var eventKey = that.data.eventKey;

    app.httpsRequest(`/event/${eventKey}/alliances`, res => {
      // 补全level信息和alliance name，因为有可能会缺少（一个是最终晋级，一个是联盟编号）
      //   生成picks_team_number属性 联盟队伍数组，内容为team_number
      for (var i in res) {
        var allianceObj = res[i];
        var { picks } = allianceObj; // 联盟队伍数组，内容为team_key

        // 去掉team_key的frc头
        if (picks && picks.length > 0) {
          var picks_team_number = [];
          for (var j in picks) {
            picks_team_number.push(picks[j].replace('frc', ''));
          }
          allianceObj.picks_team_number = picks_team_number;
        }

        // 补全level信息
        if (!app.jsonSafeProp('allianceObj.status.level', allianceObj)) {
          allianceObj.status = {
            level: 'QF'
          };
        }

        // 把level信息转成大写
        allianceObj.status.level = allianceObj.status.level.toUpperCase();

        // 补全name信息
        if (!allianceObj.hasOwnProperty('name') || !allianceObj.name) {
          var index = parseInt(i) + 1;
          allianceObj.name = 'Alliance ' + index;
        }
      }

      that.setData({
        alliancesArray: res
      });
    });
  },

  //   请求matches Api函数
  matchesInfo: function(that) {
    var eventKey = that.data.eventKey;
    var matchInfo = {
      qm: [],
      qf: [],
      sf: [],
      f: []
    };

    app.httpsRequest(`/event/${eventKey}/matches`, res => {
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
        matchInfo: matchInfo
      });
    });
  },

  //   请求award Api函数
  awardInfo: function(that) {
    var eventKey = that.data.eventKey;

    app.httpsRequest(`/event/${eventKey}/awards`, res => {
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
        awardsArray: res
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
