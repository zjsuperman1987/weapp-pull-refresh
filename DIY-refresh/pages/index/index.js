//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
   colors: []
  },

  onLoad: function () {
    let colors = this._generateColor(20);
    this.setData({
      colors: colors
    })
  },

  // 生成颜色
  _generateColor(length) {
    var that = this;
    return new Array(length).fill(null).map((res) => {
      return that._randomColor()
    })
  },

  // 随机颜色
  _randomColor() {
    return `rgba(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${(Math.random() * .2 + .3).toFixed(1)})`
  },


  // 事件
  _onPullDownRefresh() {
    setTimeout(() => {
      console.log('内层')
      this.setData({
        refreshingComplete: true
      })
    },3000);
  }

})
