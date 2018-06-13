let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataType: 'all',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 订单数据类型
    let dataType = options.type || 'all';
    this.setData({ dataType });
    // 获取订单列表
    this.getOrderList(dataType);
  },

  /**
   * 切换标签
   */
  bindHeaderTap: function (e) {
    this.setData({ dataType: e.target.dataset.type });
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

  /**
   * 取消订单
   */
  cancelOrder: function (e) {
    let _this = this;
    let order_id = e.currentTarget.dataset.id;
    wx.showModal({
      title: "提示",
      content: "确认取消订单？",
      success: function (o) {
        if (o.confirm) {
          App._post_form('user.order/cancel', { order_id }, function (result) {
            if (result.code === 1) {
              _this.getOrderList(_this.data.dataType);
            } else {
              App.showError(result.msg);
            }
          });
        }
      }
    });


  },

})