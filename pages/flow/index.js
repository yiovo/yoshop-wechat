var t, o = getApp();

Page({
    data: {
        items: [],
        startX: 0,
        startY: 0,
        toView: "blue",
        selectedMenuId: 1,
        total: {
            count: 0,
            money: 0
        }
    },
    flowCheckoutBtn: function(t) {
        var e = wx.getStorageSync("token");
        wx.setStorageSync("flowcheckout", {
            from: "checkout"
        }), wx.request({
            url: o.apiUrl("ecapi.consignee.list"),
            method: "POST",
            header: {
                "Content-Type": "application/json",
                "X-ECTouch-Authorization": e
            },
            success: function(t) {
                "" != t.data.consignees ? wx.navigateTo({
                    url: "../flow/checkout"
                }) : wx.showModal({
                    title: "提示",
                    content: "您还没有地址去填地址？",
                    success: function(t) {
                        t.confirm ? wx.navigateTo({
                            url: "../address/create"
                        }) : t.cancel;
                    }
                });
            }
        });
    },
    getCartGoods: function(e) {
        wx.request({
            url: o.apiUrl("ecapi.cart.get"),
            method: "POST",
            header: {
                "Content-Type": "application/json",
                "X-ECTouch-Authorization": t
            },
            success: function(t) {
                var o, a = "";
                for (var n in t.data.goods_groups.goods) {
                    o = t.data.goods_groups.goods[n].goods_attr.split("\n"), a = "";
                    for (var s in o) "" != o[s] && (a += o[s] + ",");
                    t.data.goods_groups.goods[n].goods_attr = a.substring(0, a.length - 1);
                }
                "" == t.data.goods_groups ? e.setData({
                    flowLists: {
                        goods: ""
                    }
                }) : e.setData({
                    flowLists: t.data.goods_groups
                });
            }
        });
    },
    onLoad: function() {
        t = wx.getStorageSync("token");
        var o = this;
        this.getCartGoods(o), this.loadingChange();
    },
    loadingChange: function() {
        var t = this;
        setTimeout(function() {
            t.setData({
                hidden: !0
            });
        }, 1e3);
    },
    addCount: function(t) {
        var e = this, a = t.currentTarget.dataset, n = this.data.total, s = this.data.flowLists, r = s.goods.find(function(t) {
            return t.rec_id == a.id;
        });
        r.goods_number = parseInt(r.goods_number) + 1, n.count += 1, s.total_price += parseInt(r.goods_price), 
        wx.request({
            url: o.apiUrl("ecapi.cart.update"),
            data: {
                good: a.id,
                amount: r.goods_number
            },
            method: "POST",
            success: function() {
                e.onLoad();
            }
        });
    },
    minusCount: function(t) {
        var e = this, a = t.currentTarget.dataset, n = (this.data.total, this.data.flowLists), s = n.goods.find(function(t) {
            return t.rec_id == a.id;
        });
        if (n.total_price -= parseInt(s.goods_price), parseInt(n.total_price) < 0) n.total_price += parseInt(s.goods_price); else {
            if (s.goods_number = parseInt(s.goods_number) - 1, parseInt(s.goods_number) < 1) return s.goods_number = parseInt(s.goods_number) + 1, 
            void (n.total_price += parseInt(s.goods_price));
            wx.request({
                url: o.apiUrl("ecapi.cart.update"),
                data: {
                    good: a.id,
                    amount: s.goods_number
                },
                method: "POST",
                success: function() {
                    e.onLoad();
                }
            });
        }
    },
    del: function(e) {
        var a = this, n = e.currentTarget.dataset;
        wx.showModal({
            title: "提示",
            content: "您确定要移除当前商品吗?",
            success: function(e) {
                e.confirm && wx.request({
                    url: o.apiUrl("ecapi.cart.delete"),
                    data: {
                        good: n.id
                    },
                    method: "POST",
                    header: {
                        "Content-Type": "application/json",
                        "X-ECTouch-Authorization": t
                    },
                    success: function(t) {
                        0 == t.data.error_code ? wx.showToast({
                            title: "删除成功",
                            icon: "warn",
                            duration: 2e3
                        }) : wx.showToast({
                            title: "删除失败",
                            icon: "warn",
                            duration: 2e3
                        }), a.onLoad();
                    }
                });
            }
        });
    },
    flowcartBtn: function() {
        wx.switchTab({
            url: "../categroy/categroy"
        });
    },
    onShow: function() {
        var t = this;
        this.getCartGoods(t);
    },
    siteDetail: function(t) {
        var o = this, e = t.currentTarget.dataset.index, a = o.data.flowLists.goods[e].goods_id;
        wx.navigateTo({
            url: "../goods/goods?objectId=" + a
        });
    },
    onPullDownRefresh: function() {
        var t = this;
        this.getCartGoods(t), wx.stopPullDownRefresh(), t.onLoad();
    }
});