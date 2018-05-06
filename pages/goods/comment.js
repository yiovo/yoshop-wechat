let t = getApp(), e = 0;

Page({
    data: {
        indicatorDots: !0,
        autoplay: !0,
        interval: 4e3,
        duration: 1e3
    },
    onLoad: function(o) {
        let a = this;
        e = o.objectId, wx.request({
            url: t.apiUrl("ecapi.product.get"),
            data: {
                product: e
            },
            method: "post",
            header: {
                "Content-Type": "application/json"
            },
            success: function(t) {
                a.setData({
                    goodsComment: t.data.comment
                });
            }
        }), this.loadingChange();
    },
    loadingChange: function() {
        let t = this;
        setTimeout(function() {
            t.setData({
                hidden: !0
            });
        }, 1e3);
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    }
});
