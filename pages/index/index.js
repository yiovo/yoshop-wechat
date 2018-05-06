var t = getApp();

Page({
    data: {
        indicatorDots: !0,
        autoplay: !0,
        interval: 4e3,
        duration: 1e3,
        scrollTop: 0,
        hasLocation: !1,
        hidden: !1
    },
    onLoad: function() {
        var a = this, e = wx.getStorageSync("token");
        wx.request({
            url: t.apiUrl("ecapi.site.get"),
            data: {
                per_page: "8",
                page: "1"
            },
            header: {
                "Content-Type": "application/json",
                "X-ECTouch-Authorization": e
            },
            method: "POST",
            success: function(t) {
                a.setData({
                    index: t.data
                });
            }
        });
    },
    goTop: function(t) {
        this.setData({
            scrollTop: 0
        });
    },
    scroll: function(t) {
        this.setData({
            indexSearch: t.detail.scrollTop
        }), t.detail.scrollTop > 300 ? this.setData({
            floorstatus: !0
        }) : this.setData({
            floorstatus: !1
        });
    },
    onShareAppMessage: function() {
        return {
            title: "小程序首页",
            desc: "小程序本身无需下载，无需注册，不占用手机内存，可以跨平台使用，响应迅速，体验接近原生App",
            path: "/pages/index/index"
        };
    }
});