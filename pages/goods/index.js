function t(t, e, o) {
    return e in t ? Object.defineProperty(t, e, {
        value: o,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = o, t;
}

let e, o = require("../../wxParse/wxParse.js"), a = getApp(), i = {
    id: "",
    num: 1,
    pro: [],
    prostr: []
}, n = "", r = [], s = [];

Page({
    data: (e = {
        hiddenOrder: !1,
        hiddenAddress: !0,
        is_collect: 0,
        currentIndex: 1,
        currentTab: 0,
        maskVisual: "hidden",
        current: 0,
        num: 1,
        goodsComment: [],
        properties: [],
        indicatorDots: !0,
        autoplay: !0,
        interval: 4e3,
        duration: 1e3
    }, t(e, "current", 0), t(e, "number", 1), t(e, "hidden", !1), t(e, "showView", !0),
    t(e, "scrollTop", 0), t(e, "floorstatus", !1), t(e, "goodsImg", []), t(e, "goods", {}),
    t(e, "parameteCont", []), t(e, "selectedPro", ""), e),
    onLoad: function(t) {
        let e = this, n = t.objectId;
        i.id = n, wx.request({
            url: a.apiUrl("ecapi.product.get"),
            data: {
                product: n
            },
            method: "post",
            header: {
                "Content-Type": "application/json"
            },
            success: function(t) {
                o.wxParse("goods_desc", "html", t.data.goods_desc, e, 5), e.setData({
                    goodsImg: t.data.goodsImg,
                    goods: t.data,
                    goodsComment: t.data.comment.slice(0, 5),
                    carModels: t.data.specification,
                    parameteCont: t.data.properties,
                    total_price: t.data.price
                });
                for (let a in t.data.specification) e.getProper(t.data.specification[a].values[0].id);
                e.getGoodsTotal();
            }
        }), this.loadingChange();
    },
    onShow: function() {
        i.num = 1, i.pro = [];
    },
    loadingChange: function() {
        let t = this;
        setTimeout(function() {
            t.setData({
                hidden: !0
            });
        }, 1e3);
    },
    goodsCheckout: function(t) {
        let e = wx.getStorageSync("token"), o = t.currentTarget.id || "cart";
        wx.request({
            url: a.apiUrl("ecapi.cart.add"),
            data: {
                product: i.id,
                property: JSON.stringify(r),
                amount: i.num
            },
            method: "post",
            header: {
                "Content-Type": "application/json",
                "X-ECTouch-Authorization": e
            },
            success: function(t) {
                if (0 == t.data.error_code) if ("cart" == o) wx.switchTab({
                    url: "../flow/index"
                }); else {
                    let e = wx.getStorageSync("token");
                    wx.request({
                        url: a.apiUrl("ecapi.consignee.list"),
                        method: "POST",
                        header: {
                            "Content-Type": "application/json",
                            "X-ECTouch-Authorization": e
                        },
                        success: function(t) {
                            "" != t.data.consignees ? wx.navigateTo({
                                url: "../flow/checkout"
                            }) : (wx.setStorageSync("flowcheckout", {
                                from: "checkout"
                            }), wx.showModal({
                                title: "提示",
                                content: "您还没有地址去填地址？",
                                success: function(t) {
                                    t.confirm ? wx.navigateTo({
                                        url: "../address/create"
                                    }) : t.cancel;
                                }
                            }));
                        }
                    });
                } else wx.showToast({
                    title: "提交失败",
                    icon: "warn",
                    duration: 2e3
                });
            }
        });
    },
    maskHidden: function() {
        this.setData({
            mask: !1,
            cart: !1
        });
    },
    addCost: function(t) {
        n = t.currentTarget.id || "cart", this.setData({
            mask: !0,
            cart: !0
        });
    },
    up: function() {
        let t = this.data.num;
        ++t >= 99 && (t = 99), this.setData({
            num: t
        }), i.num = t, this.getGoodsTotal();
    },
    down: function() {
        let t = this.data.num;
        --t <= 1 && (t = 1), this.setData({
            num: t
        }), i.num = t, this.getGoodsTotal();
    },
    import: function(t) {
        let e = Math.floor(t.detail.value);
        e <= 1 && (e = 1), e >= 999 && (e = 999), this.setData({
            num: e
        }), i.num = e, this.getGoodsTotal();
    },
    modelTap: function(t) {
        this.getProper(t.currentTarget.id), this.getGoodsTotal();
    },
    getProper: function(t) {
        r = [], s = [];
        let e = this.data.carModels;
        for (let o in e) for (let a in e[o].values) e[o].values[a].checked = !1, e[o].values[a].id == t && (i.pro[e[o].name] = t,
        i.prostr[e[o].name] = e[o].values[a].label);
        for (let o in e) if (void 0 != i.pro[e[o].name] && "" != i.pro[e[o].name]) for (let a in e[o].values) e[o].values[a].id == i.pro[e[o].name] && (e[o].values[a].checked = !0);
        for (let n in i.pro) r.push(i.pro[n]);
        for (let d in i.prostr) s.push(i.prostr[d]);
        this.setData({
            carModels: e,
            selectedPro: s.join(",")
        });
    },
    getGoodsTotal: function() {
        let t = this, e = wx.getStorageSync("token");
        wx.request({
            url: a.apiUrl("ecapi.goods.property.total"),
            data: {
                goods_id: i.id,
                goods_number: i.num,
                good_property: r
            },
            method: "POST",
            header: {
                "Content-Type": "application/json",
                "X-ECTouch-Authorization": e
            },
            success: function(e) {
                0 == e.data.error_code && t.setData({
                    total_price: e.data.total_price
                });
            }
        });
    },
    toNew: function() {
        this.updateBtnStatus("new"), wx.redirectTo({
            url: "../goods/index?objectId=" + i.id
        });
    },
    toGood: function() {
        this.updateBtnStatus("good"), wx.redirectTo({
            url: "../goods/detail?objectId=" + i.id
        });
    },
    toChild: function() {
        this.updateBtnStatus("child"), wx.redirectTo({
            url: "../goods/comment?objectId=" + i.id
        });
    },
    updateBtnStatus: function(t) {
        this.setData({
            new: this.getHoverd("new", t),
            good: this.getHoverd("good", t),
            child: this.getHoverd("child", t)
        });
    },
    getHoverd: function(t, e) {
        return t === e ? "top-hoverd-btn" : "";
    },
    bindHeaderTap: function(t) {
        this.setData({
            current: t.target.dataset.index
        }), this.toggleShift();
    },
    bindSwiper: function(t) {
        this.setData({
            current: t.detail.current
        }), this.toggleShift();
    },
    toggleShift: function() {
        this.shiftanimation.left(shiftdata[this.data.current]).step(), this.setData({
            shiftanimation: this.shiftanimation.export()
        });
    },
    flowCart: function() {
        wx.switchTab({
            url: "../flow/index"
        });
    },
    toOrder: function(t) {
        this.setData({
            hiddenOrder: !1,
            hiddenAddress: !0
        });
    },
    toAddress: function(t) {
        this.setData({
            hiddenOrder: !0,
            hiddenAddress: !1
        });
    },
    setCurrent: function(t) {
        this.setData({
            currentIndex: t.detail.current + 1
        });
    },
    imgPreview: function() {
        let t = this.data.goodsImg;
        wx.previewImage({
            current: t[this.data.currentIndex - 1],
            urls: t
        });
    },
    onChangeShowState: function() {
        let t = this;
        t.setData({
            showView: !t.data.showView
        });
    },
    goTop: function(t) {
        this.setData({
            scrollTop: 0
        });
    },
    scroll: function(t) {
        t.detail.scrollTop > 300 ? this.setData({
            floorstatus: !0
        }) : this.setData({
            floorstatus: !1
        });
    },
    commonNav: function() {
        let t = this;
        t.setData({
            nav_select: !t.data.nav_select
        });
    },
    nav: function(t) {
        let e = t.currentTarget.dataset.index;
        "home" == e ? wx.switchTab({
            url: "../index/index"
        }) : "fenlei" == e ? wx.switchTab({
            url: "../category/index"
        }) : "cart" == e ? wx.switchTab({
            url: "../flow/index"
        }) : "profile" == e && wx.switchTab({
            url: "../user/index"
        });
    },
    onShareAppMessage: function() {
        return {
            title: this.data.goods.title,
            desc: "小程序本身无需下载，无需注册，不占用手机内存，可以跨平台使用，响应迅速，体验接近原生App",
            path: "/pages/goods/index?objectId=" + i.id
        };
    }
});
