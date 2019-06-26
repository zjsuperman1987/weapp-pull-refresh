// components/custom-compatibility-scroll/x-scroll-view.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    nomore: {
      type: Boolean,
      value: false
    },
    refreshing: {
      type: Boolean,
      value: false,
      observer: '_onPropertiesChange'
    },
    pullDownHeight: {
      type: Number,
      value: 60
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    pullText: '下拉刷新',
    releaseText: '释放刷新',
    loadingText: '正在加载...',
    completeText: '加载完成',
    nomoreText: '我是有底线的...',

    pullDownStatus: 0, //状态
    lastScrollEnd: 0 //记录高度 加载更多判断...
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * ios
     */
    _onPropertiesChange(newVal, oldVal) {
      console.log(newVal, oldVal);
      if (newVal === false && oldVal === true) {
        this.setData({
          pullDownStatus: 4
        })
      }
    },
    _onScroll(e) {
      console.log(e.detail.scrollTop);
      // 判断下拉大于 阈值 阀值
      this.triggerEvent('_onScroll', e.detail.scrollTop);

      if (this.properties.refreshing) return;

      const threshold = this.properties.pullDownHeight * -1;
      let scrollTop = e.detail.scrollTop
      if (scrollTop > threshold) {
        this.setData({
          pullDownStatus: 1
        })
      }else {
        this.setData({
          pullDownStatus: 2
        })
      }
      
    },
    _onTouchEnd(e) {
      if (this.properties.refreshing) return;
      if (this.data.pullDownStatus === 2) {
        this.properties.refreshing = true
        this.setData({
          pullDownStatus: 3
        })
        this.triggerEvent('_onPullDownRefresh', e);
      }
    },
    _onLoadmore(e) {
      let query = wx.createSelectorQuery().in(this);
      query.select('.scroll-wrapper').bindClientRect();
      query.exec((res) => {
        if (res.height !== this.data.lastScrollEnd) {
          this.data.lastScrollEnd = res.height;
          this.triggerEvent('_onLoadmore', e);
        }
      })
    }
    /**
     * ios
     */

    /**
     * android
     */


    /**
     * android
     */

    /**
     * 公共方法
     */
    // _onScroll(e) {
    //   console.log(e.detail.scrollTop);
    //   this.triggerEvent('_onScroll', e.detail.scrollTop);
    // },
    // _onPropertiesChange(newVal, oldVal) {
    //   console.log(newVal, oldVal);
    // },
    // _onTouchEnd(e) {
    //   if (this.data.type === 'ios') {

    //   }else {

    //   }
    // }
  },
  ready() {
    const systemInfo = wx.getSystemInfoSync();
    const type = /ios/i.test(systemInfo.system) ? "ios" : "android"
    this.setData({
      type: type
    })


  }
})