let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addresss_link: "../address/index?from=flow",    // 添加配送地址
    nav_select: false,    // 快捷导航
    options: {},    // 当前页面参数
    address: {},    // 收货地址
    goods: {},      // 商品信息

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 当前页面参数
    this.data.options = options;
    this.getOrderData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
        if (result.code === 1) {
            _this.setData(result.data);
        } else {
          App.showError(result.msg);
        }
      });
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