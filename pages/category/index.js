let t = getApp();

Page({
    data: {
        searchColor: "rgba(0,0,0,0.4)",
        searchSize: "15",
        searchName: "搜索商品",
        hidden: !1,
        curNav: 1,
        curIndex: 0,
        cateLeft: [],
        cateRight: []
    },
    onLoad: function() {
        let e = this;
        wx.request({
            url: t.apiUrl("ecapi.category.all.list"),
            data: {
                id: "0",
                per_page: "5",
                category: "1",
                shop: 1,
                page: 1
            },
            method: "post",
            header: {
                "Content-Type": "application/json"
            },
            success: function(t) {
                e.setData({
                    cateLeft: t.data.left,
                    cateRight: t.data.right,
                    curNav: t.data.left[0].cat_id
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
    selectNav: function(t) {
        let e = t.target.dataset.id, a = parseInt(t.target.dataset.index);
        self = this, this.setData({
            curNav: e,
            curIndex: a,
            scrollTop: 0
        });
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },
    onShareAppMessage: function() {
        return {
            title: "分类",
            desc: "小程序本身无需下载，无需注册，不占用手机内存，可以跨平台使用，响应迅速，体验接近原生App",
            path: "/pages/category/index"
        };
    }
});
