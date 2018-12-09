let col1H = 0;
let col2H = 0;

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

        this.loadImages();
      }
    })
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
      if (img.id === imageId) {
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
    }

    this.setData(data);
  },

  loadImages: function() {
    var that = this;
    wx.showToast({
      title: '拼命加载中...',
      icon: 'loading',
      duration: 1000
    })
    let jsonArr = [{
        id: "1",
        src: "http://54188.xyz/images/1.jpg",
        height: 0
      },
      {
        id: "2",
        src: "http://54188.xyz/images/2.jpg",
        height: 0
      },
      {
        id: "3",
        src: "http://54188.xyz/images/3.jpg",
        height: 0
      },
      {
        id: "4",
        src: "http://54188.xyz/images/4.jpg",
        height: 0
      },
      {
        id: "5",
        src: "http://54188.xyz/images/5.jpg",
        height: 0
      },
      {
        id: "6",
        src: "http://54188.xyz/images/6.jpg",
        height: 0
      },
      {
        id: "7",
        src: "http://54188.xyz/images/7.jpg",
        height: 0
      },
      {
        id: "8",
        src: "http://54188.xyz/images/8.jpg",
        height: 0
      }
    ];
    let tempImages = that.data.images;
    tempImages.push(...jsonArr);
    that.setData({
      images: tempImages
    });

    //wx.hideToast();
    // wx.request({
    //   url: 'https://api.getweapp.com/vendor/tngou/tnfs/api/list?page=' + this.data.page,
    //   success: function (res) {
    //     wx.hideToast()
    //     that.setData({
    //       loadingCount: res.data.tngou.length,
    //       images: res.data.tngou,
    //       page: that.data.page + 1
    //     })
    //   }
    // })

  },
  previewImage: (e) => {
    let imgUrl =e.currentTarget.dataset.src;
    wx.previewImage({
      current: imgUrl,
      urls: [imgUrl],
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})