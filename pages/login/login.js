let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 授权登录
   */
  authorLogin: function (e) {
    let _this = this;
    if (e.detail.errMsg !== 'getUserInfo:ok') {
      return false;
    }
    wx.showLoading({ title: "正在登录", mask: true });
    // 执行微信登录
    wx.login({
      success: function (res) {
        // 发送用户信息
        App._post_form('user/login'
          , {
            code: res.code,
            user_info: e.detail.rawData,
            encrypted_data: e.detail.encryptedData,
            iv: e.detail.iv,
            signature: e.detail.signature
          }
          , function (result) {
            // 记录token user_id
            wx.setStorageSync('token', result.data.token);
            wx.setStorageSync('user_id', result.data.user_id);
            // 跳转回原页面
            _this.navigateBack();
          }
          , false
          , function () {
            wx.hideLoading();
          });
      }
    });
  },

  /**
   * 授权成功 跳转回原页面
   */
  navigateBack: function () {
    wx.navigateBack();
    // let currentPage = wx.getStorageSync('currentPage');
    // wx.redirectTo({
    //   url: '/' + currentPage.route + '?' + App.urlEncode(currentPage.options)
    // });
  },

})