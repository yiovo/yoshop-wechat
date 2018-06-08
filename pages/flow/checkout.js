let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav_select: false,    // 快捷导航
    options: {},          // 当前页面参数
    address: {},          // 默认收货地址
    exist_address: false, // 是否存在收货地址
    goods: {},            // 商品信息

    disabled: false,
    error: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 当前页面参数
    this.data.options = options;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取当前订单信息
    this.getOrderData();
  },

  /**
   * 获取当前订单信息
   */
  getOrderData: function () {
    let _this = this
      , options = _this.data.options;
    // 立即购买
    if (options.order_type === 'buyNow') {
      App._get('order/buyNow', {
        goods_id: options.goods_id,
        goods_num: options.goods_num
      }, function (result) {
        if (result.code !== 1) {
          App.showError(result.msg);
          return false;
        }
        // 收货地址不在配送范围内
        if (!result.data.intra_region) {
          _this.data.disabled = true;
          _this.data.error = result.data.intra_region_error;
          App.showError(_this.data.error);
        }
        _this.setData(result.data);
      });
    }
  },

  /**
   * 选择收货地址
   */
  selectAddress: function () {
    wx.navigateTo({
      url: '../address/' + (this.data.exist_address ? 'index?from=flow' : 'create')
    });
  },

  /**
   * 订单提交
   */
  submitOrder: function () {
    let _this = this;
    if (_this.data.disabled) {
      App.showError(_this.data.error);
      return false;
    }
  },

  /**
   * 快捷导航 显示/隐藏
   */
  commonNav: function () {
    this.setData({
      nav_select: !this.data.nav_select
    });
  },

  /**
   * 快捷导航跳转
   */
  nav: function (e) {
    let url = '';
    switch (e.currentTarget.dataset.index) {
      case 'home':
        url = '../index/index'; break;
      case 'fenlei':
        url = '../category/index'; break;
      case 'cart':
        url = '../flow/index'; break;
      case 'profile':
        url = '../user/index'; break;
    }
    wx.switchTab({ url });
  }


});