// pages/last/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const colors = this._generateColor(20);
    console.log(colors);
    this.setData({
      colors: colors
    })
  },

  // 生成颜色项
  _generateColor(length) {
    return new Array(length).fill(null).map((res) => {
      return this._randomColor()
    })
  },

  // 随机颜色
  _randomColor() {
    return `rgba(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${(Math.random() * .3 + .2).toFixed(1)})`
  },

  // 下拉刷新
  _onPullDownRefresh() {
    setTimeout(() => {
      this.setData({
        colors: this._generateColor(20),
        refreshing: false
      })
    }, 2000)
  },

  _onLoadmore() {
    console.log('loadmore')
    if (this.data.colors.length === 80) {
      this.setData({
        nomore: true
      })
      return;
    }else {
      setTimeout(() => {
        this.setData({
          colors: this.data.colors.concat(this._generateColor(20)),
        })
      }, 2000)
    }
  }

})