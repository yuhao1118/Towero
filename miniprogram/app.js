//app.js

App({
  // Https请求函数封装
  // api        -- 请求api链接
  // onSuccess   -- 请求成功（来自缓存/网络）回调函数
  httpsRequest: function(api, onSuccess) {
    var url = `https://www.thebluealliance.com/api/v3${api}?X-TBA-Auth-Key=kbxvOnS2csBH6fzQ8zijLw2f1k135fWp8NgTEfPRg1n8hYqh7SSUo9VJ3JEBlnIg`;
    var lastModified = '';

    // 一开始立即返回本地缓存 (可能是旧的数据，可以先让客户端渲染)
    wx.getStorage({
      key: api,

      //   成功获取到缓存，同时获取到缓存记录的lastModified
      success: function(res) {
        lastModified = res.data.lastModified;
        onSuccess(res.data.httpData);
      },

      //   无论是否成功获取到缓存，都请求。如果获取缓存失败则lastModified为空字符串
      complete: function() {
        wx.request({
          url: url,
          header: {
            'content-type': 'application/json', // 文本类型为Json
            'If-Modified-Since': lastModified //最后一次修改头的时间
          },

          //   请求成功的回调函数
          success: function(res) {
            var requestCache = {
              httpData: res.data, // http请求结果的数据(data)部分
              lastModified: res.header['Last-Modified'] // http请求最后一次修改时间的头
            };

            //   如果请求200，保存数据到本地（这里肯定是新的数据，刷新操作），同时回调
            if (res.statusCode == 200) {
              wx.setStorage({
                key: api,
                data: requestCache
              });

              onSuccess(requestCache.httpData);
            }
          }
        });
      }
    });
  },

  // Json嵌套对象属性检查函数
  // path           -- 嵌套对象的路径（包括起始对象）
  // rawObject      -- 起始对象
  // currentObject  -- path走通的最后一个对象
  jsonSafeProp: function(path, rawObject) {
    var pathArray = path.split('.'); // 将路径分割成单独的属性名
    var currentObject = rawObject;
    var nextProp = pathArray[1]; // 循环到当前的属性名，初始为数组第一个元素
    var index = 1; // 循环计数

    if (rawObject) {
      while (currentObject && currentObject.hasOwnProperty(nextProp)) {
        currentObject = currentObject[nextProp];
        index++;
        if (index == pathArray.length) {
          //   如果path全部走通，则返回当前对象，否则（默认）返回undefined
          return currentObject;
        }
        nextProp = pathArray[index];
      }
    }
  }
});
