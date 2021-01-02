"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Router;

var _ao = _interopRequireWildcard(require("../ao2"));

var _page = _interopRequireWildcard(require("../page"));

var _md = _interopRequireDefault(require("md5"));

var _routercontainer = require("./_common/routercontainer");

var _routerhistory = require("./_common/routerhistory");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ROUTERHOOKS = _ao.lib.hooks('router-hooks');

var ROUTERSTOREHOOKS = _ao.lib.hooks('router-store-hooks', true);

var Loading = _ao.ReturnPromiseComponent;

if (_ao.lib.isClient()) {
  require('./_common/popstate').default(ROUTERHOOKS);
} // 是否为嵌套路由
// 在路由页面中调用路由


function isChildRouter(params) {
  var pagesPath = _page.default.getAllPages();

  return pagesPath.length ? true : false;
}

function genarateRouterUniqId() {
  var pages = this.pages;
  var urlstr = pages.reduce(function (p, n) {
    var url = n.url;
    return p + url;
  }, '');
  return (0, _md.default)(urlstr);
}

function genarateReallyPages(params) {
  var _this = this;

  var config = this.config;
  return params.map(function (pageItem, ii) {
    var pageConfig = null;
    var pageUrl = pageItem.url;
    var pageContent = pageItem.content.default || pageItem.content;
    var pageId = pageItem.id || pageUrl.replace(/[\.\/\\]/g, '');

    if (_ao.lib.isFunction(pageContent) || _ao.lib.isPromise(pageContent) || React.isValidElement(pageContent)) {
      pageConfig = pageContent;
    }

    pageItem.routerContext = _this;
    pageItem.id = pageId;
    pageItem.index = ii;
    pageItem.content = pageConfig;
    pageItem.rootId = pageItem.rootId || 'dom_' + pageId; // pageItem.query = {...}  // onLoad接收参数

    return pageItem;
  });
} // 路由容器UI


function renderUI(_ref) {
  var $query = _ref.$query,
      selectPageItem = _ref.selectPageItem,
      selectPageContent = _ref.selectPageContent;

  var ContainerInstance = _routercontainer.getRenderContainer.call(this, {
    $query: $query,
    selectPageItem: selectPageItem,
    selectPageContent: selectPageContent
  }); // navigateTo 导航返回值
  // 多页


  if (!ContainerInstance) {
    return {
      selectPageContent: selectPageContent,
      selectPageItem: selectPageItem,
      rootId: 'root'
    };
  } // redirectTo 导航返回值


  var JSX = /*#__PURE__*/React.createElement(ContainerInstance.UI, null);
  return {
    JSX: JSX,
    ContainerInstance: ContainerInstance,
    selectPageContent: selectPageContent,
    selectPageItem: selectPageItem,
    rootId: 'root'
  };
}

