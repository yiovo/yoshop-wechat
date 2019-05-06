let App = getApp();

Page({
  data: {
    searchColor: "rgba(0,0,0,0.4)",
    searchSize: "15",
    searchName: "搜索商品",

    scrollHeight: null,
    showView: false,
    arrange: "",

    sortType: 'all',    // 排序类型
    sortPrice: false,   // 价格从低到高

    option: {},
    list: {},

    noList: true,
    no_more: false,

    page: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    let _this = this;

    // 设置商品列表高度
    _this.setListHeight();

    // 记录option
    _this.setData({ option}, function () {
      // 获取商品列表
      _this.getGoodsList(true);
    });

  },

  /**
   * 获取商品列表
   */
  getGoodsList: function (is_super, page) {
    let _this = this;
    App._get('goods/lists', {
      page: page || 1,
      sortType: _this.data.sortType,
      sortPrice: _this.data.sortPrice ? 1: 0,
      category_id: _this.data.option.category_id || 0,
      search: _this.data.option.search || '',
    }, function (result) {
        let resultList = result.data.list
          , dataList = _this.data.list;
        if (is_super === true || typeof dataList.data === 'undefined') {
          // typeof dataList.data === 'undefined'
          _this.setData({ list: resultList, noList: false });
        } else {
          _this.setData({ 'list.data': dataList.data.concat(resultList.data) });
        }
    });
  },

  /**
   * 设置商品列表高度
   */
  setListHeight: function () {
    let _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          scrollHeight: res.windowHeight - 90,
        });
      }
    });
  },

  /**
   * 切换排序方式
   */
  switchSortType: function (e) {
    let _this = this
      , newSortType = e.currentTarget.dataset.type
      , newSortPrice = newSortType === 'price' ? !_this.data.sortPrice : true;

    _this.setData({
      list: {},
      page: 1,
      sortType: newSortType,
      sortPrice: newSortPrice
    }, function () {
      // 获取商品列表
      _this.getGoodsList(true);
    });
  },

  /**
   * 跳转筛选
   */
  toSynthesize: function (t) {
    wx.navigateTo({
      url: "../category/screen?objectId="
    });
  },

  /**
   * 切换列表显示方式
   */
  onChangeShowState: function () {
    let _this = this;
    _this.setData({
      showView: !_this.data.showView,
      arrange: _this.data.arrange ? "" : "arrange"
    });
  },

  /**
   * 下拉到底加载数据
   */
  bindDownLoad: function () {
    // 已经是最后一页
    if (this.data.page >= this.data.list.last_page) {
      this.setData({ no_more: true });
      return false;
    }
    this.getGoodsList(false, ++this.data.page);
  },

  /**
   * 设置分享内容
   */
  onShareAppMessage: function () {
    return {
      title: "全部分类",
      desc: "",
      path: "/pages/category/index"
    };
  },

});
