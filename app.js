//app.js
var util = require('/utils/util.js');
App({
  onLaunch: function () {
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
                      try {
                        wx.clearStorageSync();
                      } catch (e) {
                        console.log(e);
                      }
                      util.toSetStorageSync("AccountId", res.data.AccountId);
                    },
                    fail:function(e){
                      util.showToast("登陆失败!", "none", 800);
                    }
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