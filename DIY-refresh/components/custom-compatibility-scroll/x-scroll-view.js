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
    lastScrollEnd: 0, //记录高度 加载更多判断...

    // android 数据
    animationData: {},
    scrollTop: 0,
    triggerDistance: 60,
    yDelta: 40

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * ios
     */
    _onPropertiesChange(newVal, oldVal) {
      // console.log(newVal, oldVal);
      if (newVal === false && oldVal === true) {
        this.setData({
          pullDownStatus: 4,

        })

        setTimeout(() => {
          this.setData({
            pullDownStatus: 0,
            lastScrollEnd: 0,
            nomore: false
          });
        }, 500)

        if (this.data.type === 'android') {
          this.data.animation.translate3d(0, 0, 0).step({
            duration: 500
          });
          let obj = {
            pullStatus: 'icon-complete',
            statusText: this.data.completeText
          }
          setTimeout(() => {
            this.setData({
              animationData: this.data.animation.export(),
              ...obj
            }, 1000)
          })
        }
      }
    },
    _onScroll(e) {
      // 判断下拉大于 阈值 阀值
      // console.log(e.detail.scrollTop);
      this.triggerEvent('_onScroll', e.detail.scrollTop);
      if (this.data.type === 'android') {
        this.data.scrollTop = e.detail.scrollTop;
      }

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
    },
    /**
     * ios
     */

    /**
     * android
     */
    // 触摸
    _onTouchStart(e) {
      console.log('start')
      this.data.touchY = e.touches[0].pageY;
      let query = wx.createSelectorQuery().in(this);
      query.select('.scroll-wrapper').boundingClientRect();
      query.exec(res => {
        this.setData({
          'loader.top': res[0].top
        })
      })
    },
    // 移动
    _onTouchMove(e) {
      console.log('move')

      let status = this.data.pullDownStatus;
      if (status === 3 || status === 4) return;
      let touchYDelta =
        this.data.touchYDelta =
        e.touches[0].pageY - this.data.touchY;

      if (this.data.loader.top >= -40 && touchYDelta > 0) {
        console.log('内层')
        let yDelta = touchYDelta > 0 ? parseInt(touchYDelta ** .85) :
          -parseInt((Math.abs(touchYDelta) ** .85));

        let obj = yDelta < this.data.triggerDistance ? {
          pullStatus: 'icon-pull-down',
          statusText: this.data.pullText,
          pullDownStatus: 1
        } : {
          pullStatus: 'icon-release-up',
          statusText: this.data.releaseText,
          pullDownStatus: 2
        }
        console.log(touchYDelta, yDelta);

        yDelta = yDelta >= 80 ? 80 : yDelta;
        this.data.animation.translate3d(0, yDelta, 0).step();
        this.setData({
          animationData: this.data.animation.export(),
          ...obj
        })
      }
    },
    // 离开
    _onTouchEndAndroid(e) {
      let status = this.data.pullDownStatus;

      if (status === 3 || status === 4) return;
      if (status === 2) {
        var obj = {
          pullStatus: 'icon-loading loading',
          statusText: this.data.loadingText
        }
        this.data.animation.translate3d(0, 40, 0).step({
          duration: '3s'
        });
        this.properties.refreshing = true;
        this.setData({
          animationData: this.data.animation.export(),
          pullDownStatus: 3,
          ...obj
        });
        console.log('我调用了')
        this.triggerEvent('pulldownrefresh');
      }else {
        var obj = {
          pullStatus: 'icon-pull-down',
          statusText: this.data.pullText,
        }
        this.data.animation.translate3d(0, 0, 0).step();
        this.setData({
          animationData: this.data.animation.export(),
          pullDownStatus: 1,
          'loader.top': -40,
          ...obj
        })
      }
    }

    /**
     * android
     */


  },
  ready() {
    const systemInfo = wx.getSystemInfoSync();
    const type = /ios/i.test(systemInfo.system) ? "ios" : "android"
    this.setData({
      type: "android"
    })
    if (this.data.type === 'android') {
      let animation = wx.createAnimation({
        duration: 0,
        timingFunction: 'linear'
      })

      this.setData({
        animation: animation,
        animationData: animation.export()
      })
    }

  }
})