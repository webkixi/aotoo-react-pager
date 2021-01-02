"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRenderPage = getRenderPage;

var _ao = require("../../ao2");

var _page = _interopRequireWildcard(require("../../page"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var fakePager = require('./fakepager').default(_page.default);

function getRenderPage(_ref) {
  var $query = _ref.$query,
      selectPageItem = _ref.selectPageItem,
      selectPageContent = _ref.selectPageContent;
  var that = this;
  var pageInst = null;
  selectPageContent = selectPageContent;
  selectPageItem = selectPageItem;

  if (_ao.lib.isFunction(selectPageContent)) {
    selectPageContent = selectPageContent(fakePager);
  }

  if (React.isValidElement(selectPageContent)) {
    selectPageContent = {
      children: selectPageContent,
      data: {}
    };
  }

  if (_ao.lib.isPlainObject(selectPageContent)) {
    // selectPageContent.__key = selectPageItem.id
    pageInst = (0, _page.page)(selectPageContent); // Page为page的实例

    var oldReady = pageInst.onReady;

    pageInst.onReady = function () {
      that.onPageReady(this);

      if (_ao.lib.isFunction(oldReady)) {
        oldReady.call(this);
      }
    };

    pageInst.id = selectPageItem.id;
  }

  return pageInst;
}