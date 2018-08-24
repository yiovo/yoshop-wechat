let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
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
    // 获取帮助列表
    this.getHelpList();
  },

  /**
   * 获取帮助列表
   */
  getHelpList: function () {
    let _this = this;
    App._get('wxapp/help', {}, function (result) {
      _this.setData(result.data);
    });
  },

})