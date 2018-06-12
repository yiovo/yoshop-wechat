module.exports = function(e) {
    var g;
    if ((g = getCurrentPages()).length) {
        var r = g[g.length - 1];
        r && "pages/login/login" != r.route && wx.setStorageSync("login_pre_page", r);
    }
    wx.redirectTo({
        url: "/pages/login/login"
    });
};