var t, o, e = getApp();

Page({
    data: {
        index: 0,
        orderJtou: "../../res/images/icon-arrowdown.png",
        distributionJtou: "../../res/images/icon-arrowdown.png",
        checkList: []
    },
    onLoad: function(t) {
        o = t.objectId, this.loadOrderDetail(o), this.loadingChange();
    },
    onShow: function() {
        t = wx.getStorageSync("token"), this.loadOrderDetail(o);
    },
    loadOrderDetail: function(o) {
        var r = this;
        wx.request({
            url: e.apiUrl("ecapi.order.get"),
            data: {
                order: o
            },
            method: "post",
            header: {
                "Content-Type": "application/json",
                "X-ECTouch-Authorization": t
            },
            success: function(t) {
                var o, e = "";
                for (var a in t.data.order.goods) {
                    o = t.data.order.goods[a].goods_attr.split("\n");
                    for (var n in o) "" != o[n] && (e += o[n] + ",");
                    t.data.order.goods[a].goods_attr = e.substring(0, e.length - 1);
                }
                r.setData({
                    goodsList: t.data.order.goods,
                    orders: t.data.order
                });
            }
        });
    },
    confirm_order: function(o) {
        wx.showModal({
            title: "提示",
            content: "确认收到商品？",
            success: function(r) {
                r.confirm && wx.request({
                    url: e.apiUrl("ecapi.order.confirm"),
                    data: {
                        order: o.currentTarget.dataset.id
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
        var t = this;
        setTimeout(function() {
            t.setData({
                hidden: !0
            });
        }, 2e3);
    },
    siteDetail: function(t) {
        var o = this, e = t.currentTarget.dataset.index;
        console.log(e);
        var r = o.data.goodsList[e].goods_id;
        wx.navigateTo({
            url: "../goods/goods?objectId=" + r
        });
    },
    cancel_order: function(r) {
        var a = this;
        wx.showModal({
            title: "提示",
            content: "确认取消订单？",
            success: function(r) {
                r.confirm && wx.request({
                    url: e.apiUrl("ecapi.order.cancel"),
                    data: {
                        order: o
                    },
                    header: {
                        "Content-Type": "application/json",
                        "X-ECTouch-Authorization": t
                    },
                    method: "POST",
                    success: function(t) {
                        t.data.error_code > 0 ? e.shwomessage("取消失败", 1e3, "clear") : 0 == t.data.error_code && (e.shwomessage("取消成功", 1e3, "warn"), 
                        a.orderStatus(a, a.data.current));
                    }
                });
            }
        });
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },
    pay_order: function(o) {
        var r = o.currentTarget.dataset.id, a = wx.getStorageSync("openid");
        e.payOrder(r, a, t);
    },
    commonNav: function() {
        var t = this;
        t.setData({
            nav_select: !t.data.nav_select
        });
    },
    nav: function(t) {
        var o = t.currentTarget.dataset.index;
        "home" == o ? wx.switchTab({
            url: "../index/index"
        }) : "fenlei" == o ? wx.switchTab({
            url: "../category/index"
        }) : "cart" == o ? wx.switchTab({
            url: "../flow/index"
        }) : "profile" == o && wx.switchTab({
            url: "../user/index"
        });
    }
});