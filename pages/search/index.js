let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recentSearch: [],
    searchValue: '',
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
    // 获取历史搜索
    this.getRecentSearch();
  },

  /**
   * 获取历史搜索
   */
  getRecentSearch: function () {
    let recentSearch = wx.getStorageSync('recentSearch');
    this.setData({ recentSearch });
  },

  /**
   * 绑定输入值
   */
  getSearchContent: function (e) {
    this.data.searchValue = e.detail.value;
  },

  /**
   * 搜索提交
   */
  search: function () {
    if (this.data.searchValue) {
      // 记录最近搜索
      let recentSearch = wx.getStorageSync('recentSearch') || [];
      recentSearch.unshift(this.data.searchValue);
      wx.setStorageSync('recentSearch', recentSearch)
      // 跳转到商品列表页
      wx.navigateTo({
        url: '../category/list?search=' + this.data.searchValue,
      })
    }
  },

  /**
   * 清空最近搜索记录
   */
  clearSearch: function () {
    wx.removeStorageSync('recentSearch');
    this.getRecentSearch();
  },

  /**
   * 跳转到最近搜索
   */
  goSearch: function (e) {
    wx.navigateTo({
      url: '../category/list?search=' + e.target.dataset.text,
    })
  },

})