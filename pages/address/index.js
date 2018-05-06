let e = getApp();

Page({
    data: {
        addressList: []
    },
    onShow: function(t) {
        let a = this, s = wx.getStorageSync("token");
        wx.setStorageSync("pageOptions", t), wx.request({
            url: e.apiUrl("ecapi.region.list"),
            method: "get",
            header: {
                "Content-Type": "application/json",
                "X-ECTouch-Authorization": s
            },
            success: function(e) {
                wx.setStorageSync("regions", e.data.regions);
            }
        }), a.addressData(), this.loadingChange();
    },
    addressData: function() {
        let t = this, a = wx.getStorageSync("token");
        wx.request({
            url: e.apiUrl("ecapi.consignee.list"),
            method: "POST",
            header: {
                "X-ECTouch-Authorization": a
            },
            success: function(e) {
                t.setData({
                    addressList: e.data.consignees
                });
            }
        });
    },
    loadingChange: function() {
        let e = this;
        setTimeout(function() {
            e.setData({
                hidden: !0
            });
        }, 1e3);
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },
    createAddress: function() {
        wx.navigateTo({
            url: "./create"
        });
    },
    editAddress: function(e) {
        let t = this, a = e.currentTarget.dataset.address, s = t.data.addressList[a];
        wx.setStorage({
            key: "addressData",
            data: s,
            success: function(e) {
                wx.navigateTo({
                    url: "./detail"
                });
            }
        });
    },
    removeAddress: function(t) {
        let a = this, s = wx.getStorageSync("token"), n = t.currentTarget.dataset.address;
        wx.showModal({
            title: "提示",
            content: "您确定要移除当前收货地址吗?",
            success: function(t) {
                t.confirm && wx.request({
                    url: e.apiUrl("ecapi.consignee.delete"),
                    method: "POST",
                    header: {
                        "X-ECTouch-Authorization": s
                    },
                    data: {
                        consignee: n
                    },
                    success: function() {
                        let e = wx.getStorageSync("pageOptions");
                        a.onShow(e);
                    }
                });
            }
        });
    },
    setDefault: function(t) {
        let a = this, s = t.detail.value, n = wx.getStorageSync("token");
        wx.request({
            url: e.apiUrl("ecapi.consignee.setDefault"),
            method: "POST",
            header: {
                "X-ECTouch-Authorization": n
            },
            data: {
                consignee: s
            },
            success: function() {
                wx.showToast({
                    title: "设置成功",
                    success: function() {
                        let e = wx.getStorageSync("pageOptions");
                        a.onLoad(e), e.from, wx.navigateBack({
                            delta: 1
                        });
                    }
                });
            }
        });
    }
});
