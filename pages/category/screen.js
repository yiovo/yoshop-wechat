let a, t, e, i, n = getApp(), r = [], s = "";

Page({
    data: {
        showView: !0,
        showSize: !0,
        brandName: "",
        currentPrice: 0,
        numHide: 0,
        disabledInput: !1
    },
    onLoad: function(t) {
        a = t.objectId;
    },
    onShow: function(t) {
        let e = this, i = wx.getStorageSync("token");
        s = "", wx.request({
            url: n.apiUrl("ecapi.goods.attr"),
            method: "post",
            data: {
                category: a
            },
            header: {
                "Content-Type": "application/json",
                "X-ECTouch-Authorization": i
            },
            success: function(a) {
                if (a.data.attr) for (let t = 0; t < a.data.attr.length; t++) a.data.attr[t].id = t + 1,
                a.data.attr[t].radio_name = "";
                e.setData({
                    screen: a.data
                });
            }
        }), e.loadingChange();
    },
    loadingChange: function() {
        let a = this;
        setTimeout(function() {
            a.setData({
                hidden: !0
            });
        }, 2e3);
    },
    onChangeShowState: function() {
        let a = this;
        a.setData({
            showView: !a.data.showView
        });
    },
    radioChange: function(a) {
        let t = this;
        t.setData({
            brandName: a.detail.value,
            showView: !t.data.showView
        });
    },
    tagPrice: function(a) {
        let t = this, e = a.currentTarget.dataset.id;
        t.setData({
            currentPrice: e
        });
    },
    onChangeSize: function(a) {
        let e = this;
        (e = this).data.numHide == (t = a.currentTarget.id) ? e.setData({
            numHide: 0
        }) : e.setData({
            numHide: t
        });
    },
    radioChangeSize: function(a) {
        for (let e = this, i = 0; i < e.data.screen.attr.length; i++) e.data.screen.attr[i].id == t && (e.data.screen.attr[i].radio_name = a.detail.value);
        e.setData({
            screen: e.data.screen,
            showSize: !e.data.showSize
        });
    },
    priceInputLowest: function(a) {
        let t = this;
        e = a.detail.value, console.log(e), t.setData({
            lowest: a.detail.value,
            active: "active"
        });
    },
    priceInputHighest: function(a) {
        let t = this;
        i = a.detail.value, console.log(i), t.setData({
            highest: a.detail.value,
            active: "active"
        });
    },
    butPrice: function() {
        let a = this;
        wx.showModal({
            title: "提示",
            content: "您已输入自定义价格，确定要取消吗？",
            success: function(t) {
                t.confirm ? (a.setData({
                    highest: "",
                    lowest: "",
                    disabledInput: !1,
                    active: "",
                    price_min: "",
                    price_max: ""
                }), a.formReset()) : t.cancel;
            }
        });
    },
    inputPrice: function() {
        let a = this;
        wx.showModal({
            title: "提示",
            content: "您已选择价格区间，无法输入，确定取消价格区间吗？",
            success: function(t) {
                t.confirm ? (s = "", a.setData({
                    disabledInput: !1,
                    grade_info: "",
                    currentPrice: 0
                })) : t.cancel;
            }
        });
    },
    priceChange: function(a) {
        let t = this;
        s = a.detail.value, t.setData({
            disabledInput: !0,
            grade_info: a.detail.value
        }), (t.data.lowest || t.data.highest) && wx.showModal({
            title: "提示",
            content: "您已输入自定义属性，确定要取消吗？",
            success: function(a) {
                a.confirm ? (t.data.lowest = "", t.data.highest = "", this.setData({
                    lowest: "",
                    highest: ""
                })) : a.cancel && t.setData({
                    currentPrice: 0
                });
            }
        });
    },
    formSubmit: function(t) {
        let n = this;
        wx.getStorageSync("token");
        if (void 0 == e && void 0 != i || void 0 != e && void 0 == i || "" == e && "" != i || "" != e && "" == i) wx.showToast({
            title: "区间值不正确",
            image: "../../images/failure.png",
            duration: 2e3
        }); else {
            s = e > i ? t.detail.value.price_min && t.detail.value.price_max ? Math.abs(t.detail.value.price_max) + "-" + Math.abs(t.detail.value.price_min) : s : t.detail.value.price_min && t.detail.value.price_max ? Math.abs(t.detail.value.price_min) + "-" + Math.abs(t.detail.value.price_max) : s,
            s = s || t.detail.value.price_min + "-" + t.detail.value.price_max;
            let o = n.data.brandName;
            if (n.data.screen.attr) for (let c = 0; c < n.data.screen.attr.length; c++) r[c] = n.data.screen.attr[c].radio_name; else r = "";
            wx.navigateTo({
                url: "../category/list?objectId=" + s + "&brand_id=" + o + "&id=" + a + "&filter_attr=" + r
            });
        }
    },
    formReset: function() {
        let a = this;
        if (a.data.screen.attr) for (let t = 0; t < a.data.screen.attr.length; t++) a.data.screen.attr[t].radio_name = "";
        this.setData({
            disabledInput: !1,
            brandName: "",
            grade_info: "",
            currentPrice: 0,
            lowest: "",
            highest: "",
            screen: a.data.screen
        });
    }
});
