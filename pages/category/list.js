let t, e = getApp().apiUrl("ecapi.product.list"), a = 1, i = "", n = "0", o = "1", s = "", r = "", d = "", c = "", h = function(h) {
    h.setData({
        hidden: !1
    }), t = wx.getStorageSync("token"), 1 == h.data.isListData && wx.request({
        url: e,
        data: {
            page: a,
            per_page: 6,
            category: i,
            keyword: s,
            grade_info: r,
            brand_id: d,
            filter_attr: c,
            shop: 1,
            sort_key: n,
            sort_value: o
        },
        method: "post",
        header: {
            "Content-Type": "application/json",
            "X-ECTouch-Authorization": t
        },
        success: function(t) {
            for (let e = h.data.list, i = 0; i < t.data.list.length; i++) e.push(t.data.list[i]);
            h.setData({
                list: e
            }), a++, h.setData({
                hidden: !0
            });
        }
    });
};

Page({
    data: {
        hidden: !0,
        scrollHeight: 0,
        current: "0",
        list: [],
        scrollTop: 0,
        showView: !0,
        arrange: "arrange",
        isListData: !0,
        hiddenCateAll: !1,
        hiddenNum: !0,
        hiddenPrice: !0,
        hiddenSynthesize: !0,
        showTop: !1,
        showBot: !0
    },
    onLoad: function(t) {
        let e = this;
        r = t.objectId ? t.objectId : "", i = t.id ? t.id : "", s = t.content ? t.content : "",
        d = t.brand_id ? t.brand_id : "", c = t.filter_attr ? t.filter_attr : "", e.setData({
            category: t.id ? t.id : ""
        }), wx.getSystemInfo({
            success: function(t) {
                e.setData({
                    scrollHeight: t.windowHeight - 90,
                    windowWidth: t.windowWidth
                });
            }
        }), a = 1, h(e), this.loadingChange();
    },
    loadingChange: function() {
        let t = this;
        setTimeout(function() {
            t.setData({
                hidden: !0
            });
        }, 2e3);
    },
    toSynthesize: function(t) {
        wx.redirectTo({
            url: "../category/screen?objectId=" + i
        });
    },
    toCateAll: function(t) {
        let e = this;
        "list-0" == t.currentTarget.id && (a = 1, e.setData({
            hiddenCateAll: !1,
            hiddenSynthesize: !0,
            hiddenNum: !0,
            hiddenPrice: !0,
            list: [],
            current: t.currentTarget.dataset.index,
            isListData: !0,
            scrollTop: 0,
            viewBox: !1
        }), n = t.currentTarget.dataset.index, h(e));
    },
    toNum: function(t) {
        let e = this;
        "list-0" == t.currentTarget.id && (a = 1, e.setData({
            hiddenCateAll: !0,
            hiddenSynthesize: !0,
            hiddenNum: !1,
            hiddenPrice: !0,
            list: [],
            current: t.currentTarget.dataset.index,
            isListData: !0,
            scrollTop: 0,
            viewBox: !1
        }), n = t.currentTarget.dataset.index, h(e));
    },
    toPrice: function(t) {
        let e = this;
        o = "1" == o ? "0" : "1", e.setData({
            hiddenCateAll: !0,
            hiddenSynthesize: !0,
            hiddenNum: !0,
            hiddenPrice: !1,
            showPrice: !e.data.showPrice,
            showTop: !e.data.showTop,
            showBot: !e.data.showBot,
            list: [],
            current: t.currentTarget.dataset.index,
            isListData: !0,
            scrollTop: 0,
            viewBox: !1
        }), n = t.currentTarget.dataset.index, a = 1, h(e);
    },
    bindDownLoad: function() {
        console.log("到底部了"), h(this);
    },
    upbindDownLoad: function() {
        console.log("到顶部了"), a = 1;
        let t = this;
        t.setData({
            list: [],
            scrollTop: 0
        }), h(t);
    },
    scroll: function(t) {
        this.setData({
            scrollTop: t.detail.scrollTop,
            viewBox: !0
        });
    },
    topLoad: function(t) {
        a = 1, this.setData({
            scrollTop: 0
        }), h(this);
    },
    onChangeShowState: function() {
        let t = this;
        t.setData({
            showView: !t.data.showView,
            arrange: t.data.arrange ? "" : "arrange"
        });
    }
});
