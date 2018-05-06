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
    var t;
    f = [];
    for (var e = 0, a = 0; a < m.length; a++) 0 == (t = m[a]).city_id && 0 == t.district_id && (f[e] = t, 
    e++);
    i.setData({
        provinces: f
    });
}

function e(i, t) {
    var e;
    w = [];
    for (var a = 0, n = 0; n < m.length; n++) 0 == (e = m[n]).district_id && e.province_id == f[i].province_id && 0 != e.city_id && (w[a] = e, 
    a++);
    0 == w.length && (w[0] = {
        name: ""
    }), t.setData({
        citys: w
    });
}

function a(i, t, e) {
    var a;
    y = [];
    for (var n = 0, r = 0; r < m.length; r++) 0 != (a = m[r]).district_id && a.province_id == f[i].province_id && a.city_id == w[t].city_id && (y[n] = a, 
    n++);
    0 == y.length && (y[0] = {
        name: ""
    }), e.setData({
        districts: y
    });
}

var n, r, o, d, s, c, g, v, _, l, h, u, p = getApp(), m = [], f = [], w = [], y = [], D = [ 0, 0, 0 ], x = 0, S = !1, b = 200;

Page({
    data: {
        show: S,
        province: f,
        city: w,
        district: y,
        province_id: f,
        city_id: w,
        district_id: y,
        value: [ 0, 0, 0 ]
    },
    onLoad: function(i) {
        var s = this;
        wx.getStorageSync("token");
        u = wx.getStorageSync("addressData");
        var c = wx.getStorageSync("regions");
        if (n = i.objectId, "" != m) s.addressData(); else {
            for (var g = c[0].regions, v = [], _ = [], l = 0; l < g.length; l++) {
                v = g[l].region_name;
                var h = {
                    province_id: _ = g[l].region_id,
                    city_id: 0,
                    district_id: 0,
                    region_name: v,
                    region_id: _
                };
                m.push(h);
                for (var p, f = g[l].regions, w = [], y = 0; y < f.length; y++) {
                    var D = {
                        province_id: _,
                        city_id: y + 1,
                        district_id: 0,
                        region_name: w = f[y].region_name,
                        region_id: p = f[y].region_id
                    };
                    m.push(D);
                    for (var x, b = [], V = f[y].regions, M = 0; M < V.length; M++) {
                        var k = {
                            province_id: _,
                            city_id: y + 1,
                            district_id: M + 1,
                            region_name: b = V[M].region_name,
                            region_id: x = V[M].region_id
                        };
                        m.push(k);
                    }
                }
            }
            t(s);
            var _ = u.province, T = u.city, A = u.district;
            r = 0, o = 0, d = 0;
            for (var C = 0; C < s.data.provinces.length; C++) s.data.provinces[C].province_id == _ && (r = C);
            e(r, s);
            for (var F = 0; F < s.data.citys.length; F++) s.data.citys[F].region_id == T && (o = F);
            a(r, o, s);
            for (var P = 0; P < s.data.districts.length; P++) s.data.districts[P].region_id == A && (d = P);
            s.setData({
                value: [ r, o, d ]
            }), s.setData({
                consignee: u.consignee,
                mobile: u.full_mobile,
                address: u.full_address,
                province: u.province_name,
                city: u.city_name,
                district: u.district_name,
                province_id: u.province,
                city_id: u.city,
                district_id: u.district
            });
        }
        s.animation = wx.createAnimation({
            transformOrigin: "50% 50%",
            duration: 0,
            timingFunction: "ease",
            delay: 0
        }), s.animation.translateY("200vh").step(), s.setData({
            animation: s.animation.export(),
            show: S
        }), s.loadingChange();
    },
    loadingChange: function() {
        var i = this;
        setTimeout(function() {
            i.setData({
                hidden: !0
            });
        }, 2e3);
    },
    addressData: function() {
        var i = this;
        wx.getStorageSync("token");
        u = wx.getStorageSync("addressData");
        wx.getStorageSync("regions");
        t(i);
        var n = u.province, s = u.city, c = u.district;
        r = 0, o = 0, d = 0;
        for (var g = 0; g < i.data.provinces.length; g++) i.data.provinces[g].province_id == n && (r = g);
        e(r, i);
        for (var v = 0; v < i.data.citys.length; v++) i.data.citys[v].region_id == s && (o = v);
        a(r, o, i);
        for (var _ = 0; _ < i.data.districts.length; _++) i.data.districts[_].region_id == c && (d = _);
        i.setData({
            value: [ r, o, d ]
        }), i.setData({
            consignee: u.consignee,
            mobile: u.full_mobile,
            address: u.full_address,
            province: u.province_name,
            city: u.city_name,
            district: u.district_name,
            province_id: u.province,
            city_id: u.city,
            district_id: u.district
        });
    },
    bindChange: function(i) {
        var t = i.detail.value;
        D[0] != t[0] ? (t[1] = 0, t[2] = 0, e(t[0], this), a(t[0], t[1], this)) : D[1] != t[1] && (t[2] = 0, 
        a(t[0], t[1], this)), D = t, s = [ t[0], t[1], t[2] ], c = f[t[0]].region_name, 
        g = w[t[1]].region_name, v = y[t[2]].region_name, _ = f[t[0]].region_id, l = w[t[1]].region_id, 
        h = y[t[2]].region_id, this.setData({
            value: [ t[0], t[1], t[2] ]
        });
    },
    checkFloatView: function(t) {
        var e = this;
        x = 0, i(this, b = 200, S = !0), this.setData({
            value: s,
            province: void 0 == c ? "" : c,
            city: void 0 == g ? "" : g,
            district: void 0 == v ? "" : v,
            province_id: void 0 == _ ? "0" : _,
            city_id: void 0 == l ? "0" : l,
            district_id: void 0 == h ? "0" : h,
            showViewMol: !e.data.showViewMol
        });
    },
    hiddenFloatView: function(t) {
        var e = this;
        x = 0, i(this, b = 200, S = !0), e.setData({
            showViewMol: !e.data.showViewMol
        });
    },
    translate: function(t) {
        var e = this;
        0 == x ? (b = 0, S = !1, x = 1) : (b = 200, S = !0, x = 0), i(this, b, S), e.setData({
            showViewMol: !e.data.showViewMol
        });
    },
    saveData: function(i) {
        var t = this, e = wx.getStorageSync("token"), a = i.detail.value, n = {
            name: a.consignee,
            region: t.data.district_id,
            mobile: a.mobile,
            tel: "",
            zip_code: "",
            address: a.address,
            consignee: u.address_id
        };
        wx.request({
            url: p.apiUrl("ecapi.consignee.update"),
            method: "post",
            header: {
                "X-ECTouch-Authorization": e
            },
            data: n,
            success: function(i) {
                i.data;
                0 != i.data.error_code ? wx.showToast({
                    title: "更新失败",
                    image: "../../images/failure.png",
                    duration: 2e3
                }) : wx.showToast({
                    title: "保存成功",
                    duration: 2e3,
                    success: function() {
                        wx.navigateBack({
                            delta: 1
                        }), wx.redirectTo({
                            url: "./index"
                        });
                    }
                });
            }
        });
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    }
});