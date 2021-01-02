"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.restoreRouterHistory = restoreRouterHistory;
exports.memeryHistoryStorageBack = memeryHistoryStorageBack;
exports.memeryHistory = memeryHistory;
exports.findHistoryIndex = findHistoryIndex;
exports.findHistoryItem = findHistoryItem;

var _ao = require("../../ao2");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// savehistory后，从localstorage中恢复历史记录
function restoreRouterHistory(historyStorage) {
  var _this = this;

  var MYJSX = null;
  this.history = historyStorage.map( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(item, ii) {
      var url, ourl, $query, time, multipage, navPages, selectPageItem, selectPageContent, index, res, search, _res, _renderUI$call, JSX, ContainerInstance, rootId;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              url = item.url;
              ourl = item.ourl;
              $query = item.$query;
              time = item.time;
              multipage = item.multipage;
              navPages = item.navPages;
              selectPageItem = null;
              selectPageContent = null; // let selectPageItem = item.selectPageItem
              // let selectPageContent = item.selectPageContent

              index = _this.findPageIndex.call(_this, url);
              selectPageItem = _this.pages[index];
              selectPageContent = selectPageItem.content;

              if (!_ao.lib.isPromise(selectPageContent)) {
                _context.next = 16;
                break;
              }

              _context.next = 14;
              return selectPageContent;

            case 14:
              res = _context.sent;
              selectPageContent = res.default || res;

            case 16:
              // 历史记录最后一条
              // 合并$query和页面location.search
              if (ii === historyStorage.length - 1) {
                search = location.search;

                if (search) {
                  search = 'tmp' + search;
                  _res = _ao.lib.urlTOquery(search);
                  $query = Object.assign({}, $query, _res.query);
                }
              }

              _renderUI$call = renderUI.call(_this, {
                $query: $query,
                selectPageItem: selectPageItem,
                selectPageContent: selectPageContent
              }), JSX = _renderUI$call.JSX, ContainerInstance = _renderUI$call.ContainerInstance, rootId = _renderUI$call.rootId;

              if (ContainerInstance) {
                _this.ContainerInstance = ContainerInstance;
                _this.ContainerInstance.multipage = multipage;
              }

              if (ii === historyStorage.length - 1) {
                MYJSX = JSX;
                _this.selectUrl = url;
                _this.selectIndex = index;
                _this.selectPageItem = selectPageItem;
              } // 分隔符 #


              if (_this.sep) {
                _this.hooks.emit('__pushstate', {
                  url: url,
                  ourl: ourl,
                  $query: $query,
                  title: selectPageItem.title || '',
                  id: selectPageItem.id,
                  time: time
                });

                if (navPages.length) {
                  navPages.forEach(function (state) {
                    _this.hooks.emit('__pushstate', {
                      url: state.url,
                      ourl: state.ourl,
                      $query: state['$query'],
                      title: state.title || '',
                      id: state.id,
                      time: state.time
                    });
                  });
                }
              }

              return _context.abrupt("return", {
                id: selectPageItem.id,
                index: _this.selectIndex,
                url: url,
                ourl: ourl,
                title: selectPageItem.title || '',
                ContainerInstance: ContainerInstance,
                selectPageItem: selectPageItem,
                time: time,
                multipage: multipage,
                navPages: navPages
              });

            case 22:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
  return MYJSX; // this.render(MYJSX, 'root')
  // console.log(this.history, '======= uuuu');
} // 多页历史存储
// 多页是基于单页的基础之上，叠加若干子页面


function multipageHistory(result, options) {
  var url = options.url,
      ourl = options.ourl,
      $query = options.$query;
  var selectPageContent = result.selectPageContent,
      selectPageItem = result.selectPageItem,
      rootId = result.rootId;
  var lastHisotry = this.history[this.history.length - 1];
  lastHisotry.multipage = true;
  lastHisotry.navPages = [].concat(lastHisotry.navPages || []).concat({
    id: selectPageItem.id,
    index: this.selectIndex,
    url: url,
    ourl: ourl,
    $query: $query,
    title: selectPageItem.title || '',
    selectPageItem: selectPageItem,
    time: options.time
  });
  this.history[this.history.length - 1] = lastHisotry;
  var lastHisotryStorage = this.historyStorage[this.historyStorage.length - 1];
  lastHisotryStorage.multipage = true;
  lastHisotryStorage.navPages = lastHisotry.navPages;
  this.historyStorage[this.history.length - 1] = lastHisotryStorage; // 分隔符 #

  if (this.sep) {
    this.hooks.emit('__pushstate', {
      url: url,
      ourl: ourl,
      $query: $query,
      title: selectPageItem.title || '',
      id: selectPageItem.id,
      time: options.time
    });
  }
} // 后退时historyStorage同步history


function memeryHistoryStorageBack() {
  if (this.ContainerInstance.multipage) {
    var lastOne = this.history[this.history.length - 1];
    var lastOneStorage = this.historyStorage[this.history.length - 1];
    var navPages = lastOne.navPages || [];
    var multipage = lastOne.multipage;
    lastOneStorage.multipage = multipage;
    lastOneStorage.navPages = navPages;
    this.historyStorage[this.history.length - 1] = lastOneStorage;
  } else {
    this.historyStorage.pop();
  }
} // 单页历史存储


function memeryHistory(result) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  options.time = new Date().getTime();

  if (!result.ContainerInstance && this.ContainerInstance.multipage) {
    multipageHistory.call(this, result, options);
    return;
  }

  var url = options.url,
      ourl = options.ourl,
      $query = options.$query,
      selectPageItem = options.selectPageItem,
      selectPageContent = options.selectPageContent;
  var JSX = result.JSX,
      ContainerInstance = result.ContainerInstance,
      rootId = result.rootId;
  this.history.push({
    ContainerInstance: ContainerInstance || this.ContainerInstance,
    id: selectPageItem.id,
    index: this.selectIndex,
    url: url,
    ourl: ourl,
    $query: $query,
    title: selectPageItem.title || '',
    selectPageItem: selectPageItem,
    selectPageContent: selectPageContent,
    time: options.time
  }); // 将history存储到storage，考虑到storage不能存储实例，将关键数据存储起来
  // 该数据用于重构history的container实例
  // save/restore方法将使用此数据

  this.historyStorage.push({
    id: selectPageItem.id,
    index: this.selectIndex,
    url: url,
    ourl: ourl,
    $query: $query,
    title: selectPageItem.title || '',
    selectPageItem: {
      id: selectPageItem.id,
      title: selectPageItem.title || ''
    },
    selectPageContent: result.selectPageContent,
    time: options.time
  }); // 分隔符 #

  if (this.sep) {
    this.hooks.emit('__pushstate', {
      url: url,
      ourl: ourl,
      $query: $query,
      title: selectPageItem.title || '',
      id: selectPageItem.id,
      time: options.time
    });
  }
}

function findHistoryIndex() {
  var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return _ao.lib.findIndex(this.history, query);
}

function findHistoryItem() {
  var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var history = this.history;
  var index = findHistoryIndex.call(this, query);

  if (index || index > -1) {
    return history[index];
  }
}