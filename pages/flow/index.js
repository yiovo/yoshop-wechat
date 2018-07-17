let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_list: [], // 商品列表
    order_total_num: 0,
    order_total_price: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getCartList();
  },

  /**
   * 获取购物车列表
   */
  getCartList: function() {
    let _this = this;
    App._get('cart/lists', {}, function(result) {
      if (result.code === 1) {
        _this.setData(result.data);
      } else {
        App.showError(result.msg);
      }
    });
  },

  /**
   * 递增指定的商品数量
   */
  addCount: function(e) {
    let index = e.currentTarget.dataset.index,
      goodsSpecId = e.currentTarget.dataset.specId,
      goods = this.data.goods_list[index],
      order_total_price = this.data.order_total_price;
    // 后端同步更新
    App._post_form('cart/add', {
      goods_id: goods.goods_id,
      goods_num: 1,
      goods_spec_id: goodsSpecId
    });
    goods.total_num++;
    this.setData({
      ['goods_list[' + index + ']']: goods,
      order_total_price: this.mathadd(order_total_price, goods.goods_price)
    });
  },

  /**
   * 递减指定的商品数量
   */
  minusCount: function(e) {
    let index = e.currentTarget.dataset.index,
      goodsSpecId = e.currentTarget.dataset.specId,
      goods = this.data.goods_list[index],
      order_total_price = this.data.order_total_price;

    if (goods.total_num > 1) {
      // 后端同步更新
      App._post_form('cart/sub', {
        goods_id: goods.goods_id,
        goods_spec_id: goodsSpecId
      });
      goods.total_num--;
      this.setData({
        ['goods_list[' + index + ']']: goods,
        order_total_price: this.mathsub(order_total_price, goods.goods_price)
      });
    }
  },

  /**
   * 删除商品
   */
  del: function(e) {
    let _this = this,
      goods_id = e.currentTarget.dataset.goodsId,
      goodsSpecId = e.currentTarget.dataset.specId;
    wx.showModal({
      title: "提示",
      content: "您确定要移除当前商品吗?",
      success: function(e) {
        e.confirm && App._post_form('cart/delete', {
          goods_id,
          goods_spec_id: goodsSpecId
        }, function(result) {
          if (result.code === 1) {
            _this.getCartList();
          } else {
            App.showError(result.msg);
          }
        });
      }
    });
  },

  /**
   * 购物车结算
   */
  submit: function(t) {
    wx.navigateTo({
      url: '../flow/checkout?order_type=cart'
    });
  },

  /**
   * 加法
   */
  mathadd: function(arg1, arg2) {
    return (Number(arg1) + Number(arg2)).toFixed(2);
  },

  /**
   * 减法
   */
  mathsub: function(arg1, arg2) {
    return (Number(arg1) - Number(arg2)).toFixed(2);
  },

  /**
   * 去购物
   */
  goShopping: function() {
    wx.switchTab({
      url: '../index/index',
    });
  },

})