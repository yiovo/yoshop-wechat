Page({
    data: {},
    onLoad: function() {
        this.loadingChange();
    },
    loadingChange: function() {
        var e = this;
        setTimeout(function() {
            e.setData({
                hidden: !0
            });
        }, 2e3);
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },
    onShareAppMessage: function() {
        return {
            title: "我的帮助",
            desc: "小程序本身无需下载，无需注册，不占用手机内存，可以跨平台使用，响应迅速，体验接近原生App",
            path: "/pages/help/help"
        };
    }
});