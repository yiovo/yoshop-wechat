let e, n = getApp();

Page({
    data: {
        userInfo: {},
        userLists: [ {
            name: "收货地址",
            pic: "icon-shouhuodizhi1",
            link: "../address/index"
        }, {
            name: "商品收藏",
            pic: "icon-shoucang1",
            link: "../user/collect"
        }, {
            name: "我的帮助",
            pic: "icon-bangzhu",
            link: "../user/help"
        } ],
        userMoney: [ {
            link: "../account/account",
            num: "26963.00",
            cont: "余额"
        }, {
            link: "../classify/classify",
            num: "1",
            cont: "红包"
        }, {
            link: "../classify/classify",
            num: "5630",
            cont: "积分"
        }, {
            link: "../classify/classify",
            num: "0",
            cont: "优惠券"
        } ]
    },
    bindProfile: function() {
        wx.navigateTo({
            url: "../profile/profile"
        });
    },
    bindMoney: function() {
        wx.navigateTo({
            url: "../account/account"
        });
    },
    bindOrder: function() {
        wx.navigateTo({
            url: "../user_order/order"
        });
    },
    onShow: function() {
        let e = this;
        n.getUserInfo(function(n) {
            e.setData({
                userInfo: n
            });
        });
        let t = wx.getStorageSync("token");
        wx.setStorageSync("flowcheckout", {
            from: "user"
        }), wx.request({
            url: n.apiUrl("ecapi.site.get"),
            data: {
                per_page: "10",
                page: "1"
            },
            header: {
                "Content-Type": "application/json",
                "X-ECTouch-Authorization": t
            },
            method: "POST",
            success: function(n) {
                e.setData({
                    recommend: n.data
                });
            }
        }), this.loadingChange();
    },
    loadingChange: function() {
        let e = this;
        this.setData({
            hidden: !1
        }), setTimeout(function() {
            e.setData({
                hidden: !0
            });
        }, 2e3);
    },
    siteDetail: function(e) {
        let n = this, t = e.currentTarget.dataset.index, a = n.data.recommend[t].goods_id;
        wx.navigateTo({
            url: "../goods/index?objectId=" + a
        });
    },
    invoiceNav: function(t) {
        let a = this;
        e = wx.getStorageSync("token"), wx.request({
            url: n.apiUrl("user/invoice/detail"),
            method: "POST",
            header: {
                "Content-Type": "application/json",
                "X-ECTouch-Authorization": e
            },
            success: function(e) {
                0 != e.data.data ? wx.navigateTo({
                    url: "../invoice/detail"
                }) : wx.navigateTo({
                    url: "../invoice/create"
                }), a.setData({
                    invoices: e.data.data
                });
            }
        });
    },
    onShareAppMessage: function() {
        return {
            title: "小程序首页",
            desc: "小程序本身无需下载，无需注册，不占用手机内存，可以跨平台使用，响应迅速，体验接近原生App",
            path: "/pages/user/user"
        };
    }
});
