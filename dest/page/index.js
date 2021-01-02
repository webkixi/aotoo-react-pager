"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.page = page;
exports.default = Pager;

var _ao = _interopRequireWildcard(require("../ao2"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

Pager.lib = _ao.lib;

Pager.$$ = function (id) {
  return _ao._elements.getElement(id);
};
/**
 * [
 *   {url: '', id: '', content: function(Pager){return Pager({...})}}  
 * ]
 */
// 根路由实例


var rootRouterInstance = null; // 当前路由实例

var curRouterInstance = null;
var pagesPath = [];
Pager.nav = {
  reLaunch: function reLaunch(param) {
    var url = param.url;
    var pageItem = findPage(url, param);

    if (pageItem) {
      var routerContext = pageItem.routerContext;
      curRouterInstance = routerContext;
      routerContext.reLaunch(param);
    }
  },
  navigateTo: function navigateTo(param) {
    var url = param.url;
    var pageItem = findPage(url, param);

    if (pageItem) {
      var routerContext = pageItem.routerContext;
      curRouterInstance = routerContext;
      routerContext.navigateTo(param);
    }
  },
  navigateBack: function navigateBack() {
    if (_ao.lib.isClient()) {
      window.history.go(-1);
    }
  },
  redirectTo: function redirectTo(param) {
    var url = param.url;
    var pageItem = findPage(url, param);

    if (pageItem) {
      var routerContext = pageItem.routerContext;
      curRouterInstance = routerContext;
      routerContext.redirectTo(param);
    }
  },
  redirectBack: function redirectBack(param) {
    if (_ao.lib.isClient()) {
      window.history.go(-1);
    }
  }
};

Pager.getAllPages = function () {
  return pagesPath;
};

Pager.pages = function () {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var isrootRouter = true;

  if (this.name === 'Pager') {
    pagesPath = [];
  } else {
    isrootRouter = false;
  }

  if (params.length) {
    var Router = require('../router').default; // 必须在此引入，否则Pager的附加方法不能传递给fakePager


    var router = Router(params, options, collectAllPagesPath); // containerInstance 卸载时执行

    _ao.lib.isClient() && router.hooks.once('__unload', function () {
      if (options.unLoad && _ao.lib.isFunction(options.unLoad)) {
        options.unLoad();
      }
    });

    if (!isrootRouter) {
      router.__ancestorRouter = rootRouterInstance; // 路由的根路由

      router.__parentRouter = curRouterInstance; // 子路由的父级路由
    } else {
      rootRouterInstance = router;
    }

    collectAllPagesPath(router.pages); //搜集所有路由的页面数据

    if (_ao.lib.isNode()) {
      return router.redirectTo({
        url: options.select
      });
    }

    return router;
  }
};

Pager.getRouter = function () {
  return curRouterInstance;
};

Pager.getRootRouter = function () {
  return rootRouterInstance;
};

function findPageIndex(select) {
  return pagesPath.findIndex(function (pg, ii) {
    return ii === select || pg.id === select || pg.url === select;
  }) || 0;
}

function findPage(select) {
  var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (!select) return;
  var thePage = null;
  var ary = select.split('?');
  select = ary[0].split('#')[0];
  var index = findPageIndex.call(this, select || 0);

  if (index > -1) {
    thePage = pagesPath[index];

    if (param.success && _ao.lib.isFunction(param.success)) {
      thePage = param.success(thePage) || thePage;
    }
  } else {
    if (param.fail && _ao.lib.isFunction(param.fail)) {
      thePage = param.fail();
    } else {
      var idx = findPageIndex.call(this, '404');
      if (idx > -1) thePage = pagesPath[idx];
    }
  }

  if (param.complete && _ao.lib.isFunction(param.complete)) {
    thePage = param.complete();
  }

  return thePage;
}

function deletePagePath(select) {
  if (!select && select !== 0) return;
  var ary = select.split('?');
  select = ary[0].split('#')[0];
  var indexPos = -1;
  pagesPath.forEach(function (item, ii) {
    if (item.id === select || item.url === select) {
      indexPos = ii;
    }
  });

  if (indexPos > -1) {
    pagesPath.splice(indexPos, 1);
  }
} // 收集所有router实例的路由项信息


function collectAllPagesPath(pages) {
  var thePages = pages;
  thePages.forEach(function (item) {
    deletePagePath(item.url);
  });
  pagesPath = pagesPath.concat(pages);
}

var SPLITPROPS = true;

function page() {
  var param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (!param.data) {
    param.data = {};
  }

  param.$$is = 'page';
  var childrenTemplate = param.template || param.children || null;

  var template = function template(state, props) {
    var childTemp = childrenTemplate;

    if (_ao.lib.isFunction(childrenTemplate)) {
      childTemp = childrenTemplate.call(this, state, props);
    }

    return /*#__PURE__*/React.createElement("div", {
      className: 'page ' + (state.pageClass || props.pageClass || '')
    }, _ao.lib.isFunction(childTemp.then) ? /*#__PURE__*/React.createElement(_ao.ReturnPromiseComponent, {
      content: childTemp
    }) : childTemp);
  };

  param.created = function () {
    var _this = this;

    _ao.lib.forEach(this.data, function (item, ii, ky) {
      if (_ao.lib.isPlainObject(item)) {
        item.fromComponent = _this.data.fromComponent;
        item.__fromParent = _this.data.__fromParent;
        _this.data[ky] = item;
      }
    });
  };
  /** 创建page实例 */


  var instance = (0, _ao.default)(param, template, SPLITPROPS);

  instance.onLoad = function (query) {
    if (_ao.lib.isFunction(this.config.onLoad)) {
      this.config.onLoad.call(this, query);
    }
  };

  instance.onShow = function () {
    if (_ao.lib.isFunction(this.config.onShow)) {
      this.config.onShow.call(this);
    }
  };

  instance.hooks.once('constructor-react-component', function (props) {
    var query = props['page-onload-query'];

    if (_ao.lib.isFunction(this.onLoad)) {
      this.onLoad(query);
    }

    if (_ao.lib.isFunction(this.onShow)) {
      this.onShow(); // 1、初始化时调用onShow，2、回到该页时调用(multipage模式)
    }
  });
  instance.hooks.once('onShow', function () {
    if (_ao.lib.isFunction(this.onShow)) {
      this.onShow(); // 1、初始化时调用onShow，2、回到该页时调用(multipage模式)
    }
  });
  return instance;
}

function Pager() {
  var param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var template = arguments.length > 1 ? arguments[1] : undefined;
  var temp = template || param.template || param.children;
  param.template = temp;

  if (!temp) {
    console.error('必须指定Pager的模板');
    return;
  }

  var Page = page(param); // ReactDOM.render(<Page.UI />, document.getElementById('root'))

  (0, _ao.render)( /*#__PURE__*/React.createElement(Page.UI, null), 'root');
}