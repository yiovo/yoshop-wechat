require("../../wxParse/wxParse.js");

let t, e = getApp();

Page({
    data: {
        current: "0",
        orders: []
    },
    bindHeaderTap: function(t) {
        this.setData({
            current: t.target.dataset.index
        }), this.loadingChange(), this.orderStatus(this, t.target.dataset.index);
    },
    bindSwiper: function(t) {
        this.setData({
            current: t.detail.current
        });
    },
    orderStatus: function(r, a) {
        wx.request({
            url: e.apiUrl("ecapi.order.list"),
            data: {
                per_page: 30,
                page: 1,
                status: a
            },
            header: {
                "Content-Type": "application/json",
                "X-ECTouch-Authorization": t
            },
            method: "POST",
            success: function(t) {
                r.setData({
                    orders: t.data.orders
                });
            }
        });
    },
    onLoad: function(e) {
        let r = this;
        t = wx.getStorageSync("token"), r.data.current = e.id || 0, this.shiftanimation = wx.createAnimation({
            duration: 500,
            timingFunction: "ease"
        }), this.shiftanimation.left("7%").step(), this.setData({
            shiftanimation: this.shiftanimation.export(),
            current: r.data.current
        }), this.orderStatus(this, r.data.current), this.loadingChange();
    },
    siteDetail: function(t) {
        let e = this, r = t.currentTarget.dataset.index, a = e.data.orders[r].order_id;
        wx.navigateTo({
            url: "../order/detail?objectId=" + a
        });
    },
    cancel_order: function(r) {
        let a = this, n = "";
        wx.showModal({
            title: "提示",
            content: "确认取消订单？",
            success: function(o) {
                o.confirm && wx.request({
                    url: e.apiUrl("ecapi.order.cancel"),
                    data: {
                        order: r.currentTarget.dataset.id
                    },
                    header: {
                        "Content-Type": "application/json",
                        "X-ECTouch-Authorization": t
                    },
                    method: "POST",
                    success: function(t) {
                        t.data.error_code > 0 ? n = "取消失败" : 0 == t.data.error_code && (n = "取消成功", a.orderStatus(a, a.data.current)),
                        wx.showToast({
                            title: n,
                            icon: "warn",
                            duration: 500
                        });
                    }
                });
            }
        });
    },
    pay_order: function(r) {
        let a = this, n = r.currentTarget.dataset.id, o = wx.getStorageSync("openid");
        e.payOrder(n, o, t), a.orderStatus(a, a.data.current);
    },
    confirm_order: function(r) {
        wx.showModal({
            title: "提示",
            content: "确认收到商品？",
            success: function(a) {
                a.confirm && wx.request({
                    url: e.apiUrl("ecapi.order.confirm"),
                    data: {
                        order: r.currentTarget.dataset.id
                    },
                    header: {
                        "Content-Type": "application/json",
                        "X-ECTouch-Authorization": t
                    },
                    method: "POST",
                    success: function(t) {
                        t.data.error_code > 0 ? error_msg = "确认失败" : 0 == t.data.error_code && (error_msg = "确认成功",
                        that.orderStatus(that, that.data.current)), wx.showToast({
                            title: error_msg,
                            icon: "warn",
                            duration: 500
                        });
                    }
                });
            }
        });
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
