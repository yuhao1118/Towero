var app = getApp();

var utils = {
  // 获取50个队伍，追加式添加
  getTeams: function(that, index) {
    var db = wx.cloud.database();
    var defaultTeamArray = that.data.defaultTeamArray;
    var gap = 50; // 单次请求为50只队伍
    var skip = index * gap; // 需要跳过的

    db.collection('teams')
      .skip(skip) // 跳过
      .limit(gap) // 限制返回数量
      .get()
      .then(res => {
        // 合并到已有的数据中
        for (var i in res.data) {
          defaultTeamArray.push(res.data[i]);
        }

        that.setData({
          defaultTeamArray: defaultTeamArray,
          scrollIndex: index, // 每次加载完都更新一次index值
          lastLoadFinish: true // 设置当前懒加载完成
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

    if (lastLoadFinish) {
      index += 1;
      this.getTeams(that, index);
    }
  },

  search: function(event, that) {
    var searchValue = event.detail; // 获取到的搜索字符串
    var db = wx.cloud.database();
    var _ = db.command; // 数据库高级功能command

    that.setData({
      lastSearchFinish: false, // 加载loading
      searchValue: searchValue,
      isSearch: true
    });

    db.collection('teams')
      .where(
        _.or([
          {
            team_number: _.eq(parseInt(searchValue)) // 匹配队号字段
          },
          {
            nickname: _.eq(searchValue) // 或者匹配队伍名字段
          }
        ])
      )
      .get({
        success: res => {
          that.setData({
            searchTeamArray: res.data, // 查询到的数组
            lastSearchFinish: true
          });
        }
      });
  },

  searchCancel: function(that) {
    that.setData({
      isSearch: false,
      searchTeamArray: null
    });
  },

  //   跳转到下一个team-detail页函数
  teamCardClick: function(event) {
    var teamKey = event.detail;

    wx.navigateTo({
      url: `/pages/team-detail/team-detail?team_key=${teamKey}`
    });
  }
};

module.exports = {
  utils: utils
};
