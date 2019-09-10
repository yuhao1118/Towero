App({
  // 小程序全局数据
  data: {
    isIphoneX: false, //为iPhone X做底部tabbar适配
    loginInfo: Object /* 用户登录信息
                                    {
                                        appid : String,
                                        openid : String
                                    }
                    */
  },

  // Https直接请求函数封装
  // api        -- 请求api链接
  // onSuccess   -- 请求成功（来自缓存/网络）回调函数
//   httpsRequest: function(api, onSuccess) {
//     var url = `https://www.thebluealliance.com/api/v3${api}`;
//     var lastModified = '';
//     var tbaAuthKey =
//       'kbxvOnS2csBH6fzQ8zijLw2f1k135fWp8NgTEfPRg1n8hYqh7SSUo9VJ3JEBlnIg';
//     var isExpire = true; // 缓存是否失效，如果失效则发生http请求（如果304，失效的缓存也可以用，只不过要更新时间）
//     var curRequestCache = {}; // 当前的缓存

//     // 一开始立即返回本地缓存 (可能是旧的数据，可以先让客户端渲染)
//     wx.getStorage({
//       key: api,

//       //   成功获取到缓存，同时获取到缓存记录的lastModified
//       success: res => {
//         curRequestCache = res.data; // 给304用
//         lastModified = res.data.lastModified;

//         var lastedLime = (new Date() - new Date(res.data.storageTime)) / 1000;
//         isExpire = lastedLime > 3600; // 设置6分钟失效

//         console.log('getStorage isExpire', isExpire);
//         onSuccess(res.data.httpData);
//       },

//       //   无论是否成功获取到缓存，都请求。如果获取缓存失败则lastModified为空字符串
//       complete: function() {
//         // 如果失效，则真实请求
//         if (isExpire) {
//           console.log('isExpired, requesting...');

//           wx.request({
//             url: url,
//             header: {
//               'content-type': 'application/json', // 文本类型为Json
//               'X-TBA-Auth-Key': tbaAuthKey, // tba请求认证key
//               'If-Modified-Since': lastModified //最后一次修改头的时间
//             },

//             //   请求成功的回调函数
//             success: res => {
//               //   如果请求200，保存数据到本地（这里肯定是新的数据，刷新操作），同时回调
//               if (res.statusCode == 200) {
//                 console.log('200, real expired, setting new cache...');

//                 // 全新的缓存
//                 var requestCache = {
//                   httpData: res.data, // http请求结果的数据(data)部分
//                   storageTime: new Date(), //存储缓存的时间，用于记录缓存过期
//                   lastModified: res.header['Last-Modified'] // http请求最后一次修改时间的头
//                 };

//                 wx.setStorage({
//                   key: api,
//                   data: requestCache
//                 });

//                 onSuccess(requestCache.httpData);
//               }
//               // 说明缓存并没有失效，只更新时间，无需回调（一开始已经回调过了）
//               else if (res.statusCode == 304) {
//                 console.log('304, not expired, updating time...');

//                 curRequestCache.storageTime = new Date();
//                 wx.setStorage({
//                   key: api,
//                   data: curRequestCache
//                 });
//               }
//               // 其他任何错误，返回空对象
//               else {
//                 onSuccess({});
//               }
//             }
//           });
//         }
//       }
//     });
//   },

  // Https云函数请求封装
  // api        -- 请求api链接
  // onSuccess  -- 请求成功（来自缓存/网络）回调函数
  httpsRequest: function(api, onSuccess) {
    var lastModified = '';
    var isExpire = true; // 缓存是否失效，如果失效则发生http请求（如果304，失效的缓存也可以用，只不过要更新时间）
    var curRequestCache = {}; // 当前的缓存

    // 一开始立即返回本地缓存 (可能是旧的数据，可以先让客户端渲染)
    wx.getStorage({
      key: api,

      //   成功获取到缓存，同时获取到缓存记录的lastModified
      success: res => {
        curRequestCache = res.data; // 给304用
        lastModified = res.data.lastModified;

        var lastedLime = (new Date() - new Date(res.data.storageTime)) / 1000;
        isExpire = lastedLime > 3600; // 设置6分钟失效

        console.log('getStorage isExpire', isExpire);
        onSuccess(res.data.httpData);
      },

      //   无论是否成功获取到缓存，都请求。如果获取缓存失败则lastModified为空字符串
      complete: function() {
        // 如果失效，则真实请求
        if (isExpire) {
          console.log('isExpired, requesting...');

          wx.cloud.callFunction({
            name: 'httpsRequest', // 云函数名
            data: {
              // 调用云函数时传递的参数
              api: api,
              lastModified: lastModified
            },

            //   请求成功的回调函数
            success: resCloud => {
              var res = resCloud.result;

              //   如果请求200，保存数据到本地（这里肯定是新的数据，刷新操作），同时回调
              if (res.statusCode == 200) {
                console.log('200, real expired, setting new cache...');

                // 全新的缓存
                var requestCache = {
                  httpData: res.data, // http请求结果的数据(data)部分
                  storageTime: new Date(), //存储缓存的时间，用于记录缓存过期
                  lastModified: res.header['last-modified'] // http请求最后一次修改时间的头
                };

                wx.setStorage({
                  key: api,
                  data: requestCache
                });

                onSuccess(requestCache.httpData);
              }
              // 说明缓存并没有失效，只更新时间，无需回调（一开始已经回调过了）
              else if (res.statusCode == 304) {
                console.log('304, not expired, updating time...');

                curRequestCache.storageTime = new Date();
                wx.setStorage({
                  key: api,
                  data: curRequestCache
                });
              }
              // 其他任何错误，返回空对象
              else {
                onSuccess({});
              }
            }
          });
        }
      }
    });
  },

  // 更新云收藏功能
  // teamKeyArray           --      存放team_key的数组（只有可能从数据库传来）
  // eventKeyArray          --      存放event_key的数组（只有可能从数据库传来）
  // type                   --      更新数据的类型，可选值：add，delete，将影响toast信息
  // onSuccess              --      更新成功时回调
  updateFavor: function(teamKeyArray, eventKeyArray, type, onSuccess) {
    var db = wx.cloud.database();
    var openid = this.data.loginInfo.openid;

    db.collection('favor')
      .doc(openid)
      .update({
        data: {
          teams: teamKeyArray,
          events: eventKeyArray
        },
        success: res => {
          console.log('update success');

          // 如果时添加后更新
          if (type == 'add') {
            wx.showToast({
              title: 'Favor success',
              icon: 'none',
              duration: 2000
            });
          }
          // 如果是删除后更新
          else if (type == 'delete') {
            wx.showToast({
              title: 'Delete success',
              icon: 'none',
              duration: 2000
            });
          }
          // 成功回调
          onSuccess();
        }
      });
  },

  // 获取云收藏
  // onSuccess  -- 添加成功回调
  getFavor: function(onSuccess) {
    var db = wx.cloud.database();
    var _ = db.command; // 数据库高级功能command
    var openid = this.data.loginInfo.openid;

    db.collection('favor')
      .where({
        _id: _.eq(openid)
      })
      .get({
        success: res => {
          if (res.data.length > 0) {
            console.log('Get success');

            // 向回调函数传递teams和events数组
            onSuccess(res.data[0].teams, res.data[0].events);
          }
        }
      });
  },

  // 从数据库查找一个给定的key
  // type       -- 要查找的key的类型，可选值event，team
  // key        -- 要查找的key，event_key team_key
  // onSuccess  -- 查找成功回调，同时传递是否存在的布尔变量
  getKey: function(type, key, onSuccess) {
    //   先请求数据库获取当前收藏内容
    this.getFavor((teamKeyArray, eventKeyArray) => {
      if (type == 'team') {
        if (teamKeyArray.indexOf(key) == -1) {
          onSuccess(false); // 未查找到
        } else {
          onSuccess(true); // 查找到
        }
      }

      if (type == 'event') {
        if (eventKeyArray.indexOf(key) == -1) {
          onSuccess(false); // 未查找到
        } else {
          onSuccess(true); // 查找到
        }
      }
    });
  },

  // 从数据库添加一个给定的key
  // type       -- 要添加的key的类型，可选值event，team
  // key        -- 要添加的key，event_key team_key
  // onSuccess  -- 添加成功回调
  addFavor: function(type, key, onSuccess) {
    //   先请求数据库获取当前收藏内容
    this.getFavor((teamKeyArray, eventKeyArray) => {
      // 数据库中搜索team_key
      if (type == 'team' && teamKeyArray.indexOf(key) == -1) {
        teamKeyArray.push(key);
      }

      // 数据库中搜索event_key
      if (type == 'event' && eventKeyArray.indexOf(key) == -1) {
        eventKeyArray.push(key);
      }

      // 更新数据库数据
      this.updateFavor(teamKeyArray, eventKeyArray, 'add', onSuccess);
    });
  },

  // 从数据库删除一个给定的key
  // type       -- 要删除的key的类型，可选值event，team
  // key        -- 要删除的key，event_key team_key
  // onSuccess  -- 添加成功回调
  deleteFavor: function(type, key, onSuccess) {
    //   先请求数据库获取当前收藏内容
    this.getFavor((teamKeyArray, eventKeyArray) => {
      // 数据库中搜索team_key
      if (type == 'team' && teamKeyArray.indexOf(key) != -1) {
        var index = teamKeyArray.indexOf(key);
        teamKeyArray.splice(index, 1);
      }

      // 数据库中搜索event_key
      if (type == 'event' && eventKeyArray.indexOf(key) != -1) {
        var index = eventKeyArray.indexOf(key);
        eventKeyArray.splice(index, 1);
      }

      // 更新数据库数据
      this.updateFavor(teamKeyArray, eventKeyArray, 'delete', onSuccess);
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
  },

  // 小程序启动函数
  onLaunch: function() {
    //   初始化云环境
    wx.cloud.init({
      env: 'frcevent-test-62914c'
    });

    //   通过云函数获取用户登录态
    wx.cloud.callFunction({
      name: 'login', // 云函数名
      success: res => {
        // 请求成功获取到用户登录信息
        // 保存用户登录信息
        this.data.loginInfo = res.result;

        // 为当前用户在数据库中创建收藏对象（如果不存在）
        var db = wx.cloud.database();
        var _ = db.command; // 数据库高级功能command
        var openid = res.result.openid;

        // 先通过id查找
        db.collection('favor')
          .where({
            _id: _.eq(openid)
          })
          .get({
            success: res => {
              // 说明不存在收藏对象
              if (res.data.length == 0) {
                console.log('favor obj not exist, adding...');
                //   添加收藏对象
                db.collection('favor').add({
                  data: {
                    _id: openid,
                    teams: [],
                    events: []
                  },
                  success: res => {
                    // 添加成功
                    console.log('add success');
                  }
                });
              }
            }
          });
      }
    });
  },

  // 小程序显示阶段触发函数
  onShow: function() {
    //   为iPhone X做tabbar适配
    wx.getSystemInfo({
      success: res => {
        if (res.model.indexOf('iPhone X') > -1) {
          this.data.isIphoneX = true;
        }
      }
    });
  }
});
