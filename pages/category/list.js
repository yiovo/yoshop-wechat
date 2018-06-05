let App = getApp();

Page({
  data: {
    searchColor: "rgba(0,0,0,0.4)",
    searchSize: "15",
    searchName: "搜索商品",

    scrollHeight: null,
    showView: false,
    arrange: "",

    sortType: 'all',
    sortPrice: true,

    list: [],
  },

  onLoad: function () {
    let _this = this;

    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          scrollHeight: res.windowHeight - 90,
        });
      }
    })

    // 获取分类列表
    this.getGoodsList();
  },

  /**
   * 获取分类列表
   */
  getGoodsList: function () {
    let _this = this;
    App._get('goods/lists', {}, function (result) {
      if (result.code === 1) {
        _this.setData({
          list: result.data.list,
        });
      } else {
        App.showError(result.msg);
      }
    });
  },

  /**
   * 选中分类
   */
  selectNav: function (t) {
    let curNav = t.target.dataset.id
      , curIndex = parseInt(t.target.dataset.index);
    this.setData({
      curNav,
      curIndex,
      scrollTop: 0
    });
  },

  /**
   * 切换排序方式
   */
  switchSortType: function (e) {
    let _this = this;
    let sortType = e.currentTarget.dataset.type;
    this.setData({
      sortType,
      sortPrice: sortType === 'price' ? !this.data.sortPrice : true
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

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
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
