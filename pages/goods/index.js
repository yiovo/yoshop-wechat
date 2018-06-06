let App = getApp()
  , wxParse = require("../../wxParse/wxParse.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav_select: false,    // 快捷导航

    // banner轮播组件属性
    indicatorDots: true,  // 是否显示面板指示点	
    autoplay: true,       // 是否自动切换
    interval: 3000,       // 自动切换时间间隔
    duration: 800,        // 滑动动画时长

    currentIndex: 1,    // 轮播图指针
    floorstatus: false, // 返回顶部
    goods_num: 1,       // 商品数量
    showView: true,     // 显示商品规格
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.data.goods_id = options.objectId;
    _this.getGoodsDetail(options.objectId);
  },

  /**
   * 获取商品信息
   */
  getGoodsDetail: function (goods_id) {
    let _this = this;
    App._get('goods/detail', { goods_id: 10072 }, function (result) {
      if (result.code === 1) {
        wxParse.wxParse("content", "html", result.data.detail.content, _this, 0)
        _this.setData({
          detail: result.data.detail,
        });
      } else {
        App.showError(result.msg);
      }
    });
  },

  /**
   * 设置轮播图当前指针 数字
   */
  setCurrent: function (e) {
    this.setData({
      currentIndex: e.detail.current + 1
    });
  },


  /**
   * 控制商品规格/数量的显示隐藏
   */
  onChangeShowState: function () {
    let t = this;
    t.setData({
      showView: !t.data.showView
    });
  },

  /**
   * 返回顶部
   */
  goTop: function (t) {
    this.setData({
      scrollTop: 0
    });
  },

  /**
   * 显示/隐藏 返回顶部按钮
   */
  scroll: function (e) {
    this.setData({ floorstatus: e.detail.scrollTop > 200 })
  },

  /**
   * 增加商品数量
   */
  up: function () {
    this.setData({
      goods_num: ++this.data.goods_num
    })
  },

  /**
   * 减少商品数量
   */
  down: function () {
    if (this.data.goods_num > 1) {
      this.setData({
        goods_num: --this.data.goods_num
      });
    }
  },

  /**
   * 跳转购物车页面
   */
  flowCart: function () {
    wx.switchTab({
      url: "../flow/index"
    });
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
   * 加入购物车and立即购买
   */
  submit: function (e) {
    let _this = this
      , submitType = e.currentTarget.dataset.type;

    if (submitType === 'bugNow') {
      wx.redirectTo({
        url: '../flow/checkout?' + App.urlEncode({
          goods_id: _this.data.goods_id,
          goods_num: _this.data.goods_num
        })
      });
    } else if (submitType === 'addCart') {
      console.log('addCart');
    }
    /////////////
  },


})