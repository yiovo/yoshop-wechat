App({

  /**
   * 全局变量
   */
  globalData: {
    userInfo: null
  },

  /**
   * 生命周期函数--监听小程序初始化
   */
  onLaunch: function () {
    // this.getUserInfo();
  },

  /**
   * 获取用户信息
   */
  getUserInfo: function (callback) {
    var _this = this;
    _this.globalData.userInfo ? ("function" == typeof callback) && callback(_this.globalData.userInfo) : wx.login({
      success: function (o) {
        var n = o.code;
        wx.getUserInfo({
          withCredentials: !0,
          lang: "zh_CN",
          success: function (o) {
            o.userInfo.code = n, _this.doLogin(n, o), _this.globalData.userInfo = o.userInfo, "function" == typeof callback && callback(_this.globalData.userInfo);
          },
          fail: function () {
            wx.showModal({
              title: "温馨提示",
              content: "拒绝授权，将会影响购物流程和用户登录,请确定重新授权！",
              success: function (o) {
                o.confirm ? wx.getSetting({
                  success: function (o) {
                    o.authSetting["scope.userInfo"] || wx.authorize({
                      scope: "scope.userInfo",
                      fail: function () {
                        wx.openSetting({
                          success: function (o) {
                            o.authSetting["scope.userInfo"] ? wx.getUserInfo({
                              withCredentials: !0,
                              success: function (o) {
                                o.userInfo.code = n, _this.doLogin(n, o), _this.globalData.userInfo = o.userInfo, "function" == typeof callback && callback(_this.globalData.userInfo);
                              }
                            }) : _this.getUserInfo();
                          }
                        });
                      }
                    });
                  }
                }) : o.cancel && _this.getUserInfo();
              }
            });
          }
        });
      }
    });
  },

  /**
   * 执行登录
   */
  doLogin: function (e, t) {
    var o = this;
    e && wx.request({
      url: o.apiUrl("ecapi.auth.weixin.mplogin"),
      method: "POST",
      data: {
        userinfo: t
      },
      success: function (e) {
        void 0 != e.data.token ? (wx.setStorage({
          key: "token",
          data: e.data.token
        }), wx.setStorage({
          key: "openid",
          data: e.data.openid
        })) : (wx.setStorage({
          key: "token",
          data: JSON.parse(e.data.split("\n")[1]).token
        }), wx.setStorage({
          key: "openid",
          data: JSON.parse(e.data.split("\n")[1]).openid
        }));
      }
    });
  },

  /**
   * 生成api url
   */
  apiUrl: function (e) {
    return "https://shop.ectouch.cn/ectouch/weapp/public/" + e;
  },

  /**
   * 显示消息框
   */
  showMessage: function (title) {
    let duration = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1e3;
    let icon = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "warn";
    wx.showToast({
      title: title,
      icon: icon,
      duration: duration
    });
  },

  /**
   * 页面跳转(即将废弃)
   */
  redirectTo: function (e) {
    wx.navigateTo({ url: e });
  },

  /**
   * 订单支付
   */
  payOrder: function (order_id, openid, token) {
    let _this = this;
    wx.request({
      url: _this.apiUrl("ecapi.payment.pay"),
      data: {
        order: order_id,
        openid: openid,
        code: "wxpay.web"
      },
      header: {
        "Content-Type": "application/json",
        "X-ECTouch-Authorization": o
      },
      method: "POST",
      success: function (result) {
        let wxpay = result.data.wxpay;
        wxpay != "" && wx.requestPayment({
          timeStamp: wxpay.timestamp,
          nonceStr: wxpay.nonce_str,
          package: wxpay.packages,
          signType: "MD5",
          paySign: wxpay.sign,
          success: function (res) {
            if (res.errMsg === "requestPayment:ok") {
              _this.redirectTo("../order/detail?objectId=" + e);
            }
          },
          fail: function (res) {
            _this.redirectTo("../order/detail?objectId=" + e);
          }
        });
      }
    });
  },


});
