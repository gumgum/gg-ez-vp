(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.GgEzVp = factory());
}(this, function () { 'use strict';

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

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var nanoevents = createCommonjsModule(function (module) {
  (
  /**
   * Interface for event subscription.
   *
   * @example
   * var NanoEvents = require('nanoevents')
   *
   * class Ticker {
   *   constructor() {
   *     this.emitter = new NanoEvents()
   *   }
   *   on() {
   *     return this.emitter.on.apply(this.events, arguments)
   *   }
   *   tick() {
   *     this.emitter.emit('tick')
   *   }
   * }
   *
   * @alias NanoEvents
   * @class
   */
  module.exports = function NanoEvents() {
    /**
     * Event names in keys and arrays with listeners in values.
     * @type {object}
     *
     * @example
     * Object.keys(ee.events)
     *
     * @alias NanoEvents#events
     */
    this.events = {};
  }).prototype = {
    /**
     * Calls each of the listeners registered for a given event.
     *
     * @param {string} event The event name.
     * @param {...*} arguments The arguments for listeners.
     *
     * @return {undefined}
     *
     * @example
     * ee.emit('tick', tickType, tickDuration)
     *
     * @alias NanoEvents#emit
     * @method
     */
    emit: function emit(event) {
      var args = [].slice.call(arguments, 1) // Array.prototype.call() returns empty array if context is not array-like
      ;
      [].slice.call(this.events[event] || []).filter(function (i) {
        i.apply(null, args);
      });
    },

    /**
     * Add a listener for a given event.
     *
     * @param {string} event The event name.
     * @param {function} cb The listener function.
     *
     * @return {function} Unbind listener from event.
     *
     * @example
     * const unbind = ee.on('tick', (tickType, tickDuration) => {
     *   count += 1
     * })
     *
     * disable () {
     *   unbind()
     * }
     *
     * @alias NanoEvents#on
     * @method
     */
    on: function on(event, cb) {

      (this.events[event] = this.events[event] || []).push(cb);
      return function () {
        this.events[event] = this.events[event].filter(function (i) {
          return i !== cb;
        });
      }.bind(this);
    }
  };
  });

  function renderVideoElement(playerInstance) {
    var container = playerInstance.container,
        _playerInstance$confi = playerInstance.config,
        src = _playerInstance$confi.src,
        width = _playerInstance$confi.width,
        height = _playerInstance$confi.height,
        autoplay = _playerInstance$confi.autoplay,
        volume = _playerInstance$confi.volume,
        muted = _playerInstance$confi.muted,
        poster = _playerInstance$confi.poster,
        preload = _playerInstance$confi.preload,
        loop = _playerInstance$confi.loop; // Group all the video element attributes

    var attrsConfig = {
      volume: volume,
      width: width,
      height: height,
      autoplay: autoplay,
      poster: poster,
      preload: preload,
      loop: loop
    }; // Validate that there is a source

    if (!src) {
      throw new Error('No file source found. Is src set?');
    } // validate the source is an accepted type (string | array)


    if (typeof src !== 'string' && !Array.isArray(src)) {
      throw new Error('src should be either a string or an array of strings');
    } // Create an array of tuples with the filtered attributes to be added to the video node


    var attributes = Object.keys(attrsConfig).reduce(function (attrs, key) {
      var value = attrsConfig[key];

      if (value) {
        return [].concat(_toConsumableArray(attrs), [[key, value]]);
      }

      return attrs;
    }, []); // Find the sources for media playback

    var sources = typeof src === 'string' ? [src] : src; // Create the video node

    var video = document.createElement('video'); // Set the default muted value

    video.muted = muted; // Add all attributes to the video node

    attributes.forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];

      video.setAttribute(key, isBooleanAttr(key) ? key : value);
    }); // Add all sources to the video node

    sources.forEach(function (s) {
      var source = document.createElement('source');
      source.src = s; // TODO: need a better way to set type

      source.type = "video/".concat(s.split('.').reverse()[0]);
      video.appendChild(source);
    }); // Insert the video node

    container.appendChild(video); // Return the video container to the class

    return video;
  }

  var isBooleanAttr = function isBooleanAttr(k) {
    return ['autoplay', 'loop'].includes(k);
  };

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
      setTimeout(function () {
        _this.emitter.emit('ready', {
          test: true
        });
      }, 3000);
    });

    _defineProperty(this, "on", function (eventName) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      // Set internal event listeners
      if (['ready', 'predestroy'].includes(eventName)) {
        var teardown = _this.emitter.on.apply(_this.emitter, [eventName].concat(args)); // Store listener for teardown on this.destroy


        _this.instanceListeners.push(teardown);
      } // Set player event listeners


      if (_this.player) {
        var _this$player;

        (_this$player = _this.player).addEventListener.apply(_this$player, [eventName].concat(args)); // Store listener for teardown on this.destroy


        _this.playerListeners.push([eventName].concat(args));
      }
    });

    _defineProperty(this, "instanceListeners", []);

    _defineProperty(this, "playerListeners", []);

    _defineProperty(this, "playPause", function () {
      if (_this.player.paused) {
        _this.play();
      } else {
        _this.pause();
      }
    });

    _defineProperty(this, "play", function () {
      _this.player.play();
    });

    _defineProperty(this, "pause", function () {
      _this.player.pause();
    });

    _defineProperty(this, "volume", function (val) {
      var value = val < 0 ? 0 : val > 1 ? 1 : value;
      _this.player.volume = value;
    });

    _defineProperty(this, "muteUnmute", function () {
      if (_this.player.muted) {
        _this.unmute();
      } else {
        _this.mute();
      }
    });

    _defineProperty(this, "mute", function () {
      _this.player.muted = true;
    });

    _defineProperty(this, "unmute", function () {
      _this.player.muted = false;
    });

    _defineProperty(this, "removeListeners", function () {
      // remove internal listeners
      _this.instanceListeners.forEach(function (teardownFn) {
        teardownFn();
      }); // remove player listeners


      _this.playerListeners.forEach(function (listenerConfig) {
        var _this$player2;

        (_this$player2 = _this.player).removeEventListener.apply(_this$player2, _toConsumableArray(listenerConfig));
      });

      _this.instanceListeners = [];
      _this.playerListeners = [];
    });

    _defineProperty(this, "destroy", function () {
      _this.emitter.emit('predestroy');

      _this.pause();

      _this.removeListeners();

      _this.container.parentNode.removeChild(_this.container);
    });

    // set up the event emitter
    this.emitter = new nanoevents(); // merge default options with user provided options

    this.config = _objectSpread2({}, defaultOptions, {}, options);
    console.log(this.config); // set up any extra processes

    this.init();
  };
  var defaultOptions = {
    container: null,
    width: null,
    height: null,
    src: null,
    controls: true,
    autoplay: false,
    volume: 1,
    muted: true,
    poster: null,
    preload: 'auto',
    loop: false,
    monetization: false
  };

  return GgEzVp;

}));
