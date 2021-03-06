var util = require('../../utils/util.js');
let col1H = 0;
let col2H = 0;
let isDetailsCanLoad = true;
let imageUrl = [];
Page({
  data: {
    scrollH: 0,
    imgWidth: 0,
    loadingCount: 0,
    images: [],
    col1: [],
    col2: [],
    page: 1,
    catalogid :1
  },

  onLoad: function(options) {
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.48;
        let scrollH = wh;

        this.setData({
          scrollH: scrollH,
          imgWidth: imgWidth,
          catalogid : options.catalogid
        });
        isDetailsCanLoad = true;
        this.loadImages();
      }
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    imageUrl = [];
  },
  /**
  * 生命周期函数--监听页面隐藏
  */
  onHide: function () {
      isDetailsCanLoad: true;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
      isDetailsCanLoad: true;
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
        imageUrl.push(imageObj.NewUrl);
        break;
      }
    }

    if (imageObj)
      imageObj.Height = imgHeight;

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
      if (!isDetailsCanLoad)
        isDetailsCanLoad = true;
    }
    this.setData(data);
  },

  loadImages: function() {
    var that = this;
    util.showToast("拼命加载中...", "loading");
    if (!isDetailsCanLoad) return;
    isDetailsCanLoad = false;
    wx.request({
      method: "POST",
      url: "https://54188.xyz/api/imagespiderapi/getimage?catalogId=" + that.data.catalogid + "&page=" + this.data.page,
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
          isDetailsCanLoad = true;
          util.showToast("暂无更多!", "none");
        }
      },
      fail: function (res) {
        isDetailsCanLoad = true;
        util.showToast("加载失败!", "none");
      }
    });
  },

  previewImage: (e) => {
    let imageid = e.currentTarget.dataset.imageid;
    let imgUrl = e.currentTarget.dataset.src;
    wx.previewImage({
      current: imgUrl,
      urls: imageUrl
    });
  },

})