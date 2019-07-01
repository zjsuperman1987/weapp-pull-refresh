// components/xing/x-scroll-view/x-scroll-view.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pullText: {
      type: String,
      value: '下拉可以刷新',
    },
    releaseText: {
      type: String,
      value: '松开立即刷新',
    },
    loadingText: {
      type: String,
      value: '正在刷新数据中',
    },
    finishText: {
      type: String,
      value: '刷新完成',
    },
    loadmoreText: {
      type: String,
      value: '正在加载更多数据',
    },
    nomoreText: {
      type: String,
      value: '已经全部加载完毕',
    },
    pullDownHeight: {
      type: Number,
      value: 60,
    },
    refreshing: {
      type: Boolean,
      value: false,
      observer: '_onRefreshFinished',
    },
    nomore: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    pullDownStatus: 0,
    lastScrollEnd: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _onScroll: function(e) {
      this.triggerEvent('scroll', e.detail);
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

    _onTouchEnd: function(e) {
      const status = this.data.pullDownStatus;
      if (status === 2) {
        this.setData({
          pullDownStatus: 3,
        })
        console.log('下拉刷新le ')
        this.properties.refreshing = true;
        setTimeout(() => {
          this.triggerEvent('pulldownrefresh');
        }, 500);
      }
    },

    _onRefreshFinished(newVal, oldVal) {
      if (oldVal === true && newVal === false) {
        this.properties.nomore = false;
        this.setData({
          nomore: false,
        })
        if (this.data.type === 'ios') {
          this.setData({
            pullDownStatus: 4,
            lastScerollEnd: 0,
          })
          setTimeout(() => {
            this.setData({
              pullDownStatus: 0,
            })
          }, 500);
        }else {
          let obj = {
            className: 'icon-complete'
          }
          this.data.animation.translate3d(0, 0, 0).step({
            duration: 300
          })
          this.setData({
            pullDownStatus: 4,
            ...obj,
            animationData: this.data.animation.export()
          });
          setTimeout(() => {
            this.setData({
              pullDownStatus: 0,
              className: 'icon-pull-down',
              animationData: this.data.animation.export()
            })
          }, 300)
        }
      }
    },

    _onLoadmore() {
      if (!this.properties.nomore) {
        let query = wx.createSelectorQuery().in(this);
        query.select('.scroll-wrapper').fields({
          size: true,
          scrollOffset: true,
        }, res => {
          console.log(res);
          if (res.height !== this.data.lastScrollEnd) {
            this.setData({
              lastScrollEnd: res.height,
            })
            this.triggerEvent('loadmore');
          }
        }).exec();
      }
    },

    /**
     * android
     */
    _onTouchStartAndroid(e) {
      this.setData({
        touchY: e.touches[0].pageY
      })
    },
    _onTouchMoveAndroid(e) {
      let moveY = e.touches[0].pageY - this.data.touchY;
      let deltaY = moveY ** .85 > 100 ? 100 : moveY ** .85;
      let status = this.data.pullDownStatus;
      let height = this.data.pullDownHeight;
      let targetStatus;
      let obj;
      console.log(status, '.................');
      if (status === 3 || status === 4) return;

      this.data.animation.translate3d(0, deltaY, 0).step();
      this.setData({
        animationData: this.data.animation.export()
      })
      if (deltaY > height) {
        targetStatus = 2;
        obj = {
          className: 'icon-release-up'
        }
      } else {
        targetStatus = 1;
        obj = {
          className: 'icon-pull-down'
        }
      }
      if (targetStatus !== status) {
        status = targetStatus;
      }

      this.setData({
        pullDownStatus: status,
        ...obj
      })
    },
    _onTouchEndAndroid() {
      let status = this.data.pullDownStatus;
      let obj;
      if (status === 3 || status === 4) return;
      if (status === 2) {
        status = 3;
        obj = {
          className: 'icon-loading loading'
        }
        this.data.animation.translate3d(0, 0, 0).step({
          duration: 300
        })
        this.setData({
          pullDownStatus: status,
          ...obj,
          animationData: this.data.animation.export(),
        })
        this.properties.refreshing = true;
        this.triggerEvent('pulldownrefresh');
      } else {
        status = 1;
        obj = {
          className: 'icon-pull-down'
        }
        this.data.animation.translate3d(0, 0, 0).step();
        this.setData({
          pullDownStatus: status,
          ...obj,
          animationData: this.data.animation.export()
        })

        setTimeout(() => {
          this.setData({
            pullDownStatus: 0
          })
        })
      }
    }
  },
  ready() {
    let systemInfo = wx.getSystemInfoSync(),
      regObj = new RegExp("ios", "gi"),
      systemType;

    systemType = regObj.test(systemInfo.system) ? "ios" : "android";
    systemType = 'android';
    if (systemType === 'android') {
      let animation = wx.createAnimation({
        duration: 0,
        timingFunction: 'linear'
      })
      this.setData({
        animation: animation,
        animationData: animation.export(),
        type: systemType
      })
      return;
    }

    this.setData({
      type: systemType
    })
  }
})