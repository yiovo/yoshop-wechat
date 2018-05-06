let a, t, e, i = getApp(), n = {
    consignee: 1,
    shipping: 1,
    msg: ""
};

Page({
    data: {
        index: 0,
        orderJtou: "../../res/images/icon-arrowdown.png",
        addresss_link: "../address/index?from=flow",
        checkList: []
    },
    onShow: function() {
        a = wx.getStorageSync("token");
        let s = this;
        wx.request({
            url: i.apiUrl("ecapi.cart.flow"),
            method: "post",
            header: {
                "Content-Type": "application/json",
                "X-ECTouch-Authorization": a
            },
            success: function(a) {
                if (void 0 == a.data[400]) if (0 != a.data.cart_goods.length) {
                    n.consignee = a.data.consignees.address_id;
                    let i = {
                        id: [],
                        name: []
                    };
                    t = a.data.cart_goods;
                    for (let o in a.data.shipping) i.id.push(a.data.shipping[o].shipping_id), i.name.push(a.data.shipping[o].shipping_name);
                    n.shipping = i.id[0];
                    let d, r = "";
                    for (let o in a.data.cart_goods) {
                        d = a.data.cart_goods[o].goods_attr.split("\n");
                        for (let c in d) "" != d[c] && (r += d[c] + ",");
                        a.data.cart_goods[o].goods_attr = r.substring(0, r.length - 1);
                    }
                    e = a.data.total, s.setData({
                        checkList: a.data.cart_goods,
                        goods_total: a.data.total,
                        flowCont: "共" + a.data.total_number + "件商品,合计：",
                        flowMoney: a.data.total,
                        addresss: a.data.consignees,
                        shipping: i
                    }), s.shippingChange();
                } else wx.switchTab({
                    url: "../categroy/categroy"
                }); else wx.switchTab({
                    url: "../categroy/categroy"
                });
            }
        }), this.loadingChange();
    },
    loadingChange: function() {
        let a = this;
        setTimeout(function() {
            a.setData({
                hidden: !0
            });
        }, 2e3);
    },
    shippingChange: function(s) {
        let o = 0;
        void 0 != s && (o = s.detail.value), n.shipping = this.data.shipping.id[o];
        let d = this;
        this.setData({
            index: o
        }), wx.request({
            url: i.apiUrl("ecapi.shipping.select.shipping"),
            data: {
                address: n.consignee,
                shipping_id: n.shipping,
                goods: t
            },
            method: "POST",
            header: {
                "Content-Type": "application/json",
                "X-ECTouch-Authorization": a
            },
            success: function(a) {
                0 != a.data ? parseInt(a.data) >= 0 && d.setData({
                    payfee: a.data,
                    payname: d.data.shipping.name[o],
                    total: e + parseInt(a.data)
                }) : d.setData({
                    payfee: "",
                    total: e
                });
            }
        });
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },
    siteDetail: function(a) {
        let t = this, e = a.currentTarget.dataset.index, i = t.data.checkList[e].goods_id;
        wx.navigateTo({
            url: "../goods/index?objectId=" + i
        });
    },
    submitOrder: function() {
        "" != n.consignee && void 0 != n.consignee ? wx.request({
            url: i.apiUrl("ecapi.cart.checkout"),
            method: "post",
            data: {
                consignee: n.consignee,
                shipping: n.shipping,
                comment: n.msg
            },
            header: {
                "Content-Type": "application/json",
                "X-ECTouch-Authorization": a
            },
            success: function(a) {
                let t = a.data.order.order_id;
                "" != t && wx.redirectTo({
                    url: "../flow/done?id=" + t
                });
            }
        }) : i.showMessage("没有收货地址");
    },
    getmsg: function(a) {
        n.msg = a.detail.value;
    },
    commonNav: function() {
        let a = this;
        a.setData({
            nav_select: !a.data.nav_select
        });
    },
    nav: function(a) {
        let t = a.currentTarget.dataset.index;
        "home" == t ? wx.switchTab({
            url: "../index/index"
        }) : "fenlei" == t ? wx.switchTab({
            url: "../category/index"
        }) : "cart" == t ? wx.switchTab({
            url: "../flow/index"
        }) : "profile" == t && wx.switchTab({
            url: "../user/index"
        });
    }
});
