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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  bindProfile: function () {
    wx.navigateTo({
      url: "../profile/profile"
    });
  },

  bindMoney: function () {
    wx.navigateTo({
      url: "../account/account"
    });
  },

  bindOrder: function () {
    wx.navigateTo({
      url: "../user_order/order"
    });
  },


})