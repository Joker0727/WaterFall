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
        if (res.system.indexOf("iOS") != -1){
          util.showModal("iPhone，只允许看，不允许你收藏，还不快换国产机！！！");
        }
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.48;
        let scrollH = wh;

        this.setData({
          scrollH: scrollH,
          imgWidth: imgWidth
        });
        isCanLoad: true;
      }
    });
    accountId = util.toGetStorageSync("AccountId");
    this.loadImages();
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
      url: "https://54188.xyz/api/imagespiderapi/getcatalog?accId=" + accountId+"&page=" + this.data.page,
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
          util.showToast("暂无更多!", "none", 800);
        }
      },
      fail: function(res) {
        isCanLoad = true;
        util.showToast("加载失败!", "none", 800);
      }
    });
  },

  toDetails: (e) => {
    let catalogid = e.currentTarget.dataset.catalogid;
    let imgUrl = e.currentTarget.dataset.src;
    util.showLoading("玩命加载中...");
    wx.navigateTo({
      url: "../details/details?catalogid=" + catalogid + ""
    });
    wx.hideLoading();
    wx.request({
      method: "GET",
      url: "https://54188.xyz/api/account/addbrowse?accountId=" + accountId + "&catalogId=" + catalogid,
      success: function(res) {
        // console.log(res); 
      },
      fail: function(res) {
        console.log(res);
      }
    }); 
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
          util.showToast("收藏成功!", "success", 800);
        },
        fail: function(res) {
          util.showToast("添加收藏失败!", "none", 800);
        }
      });
    } else {
      wx.request({
        method: "GET",
        url: "https://54188.xyz/api/account/deletecollectionrecord?accountId=" + accountId + "&catalogId=" + catalogid,
        success: function(res) {
          util.showToast("取消收藏成功!", "success", 800);
        },
        fail: function(res) {
          util.showToast("取消收藏失败!", "none", 800);
        }
      });
    }
    this.updateCollectionState(e);
  },

  updateCollectionState: function(e) {
    let imgObj = e.currentTarget.dataset.imgobj;
    let catalogid = imgObj.Id;
    let left = e.detail.x;
    let that = this;
    if (left < that.data.imgWidth) {
      for (let i = 0; 0 < that.data.col1.length; i++) {
        if (that.data.col1[i].Id == catalogid) {
          that.data.col1[i].IsCollection = !that.data.col1[i].IsCollection;
          if (that.data.col1[i].IsCollection)
            that.data.col1[i].CollectionCount += 1;
          else
            that.data.col1[i].CollectionCount -= 1;
          this.setData({
            col1: that.data.col1
          });
          break;
        }
      }
    } else {
      for (let i = 0; 0 < that.data.col2.length; i++) {
        if (that.data.col2[i].Id == catalogid) {
          that.data.col2[i].IsCollection = !that.data.col2[i].IsCollection;
          if (that.data.col2[i].IsCollection)
            that.data.col2[i].CollectionCount += 1;
          else
            that.data.col2[i].CollectionCount -= 1;
          this.setData({
            col2: that.data.col2
          });
          break;
        }
      }
    }
  },

})