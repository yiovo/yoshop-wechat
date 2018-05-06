let e, t = getApp(), n = "";

Page({
    data: {
        searchSize: "20",
        searchColor: "rgba(180,180,180,1)",
        hotrecent: [ {
            title: "男装",
            icon_url: ""
        } ]
    },
    onLoad: function(t) {
        e = t.objectId ? t.objectId : "";
    },
    onShow: function() {
        this.getRecentSearch();
    },
    getRecentSearch: function() {
        for (let e, t = wx.getStorageSync("recentKeyword").split(","), n = [], r = 0; r < t.length; r++) if ("" != t[r]) {
            e = !1;
            for (let c = 0; c < n.length; c++) t[r] == n[c] && (e = !0);
            0 == e && n.push(t[r]);
        }
        wx.setStorageSync("recentKeyword", n.join(",")), this.setData({
            hotrecent: n
        });
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },
    getSearchContent: function(e) {
        n = e.detail.value;
    },
    search: function() {
        let r = wx.getStorageSync("recentKeyword");
        r = "" == r ? n : r + "," + n, wx.setStorageSync("recentKeyword", r), t.redirectTo("../category/list?content=" + n + "&id=" + e);
    },
    gosearch: function(n) {
        t.redirectTo("../category/list?content=" + n.target.dataset.text + "&id=" + e);
    },
    clearSearch: function() {
        wx.clearStorageSync(), this.getRecentSearch();
    }
});
