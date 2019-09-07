Page({
    data: {},
  
    // 生命周期函数--监听页面加载
    onLoad: function(options) {},
  
    // 生命周期函数--监听页面显示
    onShow: function() {
      this.getTabBar().init();        // 更新tab-bar选中态
    },
  
    // 用户点击右上角分享
    onShareAppMessage: function() {}
  });
  