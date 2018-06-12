var api = require("../../api.js"), app = getApp();

Page({
    data: {},
    onLoad: function(e) {
        app.pageOnLoad(this);
    },
    onReady: function() {
        app.pageOnReady(this);
    },
    onShow: function() {
        app.pageOnShow(this);
    },
    onHide: function() {
        app.pageOnHide(this);
    },
    onUnload: function() {
        app.pageOnUnload(this);
    },
    getUserInfo: function(o) {
        console.log("getUserInfo----------\x3e", o), "getUserInfo:ok" == o.detail.errMsg && (wx.showLoading({
            title: "正在登录",
            mask: !0
        }), wx.login({
            success: function(e) {
                var t = e.code;
                getApp().request({
                    url: api.passport.login,
                    method: "POST",
                    data: {
                        code: t,
                        user_info: o.detail.rawData,
                        encrypted_data: o.detail.encryptedData,
                        iv: o.detail.iv,
                        signature: o.detail.signature
                    },
                    success: function(e) {
                        if (0 == e.code) {
                            wx.setStorageSync("access_token", e.data.access_token), wx.setStorageSync("user_info", e.data);
                            var t = wx.getStorageSync("login_pre_page");
                            t && t.route || wx.redirectTo({
                                url: "/pages/index/index"
                            });
                            var o = 0;
                            (o = t.options && t.options.user_id ? t.options.user_id : t.options && t.options.scene ? t.options.scene : wx.getStorageSync("parent_id")) && 0 != o && getApp().bindParent({
                                parent_id: o
                            }), wx.redirectTo({
                                url: "/" + t.route + "?" + getApp().utils.objectToUrlParams(t.options)
                            });
                        } else wx.showModal({
                            title: "提示",
                            content: e.msg,
                            showCancel: !1
                        });
                    },
                    complete: function() {
                        wx.hideLoading();
                    }
                });
            },
            fail: function(e) {}
        }));
    }
});