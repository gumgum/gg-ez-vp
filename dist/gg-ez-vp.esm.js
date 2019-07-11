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

function renderVideoElement(playerInstance) {
  var src = playerInstance.config.src,
      container = playerInstance.container;

  if (!src) {
    throw new Error('No file source found. Is src set?');
  }

  if (typeof src !== 'string' && !Array.isArray(src)) {
    throw new Error('src should be either a string or an array of strings');
  }

  var sources = typeof src === 'string' ? [src] : src;
  var video = document.createElement('video');
  sources.forEach(function (s) {
    var source = document.createElement('source');
    source.src = s; // TODO: need a better way to set type

    source.type = "video/".concat(s.split('.').reverse()[0]);
    video.appendChild(source);
  }); // TODO: Add more properties

  container.appendChild(video);
  return video;
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

    _this.container = currentContainer;
    _this.player = renderVideoElement(_this);
  });

  _defineProperty(this, "play", function () {
    if (_this.player) {
      console.log(_this.player);

      _this.player.play();
    }
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

export default GgEzVp;