var Route = /*#__PURE__*/function () {
  function Route(config) {
    _classCallCheck(this, Route);

    this.history = [];
    this.historyStorage = [];
    var that = this;

    var oriConfig = _ao.lib.cloneDeep(config);

    this.config = config;
    this.config.root = this.config.root || 'root';
    this.oriConfig = oriConfig;
    this.oriPages = oriConfig.pages;
    this.pages = genarateReallyPages.call(this, config.pages); // this.uniqId = lib.uniqueId('route_')

    this.uniqId = genarateRouterUniqId.call(this);
    this.hooks = _ao.lib.hooks(this.uniqId);
    this.sep = config.sep || '#'; // 默认路由分隔符

    this.maxAge = config.maxAge || 2 * 60 * 1000; // 默认路由存储localStorage最大时长

    this.isChildRouter = isChildRouter(); // 窗口路由，Pager.pages子页面使用Pager.pages生成的窗口路由

    if (this.isChildRouter) {
      this.sep = ''; // 窗口路由不走window.history接口
    }

    this.containerClass = config.containerClass || config.routerClass || '';
    this.ContainerInstance = null; // 当前路由实例

    this.history = [];
    this.historyStorage = [];
    this.hasMounted = false;
    this.header = config.header;
    this.footer = config.footer;
    this.menus = config.menus;
    this.layout = config.layout || 1;
    var _select = config.select;

    if (_ao.lib.isNumber(_select)) {
      var pageItem = this.pages[_select];
      _select = pageItem.url;
    }

    if (_ao.lib.isString(_select)) {
      var _lib$urlTOquery = _ao.lib.urlTOquery(_select),
          url = _lib$urlTOquery.url,
          query = _lib$urlTOquery.query,
          hasQuery = _lib$urlTOquery.hasQuery; // _select = url


      this.selectPageItemConfigQuery = query; // 从浏览器地址栏传递过来的数据
    }

    var historyList = this.restoreHistory();
    this.routerPrepare(); // this.select = _select

    this.UI = function () {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var dft = {
        loadingClass: 'router-loading',
        content: function () {
          return new Promise(function (resolve, reject) {
            that.hasMounted = true;
            that.hooks.once('render-ui', function (param) {
              resolve(param.JSX);
            });
          });
        }()
      };
      var target = Object.assign({}, dft, props);
      return /*#__PURE__*/React.createElement(Loading, target);
    };

    if (_ao.lib.isClient()) {
      if (historyList) {
        var JSX = _routerhistory.restoreRouterHistory.call(this, historyList);

        this.render(JSX, this.config.root);
      } else {
        this.redirectTo({
          url: _select
        });
      }
    }
  }

  _createClass(Route, [{
    key: "getCurrentPages",
    value: function getCurrentPages() {
      return this.selectPageItem;
    }
  }, {
    key: "findPageIndex",
    value: function findPageIndex(select) {
      return this.pages.findIndex(function (pg, ii) {
        return ii === select || pg.id === select || pg.url === select;
      }) || 0;
    }
  }, {
    key: "switchSelect",
    value: function switchSelect(select, ourl) {
      this.selectUrl = select || this.select;
      this.selectOurl = ourl;
      this.selectIndex = this.findPageIndex(select || this.select);
      this.selectPageItem = this.pages[this.selectIndex];
    }
  }, {
    key: "routerPrepare",
    value: function routerPrepare() {
      var _this2 = this;

      var that = this;

      function getHistoryItem(time) {
        var index = _routerhistory.findHistoryIndex.call(that, {
          time: time
        });

        var historyIndex = index - 1; // 取上一个

        return _routerhistory.findHistoryItem.call(that, historyIndex);
      }

      function setPopstateTime(time) {
        var historyItem = getHistoryItem(time);
        that.popstateTime = historyItem && historyItem.time || that.popstateTime || 0;
      }

      if (_ao.lib.isClient()) {
        this.popstateTime = 0;
        ROUTERHOOKS.once('__goback', function (e) {
          if (e.state) {
            // let id = e.state.id
            // let curId = this.selectPageItem.id
            if (_this2.popstateTime === 0) {
              setPopstateTime(e.state.time);

              _this2._redirectBack();
            } else {
              if (e.state.time >= _this2.popstateTime) {// this.popstateTime = e.state.time  // 前进
              } else {
                setPopstateTime(e.state.time);

                _this2._redirectBack();
              }
            }
          } else {
            window.history.go(-1);
          }
        });
        this.hooks.once('__pushstate', function (param) {
          if (_ao.lib.isClient()) {
            var query = param.$query;
            var url = param.url;
            var ourl = param.ourl;
            var title = param.title;

            if (_this2.sep) {
              if (_this2.sep === '#') {
                var hash = location.hash;
                if (hash === url) return;
              }

              url = _this2.sep + ourl;
              window.history.pushState(param, title, url);
            } // window.history.replaceState(param, title, url)

          }
        });
      }

      function _redirectBack(opts) {
        if (this.ContainerInstance.multipage) {
          var lastOne = this.history[this.history.length - 1];
          var navPages = lastOne.navPages || [];

          if (navPages.length) {
            var curContainer = lastOne.ContainerInstance;
            var curPage = navPages.pop();

            if (navPages.length) {
              var lastPage = navPages[navPages.length - 1];
              this.switchSelect(lastPage.url, lastPage.ourl);
            } else {
              this.switchSelect(lastOne.url, lastOne.ourl);
            }

            lastOne.multipage = navPages.length ? true : false;
            lastOne.navPages = navPages;
            this.history[this.history.length - 1] = lastOne;
            curContainer.pull(this.config.goback);
          } else {
            this.ContainerInstance.multipage = false;

            _redirectBack.call(this);

            return;
          }
        } else {
          var prevPage = this.history[this.history.length - 2];

          if (prevPage) {
            var _curPage = this.history.pop();

            this.switchSelect(prevPage.url, prevPage.ourl);
            var options = {
              url: prevPage.url,
              $query: prevPage.$query,
              selectPageItem: prevPage.selectPageItem,
              selectPageContent: prevPage.selectPageContent
            }; // if (prevPage.multipage && prevPage.navPages && prevPage.navPages.length) {
            //   this.ContainerInstance.multipage = true
            // } else {
            //   this.ContainerInstance.multipage = false
            // }

            renderUI.call(this, options);
            var goback = this.config.goback; // 后退后

            if (_ao.lib.isFunction(goback)) {
              goback(prevPage);
            } // let curPage = this.history.pop()
            // this.switchSelect(prevPage.url)
            // let ContainerInstance = prevPage.ContainerInstance
            // this.ContainerInstance = ContainerInstance
            // let JSX = <ContainerInstance.UI goBack={true} />
            // this.render(JSX, 'root')
            // curPage.ContainerInstance.destory()

          } else {
            var parentRouter = this.__parentRouter;

            if (parentRouter) {
              parentRouter.routerPrepare();

              parentRouter._redirectBack();
            }
          }
        }

        _routerhistory.memeryHistoryStorageBack.call(this);
      }

      function _onPageReady(pageInst) {
        // 实时同步pageInstance的state数据
        // 在restore时保证数据为最新数据
        var that = this;
        var syncTimmer = null;
        pageInst.hooks.once('sync-state-data', function (data) {
          clearTimeout(syncTimmer);
          syncTimmer = setTimeout(function () {
            var historyStorage = that.historyStorage;
            var lastHistoryStorageItem = historyStorage[historyStorage.length - 1];
            lastHistoryStorageItem.selectPageContent.data = data;
            historyStorage[historyStorage.length - 1] = lastHistoryStorageItem;
          }, 200);
        });
      }

      Object.defineProperty(this, "_redirectBack", _ao.lib.protectProperty(_redirectBack.bind(this)));
      Object.defineProperty(this, "onPageReady", _ao.lib.protectProperty(_onPageReady.bind(this)));
    }
  }, {
    key: "clearHistory",
    value: function clearHistory() {
      this.history = [];
      ROUTERSTOREHOOKS.removeItem('router-history-data');
    }
  }, {
    key: "saveHistory",
    value: function saveHistory() {
      if (_ao.lib.isClient()) {
        // 只将历史数据存储2分钟
        // 基于使用场景(两个不同子域名的站之间访问)，一般都是快速交换数据，此时间间隔应该很短促
        // 超时将不予恢复
        ROUTERSTOREHOOKS.setItem('router-history-data', this.historyStorage, this.maxAge);
      }
    }
  }, {
    key: "restoreHistory",
    value: function restoreHistory() {
      if (_ao.lib.isClient()) {
        var historyStorage = ROUTERSTOREHOOKS.getItem('router-history-data');

        if (historyStorage) {
          return historyStorage;
        }
      }
    }
  }, {
    key: "reLaunch",
    value: function reLaunch(param) {
      (0, _routercontainer.setRouterEventType)('reLaunch', this);
      this.clearHistory();
      this.redirectTo(param);
    }
  }, {
    key: "navigateTo",
    value: function () {
      var _navigateTo = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(param) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                (0, _routercontainer.setRouterEventType)('navigate', this);
                this.ContainerInstance.multipage = true;
                this.redirectTo(param, true);

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function navigateTo(_x) {
        return _navigateTo.apply(this, arguments);
      }

      return navigateTo;
    }()
  }, {
    key: "navigateBack",
    value: function navigateBack() {
      (0, _routercontainer.setRouterEventType)('navigateBack', this);
      this.ContainerInstance.multipage = true;
      this.redirectBack(null, true);
    }
    /**
     * 
     * 跳转页面
     * @param {Object} param 参考小程序，未实现success，faile，event
     * 当页面跳转完成，将当前页数据推送至history变量
     * 是否推送至window.history，取决于this.sep
     */

  }, {
    key: "redirectTo",
    value: function () {
      var _redirectTo = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var param,
            delegate,
            that,
            url,
            success,
            fail,
            complete,
            events,
            beforeNav,
            res,
            $hasQuery,
            $url,
            $query,
            from,
            selectPageItem,
            selectPageContent,
            selectPageItemQuery,
            options,
            result,
            _res,
            next,
            navto,
            _args2 = arguments;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                navto = function _navto(opts) {
                  options = Object.assign({}, options, opts);
                  result = renderUI.call(that, options);
                  var _result = result,
                      JSX = _result.JSX,
                      ContainerInstance = _result.ContainerInstance; // 路由初始化
                  // 路由初始化时没有ContainerInstance

                  if (ContainerInstance) {
                    that.ContainerInstance = ContainerInstance;
                    that.ContainerInstance.multipage = false;
                  } // 清空从浏览器传过来的query数据


                  that.selectPageItemConfigQuery = {}; // history存储

                  var evtType = (0, _routercontainer.getRouterEventType)(that);

                  if (that.isChildRouter) {
                    if (evtType === 'navigate') {
                      _routerhistory.memeryHistory.call(that, result, options);
                    }
                  } else {
                    _routerhistory.memeryHistory.call(that, result, options);
                  } // multipage为true时 不会返回JSX


                  if (JSX) {
                    if (!that.isChildRouter) {
                      return that.render(JSX, that.config.root);
                    } else {
                      var render_ui = function render_ui() {
                        if (that.hasMounted) {
                          that.hooks.fire('render-ui', {
                            JSX: JSX
                          });
                        } else {
                          setTimeout('render_ui', 50);
                        }
                      };

                      render_ui();
                    }
                  }
                };

                next = function _next2(opts) {
                  return navto(opts);
                };

                param = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {};
                delegate = _args2.length > 1 ? _args2[1] : undefined;

                if (!delegate) {
                  (0, _routercontainer.setRouterEventType)('redirect', this);
                  this.ContainerInstance && (this.ContainerInstance.multipage = false);
                }

                that = this;
                url = param.url;
                success = param.success;
                fail = param.fail;
                complete = param.complete;
                events = param.events;
                beforeNav = param.beforeNav || param.beforenav || this.config.beforeNav || this.config.beforenav; // 路由前

                res = _ao.lib.urlTOquery(url);
                $hasQuery = res.hasQuery;
                $url = res.url;
                $query = $hasQuery ? res.query : {};
                from = this.selectPageItem || {}; // 相同路由地址+多开路由 不跳转
                // if ((this.ContainerInstance && this.ContainerInstance.multipage === true) &&
                // ($url === this.selectUrl || url === this.selectUrl)) {
                //   return
                // }
                // if ((this.ContainerInstance && !this.ContainerInstance.multipage) && 
                // ($url === this.selectUrl || url === this.selectUrl)) {
                //   return 
                // }

                if (!($url === this.selectUrl && url === this.selectOurl)) {
                  _context2.next = 19;
                  break;
                }

                return _context2.abrupt("return");

              case 19:
                this.switchSelect($url, url);
                this.selectPageItem.runtime = {
                  param: param,
                  query: $query
                };
                selectPageItem = this.selectPageItem;
                selectPageContent = selectPageItem.content;
                selectPageItemQuery = selectPageItem.query || {};

                if (selectPageContent) {
                  _context2.next = 27;
                  break;
                }

                console.error('请正确指定page页内容!');
                return _context2.abrupt("return");

              case 27:
                $query = Object.assign({}, selectPageItemQuery, this.selectPageItemConfigQuery, $query);
                options = {
                  url: $url,
                  ourl: url,
                  $query: $query,
                  selectPageItem: selectPageItem,
                  selectPageContent: selectPageContent
                };
                result = null;

                if (!_ao.lib.isPromise(selectPageContent)) {
                  _context2.next = 35;
                  break;
                }

                _context2.next = 33;
                return selectPageContent;

              case 33:
                _res = _context2.sent;
                options.selectPageContent = _res.default || _res;

              case 35:
                beforeNav = beforeNav || selectPageItem.beforeNav || selectPageItem.beforenav;

                if (!_ao.lib.isFunction(beforeNav)) {
                  _context2.next = 40;
                  break;
                }

                return _context2.abrupt("return", beforeNav(options, from, next));

              case 40:
                return _context2.abrupt("return", navto());

              case 41:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function redirectTo() {
        return _redirectTo.apply(this, arguments);
      }

      return redirectTo;
    }()
  }, {
    key: "redirectBack",
    value: function redirectBack(options, delegate) {
      if (!delegate) (0, _routercontainer.setRouterEventType)('redirectBack', this);

      if (_ao.lib.isClient() && this.sep) {
        window.history.go(-1); // 该动作将触发popstate事件
      } else {
        this._redirectBack(options);
      }
    }
  }, {
    key: "render",
    value: function render(pageJSX, rootId, cb) {
      if (this.isChildRouter) {
        var UI = this.UI;
        if (UI) return /*#__PURE__*/React.createElement(UI, null);
      }

      if (_ao.lib.isNode()) {
        return (0, _ao.render)(pageJSX);
      }

      if (_ao.lib.isClient()) {
        (0, _ao.render)(pageJSX, rootId || this.config.root, cb);
      }
    }
  }]);

  return Route;
}();

function Router() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var options = arguments.length > 1 ? arguments[1] : undefined;
  var collectAllPagesPath = arguments.length > 2 ? arguments[2] : undefined;

  var param = _objectSpread({
    pages: params
  }, options);

  return new Route(param); // let instance = new Route(param)
  // collectAllPagesPath(instance.pages) //搜集所有路由的页面数据
  // if (lib.isNode()) {
  //   return instance.redirectTo({
  //     url: options.select
  //   })
  // }
  // return instance
}