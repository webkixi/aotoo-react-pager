"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fakePager;

function fakePage(params) {
  return params;
}

function fakePager(Pager) {
  Object.keys(Pager).forEach(function (k) {
    fakePage[k] = Pager[k];
  });
  return fakePage;
}