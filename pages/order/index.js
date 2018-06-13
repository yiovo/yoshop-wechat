let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    'type': 'all',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      'type': options.type || 'all'
    });
    // 获取订单列表
    this.getOrderList('type');
  },

  /**
   * 切换标签
   */
  bindHeaderTap: function (e) {
    this.setData({ 'type': e.target.dataset.type });
    // 获取订单列表
    this.getOrderList(e.target.dataset.type);
  },

  /**
   * 获取订单列表
   */
  getOrderList: function (dataType) {
    let _this = this;
    App._get('user.order/lists', { dataType }, function (result) {
      if (result.code === 1) {
        _this.setData(result.data);
      } else {
        App.showError(result.msg);
      }
    });
  },

})