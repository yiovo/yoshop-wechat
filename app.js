/**
 * tabBar页面路径列表 (用于链接跳转时判断)
 * tabBarLinks为常量, 无需修改
 */
const tabBarLinks = [
  'pages/index/index',
  'pages/category/index',
  'pages/flow/index',
  'pages/user/index'
];

// 站点信息
import siteInfo from 'siteinfo.js';

App({

  /**
   * 全局变量
   */
  globalData: {
    user_id: null,
  },

  api_root: '', // api地址

  /**
   * 生命周期函数--监听小程序初始化
   */
  onLaunch() {
    let App = this;
    // 设置api地址
    App.setApiRoot();
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow(options) {

  },

  /**
   * 设置api地址
   */
  setApiRoot() {
    let App = this;
    App.api_root = `${siteInfo.siteroot}index.php?s=/api/`;
  },

  /**
   * 获取小程序基础信息
   */
  getWxappBase(callback) {
    let App = this;
    App._get('wxapp/base', {}, result => {
      // 记录小程序基础信息
      wx.setStorageSync('wxapp', result.data.wxapp);
      callback && callback(result.data.wxapp);
    }, false, false);
  },

  /**
   * 执行用户登录
   */
  doLogin() {
    // 保存当前页面
    let pages = getCurrentPages();
    if (pages.length) {
      let currentPage = pages[pages.length - 1];
      "pages/login/login" != currentPage.route &&
        wx.setStorageSync("currentPage", currentPage);
    }
    // 跳转授权页面
    wx.navigateTo({
      url: "/pages/login/login"
    });
  },

  /**
   * 当前用户id
   */
  getUserId() {
    return wx.getStorageSync('user_id') || 0;
  },

  /**
   * 显示成功提示框
   */
  showSuccess(msg, callback) {
    wx.showToast({
      title: msg,
      icon: 'success',
      success() {
        callback && (setTimeout(() => {
          callback();
        }, 1500));
      }
    });
  },

  /**
   * 显示失败提示框
   */
  showError(msg, callback) {
    wx.showModal({
      title: '友情提示',
      content: msg,
      showCancel: false,
      success(res) {
        // callback && (setTimeout(() => {
        //   callback();
        // }, 1500));
        callback && callback();
      }
    });
  },

  /**
   * get请求
   */
  _get(url, data, success, fail, complete, check_login) {
    let App = this;
    wx.showNavigationBarLoading();

    // 构造请求参数
    data = Object.assign({
      wxapp_id: 10001,
      token: wx.getStorageSync('token')
    }, data);

    // if (typeof check_login === 'undefined')
    //   check_login = true;

    // 构造get请求
    let request = () => {
      data.token = wx.getStorageSync('token');
      wx.request({
        url: App.api_root + url,
        header: {
          'content-type': 'application/json'
        },
        data,
        success(res) {
          if (res.statusCode !== 200 || typeof res.data !== 'object') {
            console.log(res);
            App.showError('网络请求出错');
            return false;
          }
          if (res.data.code === -1) {
            // 登录态失效, 重新登录
            wx.hideNavigationBarLoading();
            App.doLogin();
          } else if (res.data.code === 0) {
            App.showError(res.data.msg);
            return false;
          } else {
            success && success(res.data);
          }
        },
        fail(res) {
          // console.log(res);
          App.showError(res.errMsg, () => {
            fail && fail(res);
          });
        },
        complete(res) {
          wx.hideNavigationBarLoading();
          complete && complete(res);
        },
      });
    };
    // 判断是否需要验证登录
    check_login ? App.doLogin(request) : request();
  },

  /**
   * post提交
   */
  _post_form(url, data, success, fail, complete) {
    wx.showNavigationBarLoading();
    let App = this;
    // 构造请求参数
    data = Object.assign({
      wxapp_id: 10001,
      token: wx.getStorageSync('token')
    }, data);
    wx.request({
      url: App.api_root + url,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      data,
      success(res) {
        if (res.statusCode !== 200 || typeof res.data !== 'object') {
          App.showError('网络请求出错');
          return false;
        }
        if (res.data.code === -1) {
          // 登录态失效, 重新登录
          App.doLogin(() => {
            App._post_form(url, data, success, fail);
          });
          return false;
        } else if (res.data.code === 0) {
          App.showError(res.data.msg, () => {
            fail && fail(res);
          });
          return false;
        }
        success && success(res.data);
      },
      fail(res) {
        // console.log(res);
        App.showError(res.errMsg, () => {
          fail && fail(res);
        });
      },
      complete(res) {
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        complete && complete(res);
      }
    });
  },

  /**
   * 验证是否存在user_info
   */
  validateUserInfo() {
    let user_info = wx.getStorageSync('user_info');
    return !!wx.getStorageSync('user_info');
  },

  /**
   * 对象转URL
   */
  urlEncode(data) {
    var _result = [];
    for (var key in data) {
      var value = data[key];
      if (value.constructor == Array) {
        value.forEach(_value => {
          _result.push(key + "=" + _value);
        });
      } else {
        _result.push(key + '=' + value);
      }
    }
    return _result.join('&');
  },

  /**
   * 设置当前页面标题
   */
  setTitle() {
    let App = this,
      wxapp;
    if (wxapp = wx.getStorageSync('wxapp')) {
      wx.setNavigationBarTitle({
        title: wxapp.navbar.wxapp_title
      });
    } else {
      App.getWxappBase(() => {
        App.setTitle();
      });
    }
  },

  /**
   * 设置navbar标题、颜色
   */
  setNavigationBar() {
    let App = this;
    // 获取小程序基础信息
    App.getWxappBase(wxapp => {
      // 设置navbar标题、颜色
      wx.setNavigationBarColor({
        frontColor: wxapp.navbar.top_text_color.text,
        backgroundColor: wxapp.navbar.top_background_color
      })
    });
  },

  /**
   * 获取tabBar页面路径列表
   */
  getTabBarLinks() {
    return tabBarLinks;
  },

  /**
   * 验证登录
   */
  checkIsLogin() {
    return wx.getStorageSync('token') != '' && wx.getStorageSync('user_id') != '';
  },

  /**
   * 授权登录
   */
  getUserInfo(e, callback) {
    let App = this;
    if (e.detail.errMsg !== 'getUserInfo:ok') {
      return false;
    }
    wx.showLoading({
      title: "正在登录",
      mask: true
    });
    // 执行微信登录
    wx.login({
      success(res) {
        // 发送用户信息
        App._post_form('user/login', {
          code: res.code,
          user_info: e.detail.rawData,
          encrypted_data: e.detail.encryptedData,
          iv: e.detail.iv,
          signature: e.detail.signature
        }, result => {
          // 记录token user_id
          wx.setStorageSync('token', result.data.token);
          wx.setStorageSync('user_id', result.data.user_id);
          // 执行回调函数
          callback && callback();
        }, false, () => {
          wx.hideLoading();
        });
      }
    });
  },

});