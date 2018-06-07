App({

  /**
   * 全局变量
   */
  globalData: {
    user_id: null,
  },

  api_root: '', // api地址
  siteInfo: require('siteinfo.js'),

  /**
   * 生命周期函数--监听小程序初始化
   */
  onLaunch: function () {
    // 设置api地址
    this.setApiRoot();
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    // 获取小程序基础信息
    this.getWxappBase(function (wxapp) {
      // 设置navbar标题、颜色
      wx.setNavigationBarColor({
        frontColor: wxapp.navbar.top_text_color.text,
        backgroundColor: wxapp.navbar.top_background_color
      })
    });
  },

  /**
   * 设置api地址
   */
  setApiRoot: function () {
    let siteroot = this.siteInfo.siteroot.replace('app/index.php', '');
    // this.api_root = siteroot + 'addons/active_lite/source/web/index.php?s=/api/';
    this.api_root = siteroot + 'index.php?s=/api/';
  },

  /**
   * 获取小程序基础信息
   */
  getWxappBase: function (callback) {
    let App = this;
    App._get('wxapp/base', {}, function (result) {
      if (result.code === 1) {
        // 记录小程序基础信息
        wx.setStorageSync('wxapp', result.data.wxapp);
        callback && callback(result.data.wxapp);
      } else {
        App.showError(result.msg);
      }
    }, false, false);
  },

  /**
   * 执行用户登录
   * 自动检测当前登录态并实现微信登录
   */
  doLogin: function (callback) {
    let App = this;
    if (wx.getStorageSync('token').length !== 32) {
      return App.wxLogin(callback);
    }
    // 自动检测登录
    wx.checkSession({
      success: function () {
        callback && callback();
      },
      fail: function () {
        // session_key 已经失效，需要重新执行登录流程
        App.wxLogin(callback);
      }
    });
  },

  /**
   * 微信登录接口
   */
  wxLogin: function (callback) {
    let App = this;
    wx.login({
      success: function (res) {
        App._post_form('user/login', { code: res.code }, function (result) {
          if (result.code === 1) {
            console.log(result.data);
            wx.setStorageSync('token', result.data.token);
            wx.setStorageSync('user_id', result.data.user_id);
            callback && callback();
          } else {
            App.showError(result.msg);
          }
        });
      }
    });
  },

  /**
   * 当前用户id
   */
  getUserId: function () {
    return wx.getStorageSync('user_id');
  },

  /**
   * 显示成功提示框
   */
  showSuccess: function (msg, callback) {
    wx.showToast({
      title: msg,
      icon: 'success',
      success: function () {
        if (callback) {
          setTimeout(function () {
            callback();
          }, 1500);
        }
      }
    });
  },

  /**
   * 显示失败提示框
   */
  showError: function (msg, callback) {
    wx.showModal({
      title: '友情提示',
      content: msg,
      showCancel: false,
      success: function (res) {
        callback && (setTimeout(function () {
          callback();
        }, 1500));
      }
    });
  },

  /**
   * get请求
   */
  _get: function (url, data, success, fail, check_login) {
    wx.showNavigationBarLoading();
    let App = this;
    // 构造请求参数
    data = data || {};
    data.wxapp_id = App.siteInfo.uniacid;
    if (typeof check_login === 'undefined')
      check_login = true;

    // 构造get请求
    let request = function () {
      data.token = wx.getStorageSync('token');
      wx.request({
        url: App.api_root + url,
        header: {
          'content-type': 'application/json'
        },
        data: data,
        success: function (res) {
          wx.hideNavigationBarLoading();
          if (res.data.code === -1) {
            // 登录态失效, 重新登录
            App.wxLogin(function () {
              App._get(url, data, success, fail, false);
            });
          } else {
            if (success) success(res.data);
          }
        },
        fail: function (res) {
          wx.hideNavigationBarLoading();
          if (fail) fail(res);
        }
      });
    };
    // 判断是否需要验证登录
    check_login ? App.doLogin(request) : request();
  },

  /**
   * post提交
   */
  _post_form: function (url, data, success, fail) {
    let App = this;
    data.wxapp_id = App.siteInfo.uniacid;
    data.token = wx.getStorageSync('token');
    wx.request({
      url: App.api_root + url,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      data: data,
      success: function (res) {
        if (res.data.code === -1) {
          // 登录态失效, 重新登录
          App.wxLogin(function () {
            App._post_form(url, data, success, fail);
          });
        } else {
          if (success) success(res.data);
        }
      },
      fail: function (res) {
        if (fail) fail(res);
      }
    });
  },

  /**
   * 验证是否存在user_info
   */
  validateUserInfo: function () {
    let user_info = wx.getStorageSync('user_info');
    return !!wx.getStorageSync('user_info');
  },

  /**
   * 对象转URL
   */
  urlEncode: function urlencode(data) {
    var _result = [];
    for (var key in data) {
      var value = data[key];
      if (value.constructor == Array) {
        value.forEach(function (_value) {
          _result.push(key + "=" + _value);
        });
      } else {
        _result.push(key + '=' + value);
      }
    }
    return _result.join('&');
  },

  /**
   * 设置当前页面标题
   */
  setTitle: function () {
    let App = this
      , wxapp;
    if (wxapp = wx.getStorageSync('wxapp')) {
      wx.setNavigationBarTitle({ title: wxapp.navbar.wxapp_title });
    } else {
      App.getWxappBase(function () { App.setTitle(); });
    }
  },






  //////////////////////////////////////////////////////////////////////
  ////
  //////

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
   * 执行登录 (废弃)
   */
  doLogin_bak: function (e, t) {
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
