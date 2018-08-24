let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id: null,
    order: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.order_id = options.order_id;
    this.getOrderDetail(options.order_id);
  },

  /**
   * 获取订单详情
   */
  getOrderDetail: function (order_id) {
    let _this = this;
    App._get('user.order/detail', { order_id }, function (result) {
      _this.setData(result.data);
    });
  },

  /**
   * 跳转到商品详情
   */
  goodsDetail: function (e) {
    let goods_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../goods/index?goods_id=' + goods_id
    });
  },

  /**
   * 取消订单
   */
  cancelOrder: function (e) {
    let _this = this;
    let order_id = _this.data.order_id;
    wx.showModal({
      title: "提示",
      content: "确认取消订单？",
      success: function (o) {
        if (o.confirm) {
          App._post_form('user.order/cancel', { order_id }, function (result) {
            wx.navigateBack();
          });
        }
      }
    });
  },

  /**
   * 发起付款
   */
  payOrder: function (e) {
    let _this = this;
    let order_id = _this.data.order_id;

    // 显示loading
    wx.showLoading({ title: '正在处理...', });
    App._post_form('user.order/pay', { order_id }, function (result) {
      if (result.code === -10) {
        App.showError(result.msg);
        return false;
      }
      // 发起微信支付
      wx.requestPayment({
        timeStamp: result.data.timeStamp,
        nonceStr: result.data.nonceStr,
        package: 'prepay_id=' + result.data.prepay_id,
        signType: 'MD5',
        paySign: result.data.paySign,
        success: function (res) {
          _this.getOrderDetail(order_id);
        },
        fail: function () {
          App.showError('订单未支付');
        },
      });
    });
  },

  /**
   * 确认收货
   */
  receipt: function (e) {
    let _this = this;
    let order_id = _this.data.order_id;
    wx.showModal({
      title: "提示",
      content: "确认收到商品？",
      success: function (o) {
        if (o.confirm) {
          App._post_form('user.order/receipt', { order_id }, function (result) {
            _this.getOrderDetail(order_id);
          });
        }
      }
    });
  },


});