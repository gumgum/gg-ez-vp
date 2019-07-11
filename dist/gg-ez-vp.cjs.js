'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    keys.push.apply(keys, Object.getOwnPropertySymbols(object));
  }

  if (enumerableOnly) keys = keys.filter(function (sym) {
    return Object.getOwnPropertyDescriptor(object, sym).enumerable;
  });
  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

var GgEzVp = function GgEzVp(options) {
  var _this = this;

  _classCallCheck(this, GgEzVp);

  _defineProperty(this, "init", function () {
    var containerId = _this.config.container;
    var currentContainer = document.getElementById(containerId);

    if (!currentContainer) {
      throw new Error('No container found. Is the id correct?');
    }

    console.log({
      currentContainer: currentContainer
    });
    _this.container = currentContainer;
    console.log(_this);
  });

  console.log({
    options: options
  });
  this.config = _objectSpread2({}, defaultOptions, {}, options);
  console.log(this.config);
  this.init();
};
var defaultOptions = {
  container: '',
  width: null,
  height: null,
  src: null,
  controls: true,
  autoPlay: false,
  volume: 1,
  mute: false,
  poster: null,
  preload: false,
  loop: false,
  monetization: false
};

module.exports = GgEzVp;
