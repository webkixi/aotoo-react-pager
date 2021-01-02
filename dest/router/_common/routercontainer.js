"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setRouterEventType = setRouterEventType;
exports.getRouterEventType = getRouterEventType;
exports.setRouterMultiPages = setRouterMultiPages;
exports.getRouterMultiPages = getRouterMultiPages;
exports.getRenderContainer = getRenderContainer;

var _ao = _interopRequireWildcard(require("../../ao2"));

var _routerpart = require("./routerpart");

var _routerpage = require("./routerpage");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var routerEventType = 'redirect';
var roruterPages = {};

function setRouterEventType(evt, ctx) {
  if (ctx) {
    ctx.routerEventType = evt;
  } else {
    routerEventType = evt;
  }
}

function getRouterEventType(ctx) {
  if (ctx) {
    return ctx.routerEventType;
  } else {
    return routerEventType;
  }
}

function setRouterMultiPages(pageInstance) {
  var id = pageInstance.id;
  roruterPages[id] = pageInstance;
}

function getRouterMultiPages(id) {
  if (id) return roruterPages[id];
  return roruterPages;
}

function getRenderContainer(opts) {
  var that = this;
  var $query = opts.$query,
      selectPageItem = opts.selectPageItem,
      selectPageContent = opts.selectPageContent;
  var containerClass = this.containerClass;

  var pageInst = _routerpage.getRenderPage.call(this, {
    $query: $query,
    selectPageItem: selectPageItem,
    selectPageContent: selectPageContent
  });

  var template = function template(state, props) {
    var PageInstance = pageInst;
    var curQuery = this.currentQuery;
    var goBack = props.goBack;
    var Page = goBack ? /*#__PURE__*/React.createElement(PageInstance.UI, {
      data: this.data,
      "page-onload-query": curQuery
    }) : /*#__PURE__*/React.createElement(PageInstance.UI, {
      "page-onload-query": curQuery
    });
    var layout = state.layout;
    var header = state.header;
    var footer = state.footer;
    var subHeader = null;
    var subFooter = null;

    if (layout === 2) {
      subHeader = header;
      subFooter = footer;
      header = null;
      footer = null;
    } // let contents = [].concat(Page).map((p, ii)=>React.cloneElement(p, {key: 'page_'+ii}))


    var contents = [].concat(Page).map(function (p, ii) {
      return p;
    });
    var routerItems = ui_list({
      $$id: this.uniqId + '_router_items',
      data: contents,
      header: subHeader,
      footer: subFooter,
      itemClass: 'router-item',
      listClass: 'router-page' // didUpdate(){
      //   let runtimePageItem = that.selectPageItem.runtime
      //   let success = runtimePageItem.param && runtimePageItem.param.success
      //   let $data = this.getData().data
      //   if ($data.length) {
      //     success && lib.isFunction(success) && success()
      //   }
      // }
      // // type: 'expose'

    });
    this.routerItems = routerItems;
    var body = routerItems.render();
    return /*#__PURE__*/React.createElement(_routerpart.RouterContainer, {
      containerClass: containerClass,
      header: header,
      footer: footer,
      menus: state.menus,
      content: body,
      myref: this.ref
    });
  };

  var containerConfig = {
    data: {
      $$id: this.uniqId + '_container',
      layout: this.layout,
      header: this.header,
      footer: this.footer,
      menus: this.menus,
      attachContent: [],
      contents: [opts]
    },
    currentQuery: $query,
    onReady: function onReady() {
      that.hasMounted = true;

      if (_ao.lib.isFunction(that.config.onReady)) {
        that.config.onReady.call(that);
      }
    },
    resetItems: function resetItems(param) {
      this.routerItems.reset([param]);
    },
    detached: function detached() {
      that.hasMounted = false;
      that.hooks.fire('__unload');
    },
    push: function push(param) {
      var routerItems = this.routerItems;
      routerItems.append(param, function () {
        var len = routerItems.length();
        var index = len - 1;
        routerItems.select(index);
      });
    },
    pull: function pull(goback) {
      var lastOne = that.history[that.history.length - 1];
      var navPages = lastOne.navPages || [];
      var lastPage = navPages[navPages.length - 1] || lastOne; // let lastPage = navPages[(navPages.length-1)]

      var pageId = lastPage.id;
      var inst = getRouterMultiPages(pageId);
      this.routerItems.pop(function () {
        if (_ao.lib.isFunction(goback)) goback(lastPage);

        if (inst) {
          setTimeout(function () {
            inst.onShow && inst.onShow();
          }, 50);
        }
      });
    }
  };
  var ContainerInstance = null;
  var item = this.history[this.history.length - 1];

  if (this.ContainerInstance && this.ContainerInstance.multipage) {
    var container = item.ContainerInstance;
    var detached = pageInst.detached;

    pageInst.detached = function () {
      setTimeout(function () {
        return roruterPages[pageInst.id] = null;
      }, 50);
      detached.call(this);
    };

    setRouterMultiPages(pageInst);
    container.push( /*#__PURE__*/React.createElement(pageInst.UI, {
      "page-onload-query": $query
    }));
  } else {
    if (this.ContainerInstance) {
      this.ContainerInstance.multipage = false;
      this.ContainerInstance.resetItems( /*#__PURE__*/React.createElement(pageInst.UI, {
        "page-onload-query": $query
      }));
    } else {
      // ContainerInstance = createComponet(containerConfig, template, true)
      ContainerInstance = (0, _ao.default)(containerConfig, template);
    } // ContainerInstance = createComponet(containerConfig, template)

  }

  return ContainerInstance;
}