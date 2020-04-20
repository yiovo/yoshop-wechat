const App = getApp();

Page({
  data: {
    // 搜索框样式
    searchColor: "rgba(0,0,0,0.4)",
    searchSize: "15",
    searchName: "搜索商品",

    // 列表高度
    scrollHeight: 0,

    // 当前选中的分类
    curIndex: -1,
    curCateId: 0,

    // 分类列表
    categoryList: [],

    // 商品列表
    goodsList: [],

    noMore: false, // 没有更多数据
    isLoading: true, // 是否正在加载中
    page: 1, // 当前页码

  },

  onLoad() {
    let _this = this;
    // 设置分类列表高度
    _this.setListHeight();
    // 获取分类列表
    _this.getCategoryList();
  },

  onShow() {
    
  },

  /**
   * 设置分类列表高度
   */
  setListHeight() {
    let _this = this;
    wx.getSystemInfo({
      success(res) {
        _this.setData({
          scrollHeight: res.windowHeight - 47,
        });
      }
    });
  },

  /**
   * 获取分类主页数据
   * 1.所有分类列表
   * 2.所有商品列表
   */
  getCategoryList() {
    let _this = this;
    App._get('category/index', {}, result => {
      let data = result.data;
      _this.setData({
        categoryList: data['categoryList'],
        goodsList: data['goodsList']
      });
    });
  },

  /**
   * Api：获取商品列表
   */
  getGoodsList(isPage, pageNum) {
    let _this = this;
    App._get('goods/lists', {
      page: pageNum || 1,
      category_id: _this.data.curCateId
    }, result => {
      let resList = result.data.list,
        dataList = _this.data.goodsList;
      if (isPage == true) {
        _this.setData({
          'goodsList.data': dataList.data.concat(resList.data),
          isLoading: false,
        });
      } else {
        _this.setData({
          goodsList: resList,
          isLoading: false,
        });
      }
    });
  },

  /**
   * 跳转商品详情页
   */
  onTargetGoods(e) {
    wx.navigateTo({
      url: '../goods/index?goods_id=' + e.detail.target.dataset.id
    });
  },

  /** 
   * 一级分类：选中分类
   */
  onSelectNav(e) {
    let _this = this,
      curIndex = e.currentTarget.dataset.index;

    // 第一步：设置分类选中状态
    _this.setData({
      curIndex,
      curCateId: curIndex > -1 ? _this.data.categoryList[curIndex].category_id : 0,
      goodsList: [],
      page: 1,
      noMore: false,
      isLoading: true,
    });
    // 第二步：更新当前的商品列表
    _this.getGoodsList();
  },

  /**
   * 下拉到底加载数据
   */
  onDownLoad() {
    let _this = this;
    // 已经是最后一页
    if (_this.data.page >= _this.data.goodsList.last_page) {
      _this.setData({
        noMore: true
      });
      return false;
    }
    // 加载下一页列表
    _this.getGoodsList(true, ++_this.data.page);
  },

  /**
   * 设置分享内容
   */
  onShareAppMessage() {
    return {
      title: "全部商品",
      path: "/pages/category/index"
    };
  }

});