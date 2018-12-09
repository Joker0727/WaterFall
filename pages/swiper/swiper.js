Page({
  data: {
    imgUrls: [
      {
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
      }
    ],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    imgWidth : 320,
    imgHeight : 504
  },
  onLoad: function () {
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        this.setData({
          imgWidth: ww,
          imgHeight: wh
        });
      }
    })
  }  
})