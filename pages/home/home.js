var util = require('../../utils/util.js');
let col1H = 0;
let col2H = 0;
let isCanLoad = true;
let openId = "";
let accountId = 0;

Page({
  data: {
    scrollH: 0,
    imgWidth: 0,
    loadingCount: 0,
    images: [],
    col1: [],
    col2: [],
    page: 1
  },

  onLoad: function() {
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.48;
        let scrollH = wh;

        this.setData({
          scrollH: scrollH,
          imgWidth: imgWidth
        });
        isCanLoad: true;
        this.loadImages();
      }
    });
    this.gettingCache();
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    isCanLoad: true;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    isCanLoad: true;
  },
  onImageLoad: function(e) {
    let imageId = e.currentTarget.id;
    let oImgW = e.detail.width; //图片原始宽度
    let oImgH = e.detail.height; //图片原始高度
    let imgWidth = this.data.imgWidth; //图片设置的宽度
    let scale = imgWidth / oImgW; //比例计算
    let imgHeight = oImgH * scale; //自适应高度
    let images = this.data.images;
    let imageObj = null;
    for (let i = 0; i < images.length; i++) {
      let img = images[i];
      if (img.Id == imageId) {
        imageObj = img;
        break;
      }
    }

    if (imageObj)
      imageObj.height = imgHeight;

    let loadingCount = this.data.loadingCount - 1;
    let col1 = this.data.col1;
    let col2 = this.data.col2;

    if (col1H <= col2H) {
      col1H += imgHeight;
      col1.push(imageObj);
    } else {
      col2H += imgHeight;
      col2.push(imageObj);
    }

    let data = {
      loadingCount: loadingCount,
      col1: col1,
      col2: col2
    };

    if (!loadingCount) {
      data.images = [];
      if (!isCanLoad)
        isCanLoad = true;
    }
    this.setData(data);
  },

  loadImages: function() {
    var that = this;
    util.showToast("拼命加载中...", "loading");
    if (!isCanLoad) return;
    isCanLoad = false;
    wx.request({
      method: "POST",
      url: "https://54188.xyz/api/imagespiderapi/getcatalog?accId=2&page=" + this.data.page,
      success: function(res) {
        if (res.data.length > 0) {
          let tempImages = that.data.images;
          tempImages.push(...res.data);
          that.setData({
            loadingCount: res.data.length,
            images: tempImages,
            page: that.data.page + 1
          });
          wx.hideToast();
        } else {
          isCanLoad = true;
          util.showToast("暂无更多!", "none");
        }
      },
      fail: function(res) {
        isCanLoad = true;
        util.showToast("加载失败!", "none");
      }
    });
  },

  toDetails: (e) => {
    let catalogid = e.currentTarget.dataset.catalogid;
    let imgUrl = e.currentTarget.dataset.src;
    util.showLoading("玩命加载中...");
    wx.request({
      method: "GET",
      url: "https://54188.xyz/api/account/addbrowse?accountId=" + accountId + "&catalogId=" + catalogid,
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      }
    });
    wx.navigateTo({
      url: "../details/details?catalogid=" + catalogid + ""
    });
    wx.hideLoading();
  },

  toCollection: function(e) {
    let imgObj = e.currentTarget.dataset.imgobj;
    let catalogid = imgObj.Id;
    let iscollection = imgObj.IsCollection;
    if (!iscollection) {
      wx.request({
        method: "GET",
        url: "https://54188.xyz/api/account/addcollectionrecord?accountId=" + accountId + "&catalogId=" + catalogid,
        success: function(res) {
          imgObj.IsCollection = true;
          util.showToast("收藏成功!");
        },
        fail: function(res) {
          util.showToast("添加收藏失败!", "none");
        }
      });
    } else {
      wx.request({
        method: "GET",
        url: "https://54188.xyz/api/account/deletecollectionrecord?accountId=" + accountId + "&catalogId=" + catalogid,
        success: function(res) {
          imgObj.IsCollection = false;
          util.showToast("取消收藏成功!");
        },
        fail: function(res) {
          util.showToast("取消收藏失败!", "none");
        }
      });
    }
  },

  gettingCache: function() {

    try {
      const value = wx.getStorageSync('AccountId')
      if (value) {
        accountId = value;
      }
    } catch (e) {
      util.showToast("请稍后操作!", "loading");
    }
  }

})