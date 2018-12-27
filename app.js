//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // 获取用户信息            url: "https://54188.xyz/api/account/getwxvalidate", 
        wx.getSetting({
          success: resInfo => {
            if (resInfo.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: function (resInfo) {
                  var app = getApp();
                  wx.request({
                    url: "https://54188.xyz/api/account/getwxvalidate", 
                    data: {
                      code: res.code,
                      encryptedData: resInfo.encryptedData,
                      iv: resInfo.iv
                    },
                    method: 'GET',
                    success: function (res) {
                      console.log(res);
                      // if (res.data.Code == 0) {
                      //   //console.log(res.data.Data);
                      //   app.globalData.userInfo = res.data.Data
                      //   console.log(app.globalData.userInfo)
                      //   //wx.setStorageSync("SessionKey", app.globalData.userInfo.sessionKey)
                      //   wx.request({
                      //     url: app.globalData.apiUrl + 'Account/ExistsAccount',
                      //     data: {
                      //       identifier: res.data.Data.openId
                      //     },
                      //     method: 'GET',
                      //     success: function (resExists) {
                      //       if (resExists.data.Code == 0) {
                      //         if (resExists.data.Count <= 0) {
                      //           console.log("还未注册")
                      //           //开始注册
                      //           wx.request({
                      //             url: app.globalData.apiUrl + 'Account/WXRegister',
                      //             data: {
                      //               "Account_Id": 0,
                      //               "Identifier": res.data.Data.openId,
                      //               "RealName": "",
                      //               "NickName": res.data.Data.nickName,
                      //               "Avatar": res.data.Data.avatarUrl,
                      //               "Gender": res.data.Data.gender,
                      //               "Birthday": "1990-1-1",
                      //               "Email": "",
                      //               "Phone": "",
                      //               "DataFlag": 1,
                      //               "PassWord": "123456",
                      //               "Province": "",
                      //               "City": res.data.Data.city,
                      //               "CountyArea": res.data.Data.country,
                      //               "AreaInfomation_Id": 0,
                      //               "DetailAddress": "",
                      //               "Contact": "",
                      //               "ContactNumber": "",
                      //               "UpdateTime": "2018-07-09",
                      //               "MailBind": 0,
                      //               "PhoneBind": 0,
                      //               "AuthType": 3,
                      //               "RegisterIP": "192.168.1.1",
                      //               "CheckCode": "",
                      //               "CityCode": "",
                      //               "CityName": res.data.Data.city,
                      //               "Longitude": "",
                      //               "Latitude": "",
                      //               "CityLongitude": "",
                      //               "CityLatitude": ""
                      //             },
                      //             method: 'POST',
                      //             header: {
                      //               'content-type': 'application/x-www-form-urlencoded'
                      //             },
                      //             success: function (resRegister) {
                      //               if (resRegister.data.Code == 0) {
                      //                 console.log(resRegister)
                      //                 // console.log("获取到的openid为：" + res.data)
                      //                 // that.globalData.openid = res.data
                      //                 //wx.setStorageSync('openid', res.data)
                      //               } else {
                      //                 console.log(res.errMsg)
                      //               }
                      //             },
                      //           })
                      //         } else {
                      //           console.log("已经注册")
                      //         }
                      //       }
                      //     }
                      //   })
                      // } else {
                      //   //console.log(res)
                      // }
                    },
                  })
                }
              })
            }
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})