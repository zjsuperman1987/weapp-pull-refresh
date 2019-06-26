// components/custom-scroll-view/x-scroll-view.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    scrollWithAnimation: {
      type: Boolean,
      value: false,
    },
    lowerThresHold: {
      type: Number,
      value: 50
    },
    enableBackToTop: {
      type: Boolean,
      value: true
    },
    scrollIntoView: {
      type: String,
      value: ''
    },
    refreshingComplete: {
      type: Boolean,
      value: false,
      observer: '_onPropertiesChange'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    scrollY: true,
    touchYDelta: '',
    isLoading: false,
    loadWrapH: '',
    winfactor: .2,
    translateVal: '',
    isMoved: false,
    firstTouchY: '',
    initialScroll: '',
    friction: 2.5,
    scrollTop: 0,
    triggerDistance: 100,
    className: '',
    animationData: {},
    animation: {},
    system: '',
    brand: '',
    loader: {
      height: 500
    },
    time: '',
    text: '下拉可以刷新',
    externalClass: ['custom-class'],
    options: {
      multipleSlots: true
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _onPropertiesChange(newVal, oldVal) {
      console.log('状态改变...')
    },

    // 滚动
    scroll(e) {
      console.log('我是scroll.................');
      this.setData({
        scrollTop: e.detail.scrollTop
      })
      this.triggerEvent('scroll', e.detail.scrollTop);
    },

    // 滚动到底部
    scrollToLower(e) {
      this.triggerEvent('lower')
    },

    // 触摸开始
    touchStart(e) {
      const {
        isLoading,
        scrollTop
      } = this.data
      if (isLoading) return;
      const touchObj = e.touches[0];
      this.setData({
        isMoved: false,
        sDuration: '0ms',
        touchYDelta: '',
        firstTouchY: parseInt(touchObj.clientY),
        initialScroll: scrollTop
      })
      console.log(this.data.initialScroll);
    },

    // 触摸中
    touchMove(e) {
      const {
        isLoading
      } = this.data;
      if (isLoading) return;
      let touchObj = e.touches[0];
      let touchY = parseInt(touchObj.clientY);
      let touchYDelta = touchY - this.data.firstTouchY;
      if (this.data.initialScroll > 0 ||
        this.data.scrollTop > 0 ||
        this.data.scrollTop === 0 && touchYDelta < 0) {
        this.setData({
          firstTouchY: touchY
        })
        return;
      }
      /* eslint-enable */
      const yDelta = this.data.brand = 'devtools' ? touchYDelta ** 0.85 :
        this.data.system === 'ios' ? touchYDelta ** 0.5 :
        touchYDelta ** 0.85

      // let translateVal = yDelta
      this.data.animation.translate3d(0, yDelta, 0).step();
      let obj = touchYDelta >= this.data.triggerDistance ? {
        className: 'refresh-pull-up'
      } : {
        className: 'refresh-pull-down'
      }

      this.setData({
        touchYDelta: touchYDelta,
        animationData: this.data.animation.export(),
        isMoved: true,
        ...obj
      })
    },

    // 触摸结束
    touchEnd(e) {
      if (this.data.isLoading || !this.data.isMoved) {
        this.setData({
          isMoved: false,
        })
        return;
      }
      // 根据下拉高度判断是否加载
      if (this.data.touchYDelta >= this.data.triggerDistance) {
      this.data.animation.translate3d(0, this.data.loader.height, 0).step();
        this.setData({
          isLoading: true,
          scrollY: false,
          animationData: this.data.animation.export(),
          className: 'refreshing',
          text: '正在刷新...'
        })
        this.triggerEvent('refresh', 'success');
      } else {
        this.data.animation.translate3d(0, 0, 0).step({
          duration: 300
        })
        this.setData({
          animationData: this.data.animation.export()
        })
      }
    },

    // 重置
    reset() {
      this.setData({
        isLoading: false,
        scrollY: true,
        className: 'refresh-pull-up',
        text: '下拉可以刷新'
      }, () => {
        this.data.animation.translate3d(0, 0, 0).step({
          duration: 300
        });
        const time = this.getTime();
        this.setData({
          animationData: this.data.animation.export(),
          className: 'refresh-pull-down',
          time: time
        })
      })
    },

    // 节流
    throttle(fn, delay) {
      let allowSample = true;
      return function(e) {
        if (allowSample) {
          allowSample = false;
          setTimeout(() => {
            allowSample = true
          }, delay);
          fn(e);
        }
      }
    },

    // 时间
    getTime() {
      const date = new Date();
      return `${date.getFullYear()}-${this.getFriendlyTime(date.getMonth() + 1)}-${this.getFriendlyTime(date.getDate())} ${this.getFriendlyTime(date.getHours())}:${this.getFriendlyTime(date.getMinutes())}:${this.getFriendlyTime(date.getSeconds())}`
    },
    // 时间格式化
    getFriendlyTime(time) {
      return time < 10 ? '0' + time : time;
    },
    // 单独
    detached() {

    }
  },
  ready() {
    let animation = wx.createAnimation({
      duration: 0,
      timeFunction: 'linear'
    })
    let system = 'android';
    const systemInfo = wx.getSystemInfoSync();
    console.log(systemInfo)
    if (/iphone/i.test(systemInfo.model)) {
      system = 'ios'
    }
    const time = this.getTime();
    this.setData({
      time: time,
      system: system,
      animation: animation,
      brand: systemInfo.brand,
      animationData: animation.export()
    })
    wx.createSelectorQuery().in(this).selectAll('.refresh-load')
      .boundingClientRect((res) => {
        if (res && res.length) {
          this.setData({
            loader: res[0]
          })
        }
      }).exec();
  }

})