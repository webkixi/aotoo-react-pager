"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "lib", {
  enumerable: true,
  get: function get() {
    return _aotoo.lib;
  }
});
Object.defineProperty(exports, "_elements", {
  enumerable: true,
  get: function get() {
    return _aotoo._elements;
  }
});
Object.defineProperty(exports, "ReturnPromiseComponent", {
  enumerable: true,
  get: function get() {
    return _aotoo.ReturnPromiseComponent;
  }
});
Object.defineProperty(exports, "extTemplate", {
  enumerable: true,
  get: function get() {
    return _aotoo.extTemplate;
  }
});
Object.defineProperty(exports, "render", {
  enumerable: true,
  get: function get() {
    return _aotoo.render;
  }
});
Object.defineProperty(exports, "html", {
  enumerable: true,
  get: function get() {
    return _aotoo.html;
  }
});
Object.defineProperty(exports, "$$", {
  enumerable: true,
  get: function get() {
    return _aotoo.$$;
  }
});
exports.default = void 0;

var _aotoo = _interopRequireWildcard(require("@aotoo/aotoo"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var _default = _aotoo.default;
exports.default = _default;