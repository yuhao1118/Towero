// 设置页

var app = getApp();

Page({
  data: {
    isIphoneX: false, //为iPhone X做底部tabbar适配
    githubLink: 'https://github.com/eddy20001118/FRCMiniProgram',
    wechatAccount: 'Embed Chamber',
    developerEmail: 'yuhao_li@hotmail.com',
    cacheSize: Number // 当前缓存容量
  },

  // 生命周期函数--监听页面加载
  onLoad: function(options) {
    this.setData({
      isIphoneX: app.data.isIphoneX
    });
  },

  // 生命周期函数--监听页面显示
  onShow: function() {
    this.getTabBar().init(); // 更新tab-bar选中态
    wx.getStorageInfo({
      success: res => {
        this.setData({
          cacheSize: res.currentSize.toFixed(2)
        });
      }
    });
  },

  // 点击需要复制cell触发事件
  onCopyClick: function(event) {
    var id = event.target.id; // 通过id判断是哪个cell被点击了
    var copyText = ''; // 将要被复制的文本文字

    if (id == '1') {
      copyText = this.data.githubLink;
    } else if (id == '2') {
      copyText = this.data.wechatAccount;
    } else if (id == '3') {
      copyText = this.data.developerEmail;
    }

    wx.setClipboardData({
      data: copyText
    });
  },

  // 清理缓存
  onFreeCacheClick: function() {
    wx.clearStorage({
      success: () => {
        wx.showToast({
          title: 'Cache deleted',
          icon: 'none',
          duration: 2000
        });

        this.setData({
          cacheSize: parseInt(0).toFixed(2)
        });
      }
    });
  },

  // 用户点击右上角分享
  onShareAppMessage: function() {}
});
