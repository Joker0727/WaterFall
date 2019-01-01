var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus: false,
    inputValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.showModal({
      title: '提示',
      content: "小程序体验版，留言功能尚未开放，敬请发布上线！",
      success(res) {
        if (res.confirm) {
          // wx.switchTab({
          //     url: "../home/home"
          // })
        } else if (res.cancel) {
          // wx.switchTab({
          //      url: "../home/home"
          // })
        }
      }
    });
  },
  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  toSearch: function(e) {
    let that = this;
    util.showToast(that.data.inputValue, "none");
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})