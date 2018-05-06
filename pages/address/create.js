function i(i, t, e) {
    i.animation = wx.createAnimation({
        transformOrigin: "50% 50%",
        duration: 400,
        timingFunction: "ease",
        delay: 0
    }), i.animation.translateY(t + "vh").step(), i.setData({
        animation: i.animation.export(),
        show: e
    });
}

function t(i) {
    for (let t, n = 0, o = 0; o < h.length; o++) 0 == (t = h[o]).city_id && 0 == t.district_id && (v[n] = t,
    n++);
    i.setData({
        provinces: v
    }), e(0, i), a(0, 0, i);
}

function e(i, t) {
    let e;
    w = [];
    for (let a = 0, n = 0; n < h.length; n++) "00" == (e = h[n]).district_id && e.province_id == v[i].province_id && "00" != e.city_id && (w[a] = e,
    a++);
    0 == w.length && (w[0] = {
        name: ""
    }), t.setData({
        citys: w,
        value: [ i, 0, 0 ]
    });
}

function a(i, t, e) {
    let a;
    _ = [];
    for (let n = 0, o = 0; o < h.length; o++) "00" != (a = h[o]).district_id && a.province_id == v[i].province_id && a.city_id == w[t].city_id && (_[n] = a,
    n++);
    0 == _.length && (_[0] = {
        name: ""
    }), e.setData({
        districts: _,
        value: [ i, t, 0 ]
    });
}

let n, o, r, s, d, c, u, g, l = getApp(), h = [], v = [], w = [], _ = [], f = [ 0, 0, 0 ], m = 0, p = !1, x = 200;

Page({
    data: {
        show: p,
        province: v,
        city: w,
        district: _,
        province_id: v,
        city_id: w,
        district_id: _,
        value: [ 0, 0, 0 ]
    },
    onLoad: function(i) {
        let e = this, a = wx.getStorageSync("token");
        g = wx.getStorageSync("flowcheckout"), "" != h ? t(e) : wx.request({
            url: l.apiUrl("ecapi.region.list"),
            method: "get",
            header: {
                "Content-Type": "application/json",
                "X-ECTouch-Authorization": a
            },
            success: function(i) {
                for (let a = i.data.regions[0].regions, n = [], o = [], r = 0; r < a.length; r++) {
                    n = a[r].region_name;
                    let s = {
                        province_id: o = a[r].region_id,
                        city_id: 0,
                        district_id: 0,
                        region_name: n,
                        region_id: o
                    };
                    h.push(s);
                    for (let d, c = a[r].regions, u = [], g = 0; g < c.length; g++) {
                        let l = {
                            province_id: o,
                            city_id: g + 1,
                            district_id: 0,
                            region_name: u = c[g].region_name,
                            region_id: d = c[g].region_id
                        };
                        h.push(l);
                        for (let v, w = [], _ = c[g].regions, f = 0; f < _.length; f++) {
                            let m = {
                                province_id: o,
                                city_id: g + 1,
                                district_id: f + 1,
                                region_name: w = _[f].region_name,
                                region_id: v = _[f].region_id
                            };
                            h.push(m);
                        }
                    }
                }
                t(e);
            }
        }), e.animation = wx.createAnimation({
            transformOrigin: "50% 50%",
            duration: 0,
            timingFunction: "ease",
            delay: 0
        }), e.animation.translateY("200vh").step(), e.setData({
            animation: e.animation.export(),
            show: p
        }), e.loadingChange();
    },
    bindChange: function(i) {
        let t = i.detail.value;
        f[0] != t[0] ? (t[1] = 0, t[2] = 0, e(t[0], this), a(t[0], t[1], this)) : f[1] != t[1] && (t[2] = 0,
        a(t[0], t[1], this)), f = t, n = [ t[0], t[1], t[2] ], o = v[t[0]].region_name,
        r = w[t[1]].region_name, s = _[t[2]].region_name, d = v[t[0]].region_id, c = w[t[1]].region_id,
        u = _[t[2]].region_id;
    },
    checkFloatView: function(t) {
        let e = this;
        m = 0, i(this, x = 200, p = !0), this.setData({
            value: n,
            province: void 0 == o ? "" : o,
            city: void 0 == r ? "" : r,
            district: void 0 == s ? "" : s,
            province_id: void 0 == d ? "0" : d,
            city_id: void 0 == c ? "0" : c,
            district_id: void 0 == u ? "0" : u,
            showViewMol: !e.data.showViewMol
        });
    },
    hiddenFloatView: function(t) {
        let e = this;
        m = 0, i(this, x = 200, p = !0), e.setData({
            showViewMol: !e.data.showViewMol
        });
    },
    translate: function(t) {
        let e = this;
        0 == m ? (x = 0, p = !1, m = 1) : (x = 200, p = !0, m = 0), i(this, x, p), n = [ 0, 0, 0 ],
        o = "北京", r = "北京", s = "东城区", d = "2", c = "52", u = "500", e.setData({
            showViewMol: !e.data.showViewMol
        });
    },
    loadingChange: function() {
        let i = this;
        setTimeout(function() {
            i.setData({
                hidden: !0
            });
        }, 2e3);
    },
    saveData: function(i) {
        let t = this, e = i.detail.value, a = wx.getStorageSync("token"), n = {
            name: e.consignee,
            mobile: e.mobile,
            tel: "",
            zip_code: "",
            region: t.data.district_id,
            address: e.address
        };
        wx.request({
            url: l.apiUrl("ecapi.consignee.add"),
            method: "post",
            header: {
                "X-ECTouch-Authorization": a
            },
            data: n,
            success: function(i) {
                let a = i.data.status_code, n = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/, o = e.mobile;
                if (500 == a) {
                    if ("" == e.consignee) return wx.showToast({
                        title: "收件人不能为空",
                        image: "../../images/failure.png",
                        duration: 2e3
                    }), !1;
                    if (0 == o.length) return wx.showToast({
                        title: "手机号不能为空",
                        image: "../../images/failure.png",
                        duration: 2e3
                    }), !1;
                    if (11 != o.length) return wx.showToast({
                        title: "手机号长度有误",
                        image: "../../images/failure.png",
                        duration: 1500
                    }), !1;
                    if (!n.test(o)) return wx.showToast({
                        title: "手机号不符合要求",
                        image: "../../images/failure.png",
                        duration: 1500
                    }), !1;
                    if ("" == t.data.province && "" == t.data.city && "" == t.data.district) return wx.showToast({
                        title: "省市区不能空",
                        image: "../../images/failure.png",
                        duration: 2e3
                    }), !1;
                    if ("" == e.address) return wx.showToast({
                        title: "详细地址不能为空",
                        image: "../../images/failure.png",
                        duration: 2e3
                    }), !1;
                } else {
                    if ("10001" == i.data.error_code) return wx.showToast({
                        title: "手机号不符合",
                        image: "../../images/failure.png",
                        duration: 2e3
                    }), !1;
                    wx.showToast({
                        title: "保存成功",
                        duration: 2e3,
                        success: function() {
                            "user" == g.from ? wx.navigateBack({
                                delta: 1
                            }) : wx.redirectTo({
                                url: "../flow/checkout"
                            });
                        }
                    });
                }
            }
        });
    },
    formReset: function() {
        this.setData({
            value: "",
            province: "",
            city: "",
            district: "",
            province_id: "",
            city_id: "",
            district_id: ""
        });
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },
    commonNav: function() {
        let i = this;
        i.setData({
            nav_select: !i.data.nav_select
        });
    },
    nav: function(i) {
        let t = i.currentTarget.dataset.index;
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
