const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const showLoading = (text = "正在加载...") => {
  wx.showLoading({
    title: text,
    mask: true
  })
}

const showToast = (text, ic = "success", time = 2000) => {
  wx.showToast({
    title: text,
    icon: ic,
    duration: time
  })
}

const showModal = (text) => {
  wx.showModal({
    title: '提示',
    content: text,
    success(res) {
      if (res.confirm) {
        console.log('用户点击确定')
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  });
}

const toSetStorageSync = (key, value) => {
  try {
    wx.setStorageSync(key, value)
  } catch (e) {
    console.log(e);
    // util.showToast("请稍后操作!", "loading");
  }
}

const toGetStorageSync = (key) => {
  let accountId = "";
  try {
    const value = wx.getStorageSync(key)
    if (value) {
      accountId = value;
    }
    return accountId;
  } catch (e) {
    console.log(e);
    // util.showToast("请稍后操作!", "loading");
  }
}

const toRemoveStorageSync = (key) => {
  try {
    wx.removeStorageSync(key)
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  formatTime: formatTime,
  showLoading: showLoading,
  showToast: showToast,
  showModal: showModal,
  toSetStorageSync: toSetStorageSync,
  toGetStorageSync: toGetStorageSync,
  toRemoveStorageSync: toRemoveStorageSync
}