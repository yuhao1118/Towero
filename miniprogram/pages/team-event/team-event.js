/*  队伍的比赛详情页
    启动参数：1. team_key  --  e.g. frc6766
            2. event_key --  e.g. 2019hiho
            3. page_from --  e.g. 从哪个页面跳转而来
    示例：/pages/team-event/team-event?team_key=frc6766&event_key=2019hiho&page_from=event
*/
import { utils } from '/utils';

/* API 列表 */
// 1. /team/{team_key}/event/{event_key}/status     队伍赛事情况简介
// 2. /team/{team_key}/event/{event_key}/matches    队伍比赛
// 3. /event/{event_key}/oprs                       获取到全部Opr信息
// 4. /team/{team_key}/event/{event_key}/awards     队伍获奖信息
// 5. /event/{event_key}/teams/simple               获取该赛事所有参赛队伍信息: Award需要队伍nickname
// 6. /team/{team_key}/simple                       获取队伍信息
// 7. /event/{event_key}/simple                     获取赛事信息

Page({
  data: {
    activeTabs: 0, // 当前激活的tab
    teamKey: String, // team_key -- e.g. frc6766 用于索引队伍信息
    eventKey: String, // event_key -- e.g. 2019hiho 用于索引赛事信息
    pageFrom: String, // 从哪个页面跳转而来。可选值: team event team_match(从当前页的matches标签页跳转)
    teamInfo: Object, // 存放队伍信息
    eventInfo: Object, // 存放赛事信息
    teamInfoObj: Object, // 存放所有队伍信息的对象，以team_key为属性
    summaryInfo: Object, // 存放summary页所有信息的对象
    oprObj: Object, // 存放opr数据的
    awardsArray: Array, // 存放所有奖项信息的数组
    matchInfo: Object /* 存放所有比赛信息 
                                    {
                                        qm : Array,     // 资格赛数组
                                        qf : Array,     // 四分之一决赛数组
                                        sf : Array,     // 半决赛数组
                                        f : Array       // 决赛数组
                                    }
                                    */
  },

  // 生命周期函数--监听页面加载
  onLoad: function(options) {
    utils.linkParam(options, this);
    utils.teamInfo2Obj(this);
    utils.teamEventInfo(this);
    utils.summaryInfo(this);
    utils.awardInfo(this);
  },

  //   切换Tab
  onTabChange: function(event) {
    var activeTabs = event.detail.index;

    // Matches Tab页
    if (activeTabs == 1) {
      utils.matchesInfo(this);
    }
    // Stats Tab页
    else if (activeTabs == 2) {
      utils.oprInfo(this);
    }
    // Awards Tab页
    else if (activeTabs == 3) {
      utils.awardInfo(this);
    }

    this.setData({
      activeTabs: activeTabs
    });
  },

  // 点击team-card事件，自动返回teamKey
  onTeamCardClick: function(event) {
    var teamKey = event.detail;
    var eventKey = this.data.eventKey;

    wx.navigateTo({
      url: `/pages/team-event/team-event?team_key=${teamKey}&event_key=${eventKey}&page_from=match`
    });
  },

  // 用户点击右上角分享
  onShareAppMessage: function() {}
});
