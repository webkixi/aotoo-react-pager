"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RouterHeader = RouterHeader;
exports.RouterFooter = RouterFooter;
exports.RouterMenus = RouterMenus;
exports.RouterItem = RouterItem;
exports.RouterContainer = RouterContainer;

function RouterHeader(_ref) {
  var content = _ref.content;
  if (!content) return null;

  if (typeof content === 'function') {
    return content();
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "router-header"
  }, content);
}

function RouterFooter(_ref2) {
  var content = _ref2.content;
  if (!content) return null;

  if (typeof content === 'function') {
    return content();
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "router-footer"
  }, content);
}

function RouterMenus(_ref3) {
  var content = _ref3.content;
  if (!content) return null;

  if (typeof content === 'function') {
    return content();
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "router-menus"
  }, content);
}

function RouterItem(_ref4) {
  var content = _ref4.content;

  if (typeof content === 'function') {
    return content();
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "router-item"
  }, content);
}

function RouterContainer(_ref5) {
  var header = _ref5.header,
      footer = _ref5.footer,
      menus = _ref5.menus,
      content = _ref5.content,
      myref = _ref5.myref,
      containerClass = _ref5.containerClass;
  var body = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(RouterMenus, {
    content: menus
  }), content);
  var hasHeader = false;

  if (header || footer) {
    hasHeader = true;
    body = /*#__PURE__*/React.createElement("div", {
      className: "router-body"
    }, body);
  }

  return /*#__PURE__*/React.createElement("div", {
    className: 'router-container ' + (hasHeader ? 'router-container-v ' : 'router-container-h ') + (containerClass || ''),
    ref: myref
  }, /*#__PURE__*/React.createElement(RouterHeader, {
    content: header
  }), body, /*#__PURE__*/React.createElement(RouterFooter, {
    content: footer
  }));
}