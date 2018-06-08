let App = getApp();

Page({
  data: {
    list: [],
    default_id: null,
  },

  onShow: function () {
    // 获取收货地址列表
    this.getAddressList();
  },

  /**
   * 获取收货地址列表
   */
  getAddressList: function () {
    let _this = this;

    App._get('address/lists', {}, function (result) {
      if (result.code === 1) {
        console.log(result.data);
        _this.setData(result.data);
      } else {
        App.showError(result.msg);
      }
    });
  },

  /**
   * 添加新地址
   */
  createAddress: function () {
    wx.navigateTo({ url: './create' });
  },

  /**
   * 编辑地址
   */
  editAddress: function (e) {
    wx.navigateTo({
      url: "./detail?address_id=" + e.currentTarget.dataset.id
    });
  },

  /**
   * 移除收货地址
   */
  removeAddress: function (e) {
    let _this = this,
      address_id = e.currentTarget.dataset.id;
    wx.showModal({
      title: "提示",
      content: "您确定要移除当前收货地址吗?",
      success: function (t) {
        App._post_form('address/delete', { address_id }, function (result) {
          if (result.code === 1) {
            _this.getAddressList();
          } else {
            App.showError(result.msg);
          }
        });
      }
    });
  },

  /**
   * 设置为默认地址
   */
  setDefault: function (e) {
    let _this = this,
      address_id = e.detail.value;
    App._post_form('address/setDefault', { address_id }, function (result) {
      if (result.code === 1) {
        // _this.getAddressList();
      } else {
        App.showError(result.msg);
      }
    });

    return false;

    // let a = this, s = t.detail.value, n = wx.getStorageSync("token");
    // wx.request({
    //   url: App.apiUrl("ecapi.consignee.setDefault"),
    //   method: "POST",
    //   header: {
    //     "X-ECTouch-Authorization": n
    //   },
    //   data: {
    //     consignee: s
    //   },
    //   success: function () {
    //     wx.showToast({
    //       title: "设置成功",
    //       success: function () {
    //         let e = wx.getStorageSync("pageOptions");
    //         a.onLoad(e), e.from, wx.navigateBack({
    //           delta: 1
    //         });
    //       }
    //     });
    //   }
    // });
  },

});
