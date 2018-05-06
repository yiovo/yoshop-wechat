App({
    onLaunch: function() {
        this.getUserInfo();
    },
    getUserInfo: function(e) {
        var t = this;
        t.globalData.userInfo ? "function" == typeof e && e(t.globalData.userInfo) : wx.login({
            success: function(o) {
                var n = o.code;
                wx.getUserInfo({
                    withCredentials: !0,
                    lang: "zh_CN",
                    success: function(o) {
                        o.userInfo.code = n, t.doLogin(n, o), t.globalData.userInfo = o.userInfo, "function" == typeof e && e(t.globalData.userInfo);
                    },
                    fail: function() {
                        wx.showModal({
                            title: "温馨提示",
                            content: "拒绝授权，将会影响购物流程和用户登录,请确定重新授权！",
                            success: function(o) {
                                o.confirm ? wx.getSetting({
                                    success: function(o) {
                                        o.authSetting["scope.userInfo"] || wx.authorize({
                                            scope: "scope.userInfo",
                                            fail: function() {
                                                wx.openSetting({
                                                    success: function(o) {
                                                        o.authSetting["scope.userInfo"] ? wx.getUserInfo({
                                                            withCredentials: !0,
                                                            success: function(o) {
                                                                o.userInfo.code = n, t.doLogin(n, o), t.globalData.userInfo = o.userInfo, "function" == typeof e && e(t.globalData.userInfo);
                                                            }
                                                        }) : t.getUserInfo();
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }) : o.cancel && t.getUserInfo();
                            }
                        });
                    }
                });
            }
        });
    },
    doLogin: function(e, t) {
      // xany.test
      return false;
        var o = this;
        e && wx.request({
            url: o.apiUrl("ecapi.auth.weixin.mplogin"),
            method: "POST",
            data: {
                userinfo: t
            },
            success: function(e) {
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
    globalData: {
        userInfo: null
    },
    apiUrl: function(e) {
        return "https://shop.ectouch.cn/ectouch/weapp/public/" + e;
    },
    shwomessage: function(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1e3, o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "warn";
        wx.showToast({
            title: e,
            icon: o,
            duration: t
        });
    },
    redirectTo: function(e) {
        wx.navigateTo({
            url: e
        });
    },
    payOrder: function(e, t, o) {
        var n = this;
        wx.request({
            url: n.apiUrl("ecapi.payment.pay"),
            data: {
                order: e,
                openid: t,
                code: "wxpay.web"
            },
            header: {
                "Content-Type": "application/json",
                "X-ECTouch-Authorization": o
            },
            method: "POST",
            success: function(t) {
                if (500 != t.statusCode) {
                    var o = t.data.wxpay;
                    "" != o && wx.requestPayment({
                        timeStamp: o.timestamp,
                        nonceStr: o.nonce_str,
                        package: o.packages,
                        signType: "MD5",
                        paySign: o.sign,
                        success: function(t) {
                            "requestPayment:ok" == t.errMsg && n.redirectTo("../order/detail?objectId=" + e);
                        },
                        fail: function(t) {
                            n.redirectTo("../order/detail?objectId=" + e);
                        }
                    });
                }
            }
        });
    }
});