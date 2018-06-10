let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_list: [],    // 商品列表
    order_total_num: 0,
    order_total_price: 0,
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
    this.getCartList();
  },

  /**
   * 获取购物车列表
   */
  getCartList: function () {
    let _this = this;
    App._get('cart/lists', {}, function (result) {
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
  addCount: function (e) {
    let index = e.currentTarget.dataset.index
      , goods = this.data.goods_list[index]
      , order_total_price = this.data.order_total_price;
    // 后端同步更新
    App._post_form('cart/add', {
      goods_id: goods.goods_id,
      goods_num: 1
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
  minusCount: function (e) {
    let index = e.currentTarget.dataset.index
      , goods = this.data.goods_list[index]
      , order_total_price = this.data.order_total_price;

    if (goods.total_num > 1) {
      // 后端同步更新
      App._post_form('cart/sub', { goods_id: goods.goods_id });
      goods.total_num--;
      this.setData({
        ['goods_list[' + index + ']']: goods,
        order_total_price: this.mathsub(order_total_price, goods.goods_price)
      });
    }
  },

  /**
   * 加法
   */
  mathadd: function (a, b) {
    return (((parseFloat(a) * 100) + (parseFloat(b) * 100)) / 100).toFixed(2);
  },

  /**
   * 减法
   */
  mathsub: function (a, b) {
    return (((parseFloat(a) * 100) - (parseFloat(b) * 100)) / 100).toFixed(2);
  },

})