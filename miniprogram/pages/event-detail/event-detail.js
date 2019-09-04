/*  赛事详情页
    启动参数：1. event_key  --  e.g. frc6766
    示例：/pages/event-detail/event-detail?event_key=2019casf
*/
import { utils } from '/utils';

/* API 列表 */
// 1. /event/{event_key}                            获取到赛事信息
// 2. /event/{event_key}/teams/simple               获取到参赛队伍信息
// 3. /event/{event_key}/rankings                   获取到排名信息，以及各队比赛小分总分
// 4. /event/{event_key}/alliances                  获取到联盟信息，Alliance name有可能会缺少
// 5. /event/{event_key}/awards                     获取到奖项信息
// 6. /event/{event_key}/oprs                       获取到全部Opr信息
// 7. /event/{event_key}/teams/keys                 获取全部team_key

Page({
  // 页面的初始数据
  data: {
    activeTabs: 0, // 当前激活的Tab的索引
    eventKey: String, // event_key -- e.g: 2019casf
    eventInfo: Object, // 存放赛事信息
    teamInfoArray: Array, // 存放所有队伍信息的数组
    teamInfoObj: Object, // 存放所有队伍信息的对象，以team_key为属性 
    alliancesArray: Array, // 存放所有联盟信息的数组
    awardsArray: Array, // 存放所有奖项信息的数组
    rankArray: Array, // 存放所有排名信息的数组
    oprArray: Array // 存放所有opr数据的数组
  },

  // 生命周期函数--监听页面加载
  onLoad: function(options) {
    utils.linkParam(options, this)
    utils.eventInfo(this)
    utils.teamInfo2Obj(this)
  },

  //   切换Tab
  onTabChange: function(event) {
    var activeTabs = event.detail.index;

    // Info taby页
    if (activeTabs == 0) {
    }
    // Teams Tab页
    else if (activeTabs == 1) {
      utils.teamInfo(this);
    }
    // Rankings Tab页
    else if (activeTabs == 2) {
      utils.rankInfo(this);
    }
    // Matches Tab页
    else if (activeTabs == 3) {
    }
    // Alliances Tab页
    else if (activeTabs == 4) {
    }
    // Stats Tab页
    else if (activeTabs == 5) {
        utils.oprInfo(this)
    }
    // Awards Tab页
    else if (activeTabs == 6) {
    }

    this.setData({
      activeTabs: activeTabs
    });
  },

    // 点击team-card事件，自动返回teamKey
    onTeamCardClick: function(event) {
        var teamKey = event.detail;
        wx.navigateTo({
          url: `/pages/team-detail/team-detail?team_key=${teamKey}`
        });
      },

  // 用户点击右上角分享
  onShareAppMessage: function() {}
});
