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
    loadmoreText: '加载更多...',

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

        setTimeout(() => {
          this.setData({
            pullDownStatus: 0,
            lastScrollEnd: 0,
            nomore: false
          });
        }, 500)
      }
    },
    _onScroll(e) {
      // console.log(e.detail.scrollTop);
      // 判断下拉大于 阈值 阀值
      this.triggerEvent('_onScroll', e.detail.scrollTop);

      const status = this.data.pullDownStatus;
      if (status === 3 || status == 4) return;
      const height = this.properties.pullDownHeight;
      const scrollTop = e.detail.scrollTop;
      let targetStatus;
      if (scrollTop < -1 * height) {
        targetStatus = 2;
      } else if (scrollTop < 0) {
        targetStatus = 1;
      } else {
        targetStatus = 0;
      }
      if (status != targetStatus) {
        this.setData({
          pullDownStatus: targetStatus,
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
        console.log(33333);
        this.triggerEvent('pulldownrefresh', e);
      }
    },
    _onLoadmore(e) {
      let query = wx.createSelectorQuery().in(this);
      query.select('.scroll-wrapper').boundingClientRect();
      query.exec((res) => {
        if (res[0].height !== this.data.lastScrollEnd) {
          console.log('加载更多来了.............................')
          this.data.lastScrollEnd = res[0].height;
          this.triggerEvent('loadmore', e);
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