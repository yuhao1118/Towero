var app = getApp();

var utils = {
  // 获取20个队伍，追加式添加
  getTeams: function(that, index) {
    var db = wx.cloud.database();
    var defaultTeamArray = that.data.defaultTeamArray;
    var gap = 20; // 单次请求为20只队伍
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

  // 搜索函数
  search: function(event, that) {
    var searchValue = event.detail; // 获取到的搜索字符串
    var db = wx.cloud.database();
    var _ = db.command; // 数据库高级功能command
    var name = searchValue.match(/^[A-Za-z][A-Za-z\s]*[A-Za-z]$/gi);    // 模糊匹配队名正则表达式
    var name_regexp = name ? name.toString() : searchValue  // 数据库查询正则表达式接收匹配后的字符串

    that.setData({
      lastSearchFinish: false, // 加载loading
      searchValue: searchValue,
      isSearch: true
    });

    db.collection('teams')
      .where(
        _.or([
          {
            team_number: _.eq(parseInt(searchValue)) // 精确匹配队号字段
          },
          {
            nickname: db.RegExp({
              // 或模糊匹配队名字段
              regexp: name_regexp,
              options: 'i'
            })
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

  // 取消搜索
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
  },

  //   启动初始化函数
  load: function(that){
      that.setData({
          isIphoneX : app.data.isIphoneX
      })
  }
};

module.exports = {
  utils: utils
};
