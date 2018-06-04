let t = getApp();

Page({
  data: {
    searchColor: "rgba(0,0,0,0.4)",
    searchSize: "15",
    searchName: "搜索商品",
    // hidden: false,
    curNav: true,
    curIndex: 0,
    cateLeft: [],
    cateRight: []
  },
  onLoad: function () {
    let _this = this;
    wx.request({
      url: t.apiUrl("ecapi.category.all.list"),
      data: {
        id: "0",
        per_page: "5",
        category: "1",
        shop: 1,
        page: 1
      },
      method: "post",
      header: {
        "Content-Type": "application/json"
      },
      success: function (t) {
        _this.setData({
          cateLeft: t.data.left,
          cateRight: t.data.right,
          curNav: t.data.left[0].cat_id
        });
      }
    });
    // this.loadingChange();
  },
  // loadingChange: function () {
  //   let t = this;
  //   setTimeout(function () {
  //     t.setData({
  //       hidden: true
  //     });
  //   }, 1e3);
  // },

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
  }
});
