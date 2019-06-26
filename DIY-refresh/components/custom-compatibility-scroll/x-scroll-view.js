// components/custom-compatibility-scroll/x-scroll-view.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  ready() {
    const systemInfo = wx.getSystemInfoSync();
    const type = /ios/i.test(systemInfo.system) ? "ios" : "android"
    this.setData({
      type: type
    })

    
  }
})
