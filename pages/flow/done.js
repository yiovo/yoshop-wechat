let e, t = getApp();

Page({
    data: {
        defaultSize: "default",
        primarySize: "default",
        warnSize: "default",
        disabled: !1,
        plain: !1,
        loading: !1,
        done: {
            name: "付款金额",
            price: "7520.00"
        },
        doneList: [ {
            title: "订单号",
            cont: "20164815852558"
        }, {
            title: "配送方式",
            cont: "圆通快递"
        } ]
    },
    onLoad: function(a) {
        e = wx.getStorageSync("token");
        let n = this;
        this.loadingChange();
        let i = a.id;
        wx.request({
            url: t.apiUrl("ecapi.order.get"),
            method: "post",
            data: {
                order: i
            },
            header: {
                "Content-Type": "application/json",
                "X-ECTouch-Authorization": e
            },
            success: function(e) {
                n.setData({
                    order: e.data.order
                });
            }
        });
    },
    loadingChange: function() {
        let e = this;
        setTimeout(function() {
            e.setData({
                hidden: !0
            });
        }, 2e3);
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },
    primary: function(a) {
        let n = a.currentTarget.dataset.id, i = wx.getStorageSync("openid");
        t.payOrder(n, i, e);
    },
    orderDetail: function(e) {
        wx.switchTab({
            url: "../user/index"
        });
    }
});
