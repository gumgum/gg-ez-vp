(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.GgEzVp = factory());
}(this, function () { 'use strict';

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    }
  }

  var arrayWithoutHoles = _arrayWithoutHoles;

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  var iterableToArray = _iterableToArray;

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  var nonIterableSpread = _nonIterableSpread;

  function _toConsumableArray(arr) {
    return arrayWithoutHoles(arr) || iterableToArray(arr) || nonIterableSpread();
  }

  var toConsumableArray = _toConsumableArray;

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var runtime_1 = createCommonjsModule(function (module) {
  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var runtime = function (exports) {

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined$1; // More compressible than void 0.

    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.

      generator._invoke = makeInvokeMethod(innerFn, self, context);
      return generator;
    }

    exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.

    function tryCatch(fn, obj, arg) {
      try {
        return {
          type: "normal",
          arg: fn.call(obj, arg)
        };
      } catch (err) {
        return {
          type: "throw",
          arg: err
        };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.

    var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.

    function Generator() {}

    function GeneratorFunction() {}

    function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.


    var IteratorPrototype = {};

    IteratorPrototype[iteratorSymbol] = function () {
      return this;
    };

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

    if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction"; // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.

    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function (method) {
        prototype[method] = function (arg) {
          return this._invoke(method, arg);
        };
      });
    }

    exports.isGeneratorFunction = function (genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
      // do is to check its .name property.
      (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
    };

    exports.mark = function (genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;

        if (!(toStringTagSymbol in genFun)) {
          genFun[toStringTagSymbol] = "GeneratorFunction";
        }
      }

      genFun.prototype = Object.create(Gp);
      return genFun;
    }; // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.


    exports.awrap = function (arg) {
      return {
        __await: arg
      };
    };

    function AsyncIterator(generator) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);

        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;

          if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
            return Promise.resolve(value.__await).then(function (value) {
              invoke("next", value, resolve, reject);
            }, function (err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return Promise.resolve(value).then(function (unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration.
            result.value = unwrapped;
            resolve(result);
          }, function (error) {
            // If a rejected Promise was yielded, throw the rejection back
            // into the async generator function so it can be handled there.
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new Promise(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise = // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
        // invocations of the iterator.
        callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      } // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).


      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);

    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
      return this;
    };

    exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.

    exports.async = function (innerFn, outerFn, self, tryLocsList) {
      var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));
      return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function (result) {
        return result.done ? result.value : iter.next();
      });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;
      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          } // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;

          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);

            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;
          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);
          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;
          var record = tryCatch(innerFn, self, context);

          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done ? GenStateCompleted : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };
          } else if (record.type === "throw") {
            state = GenStateCompleted; // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.

            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    } // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.


    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];

      if (method === undefined$1) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          // Note: ["return"] must be used for ES3 parsing compatibility.
          if (delegate.iterator["return"]) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined$1;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError("The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (!info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

        context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.

        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined$1;
        }
      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      } // The delegate iterator is finished, so forget it and continue with
      // the outer generator.


      context.delegate = null;
      return ContinueSentinel;
    } // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.


    defineIteratorMethods(Gp);
    Gp[toStringTagSymbol] = "Generator"; // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.

    Gp[iteratorSymbol] = function () {
      return this;
    };

    Gp.toString = function () {
      return "[object Generator]";
    };

    function pushTryEntry(locs) {
      var entry = {
        tryLoc: locs[0]
      };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{
        tryLoc: "root"
      }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    exports.keys = function (object) {
      var keys = [];

      for (var key in object) {
        keys.push(key);
      }

      keys.reverse(); // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.

      return function next() {
        while (keys.length) {
          var key = keys.pop();

          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        } // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.


        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];

        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1,
              next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined$1;
            next.done = true;
            return next;
          };

          return next.next = next;
        }
      } // Return an iterator with no values.


      return {
        next: doneResult
      };
    }

    exports.values = values;

    function doneResult() {
      return {
        value: undefined$1,
        done: true
      };
    }

    Context.prototype = {
      constructor: Context,
      reset: function (skipTempReset) {
        this.prev = 0;
        this.next = 0; // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.

        this.sent = this._sent = undefined$1;
        this.done = false;
        this.delegate = null;
        this.method = "next";
        this.arg = undefined$1;
        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
              this[name] = undefined$1;
            }
          }
        }
      },
      stop: function () {
        this.done = true;
        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;

        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },
      dispatchException: function (exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;

        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined$1;
          }

          return !!caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }
            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },
      abrupt: function (type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },
      complete: function (record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" || record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },
      finish: function (finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },
      "catch": function (tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;

            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }

            return thrown;
          }
        } // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.


        throw new Error("illegal catch attempt");
      },
      delegateYield: function (iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined$1;
        }

        return ContinueSentinel;
      }
    }; // Regardless of whether this script is executing as a CommonJS module
    // or not, return the runtime object so that we can declare the variable
    // regeneratorRuntime in the outer scope, which allows this module to be
    // injected easily by `bin/regenerator --include-runtime script.js`.

    return exports;
  }( // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   module.exports );

  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    // This module should not be running in strict mode, so the above
    // assignment should always work unless something is misconfigured. Just
    // in case runtime.js accidentally runs in strict mode, we can escape
    // strict mode using a global Function call. This could conceivably fail
    // if a Content Security Policy forbids using Function, but in that case
    // the proper solution is to fix the accidental strict mode problem. If
    // you've misconfigured your bundler to force strict mode and applied a
    // CSP to forbid Function, and you're not willing to fix either of those
    // problems, please detail your unique predicament in a GitHub issue.
    Function("r", "regeneratorRuntime = r")(runtime);
  }
  });

  var regenerator = runtime_1;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  var asyncToGenerator = _asyncToGenerator;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var classCallCheck = _classCallCheck;

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

  var defineProperty = _defineProperty;

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

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  var arrayWithHoles = _arrayWithHoles;

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

  var iterableToArrayLimit = _iterableToArrayLimit;

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  var nonIterableRest = _nonIterableRest;

  function _slicedToArray(arr, i) {
    return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || nonIterableRest();
  }

  var slicedToArray = _slicedToArray;

  function renderVideoElement(playerInstance) {
    var container = playerInstance.container,
        VASTData = playerInstance.VASTData,
        _playerInstance$confi = playerInstance.config,
        src = _playerInstance$confi.src,
        isVAST = _playerInstance$confi.isVAST,
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
    } // Validate VASTData exists


    if (isVAST && !VASTData) {
      throw new Error('VAST data not found');
    } // Create an array of tuples with the filtered attributes to be added to the video node


    var attributes = Object.keys(attrsConfig).reduce(function (attrs, key) {
      var value = attrsConfig[key];

      if (value) {
        return [].concat(toConsumableArray(attrs), [[key, value]]);
      }

      return attrs;
    }, []);
    var VASTSources = isVAST ? VASTData.ads[0].creatives[0].mediaFiles.map(function (_ref) {
      var fileURL = _ref.fileURL;
      return fileURL;
    }) : null; // Find the sources for media playback

    var sources = VASTSources || (typeof src === 'string' ? [src] : src); // Create the video node

    var video = document.createElement('video'); // Set the default muted value

    video.muted = muted; // Add all attributes to the video node

    attributes.forEach(function (_ref2) {
      var _ref3 = slicedToArray(_ref2, 2),
          key = _ref3[0],
          value = _ref3[1];

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

  class Ad {
    constructor() {
      this.id = null, this.sequence = null, this.system = null, this.title = null, this.description = null, this.advertiser = null, this.pricing = null, this.survey = null, this.errorURLTemplates = [], this.impressionURLTemplates = [], this.creatives = [], this.extensions = [];
    }

  }

  class AdExtension {
    constructor() {
      this.attributes = {}, this.children = [];
    }

  }

  class AdExtensionChild {
    constructor() {
      this.name = null, this.value = null, this.attributes = {};
    }

  }

  class CompanionAd {
    constructor() {
      this.id = null, this.width = 0, this.height = 0, this.type = null, this.staticResource = null, this.htmlResource = null, this.iframeResource = null, this.altText = null, this.companionClickThroughURLTemplate = null, this.companionClickTrackingURLTemplates = [], this.trackingEvents = {};
    }

  }

  class Creative {
    constructor(e = {}) {
      this.id = e.id || null, this.adId = e.adId || null, this.sequence = e.sequence || null, this.apiFramework = e.apiFramework || null, this.trackingEvents = {};
    }

  }

  class CreativeCompanion extends Creative {
    constructor(e = {}) {
      super(e), this.type = "companion", this.variations = [];
    }

  }

  function track(e, t) {
    resolveURLTemplates(e, t).forEach(e => {
      if ("undefined" != typeof window && null !== window) {
        new Image().src = e;
      }
    });
  }

  function resolveURLTemplates(e, t = {}) {
    const r = [];
    t.ASSETURI && (t.ASSETURI = encodeURIComponentRFC3986(t.ASSETURI)), t.CONTENTPLAYHEAD && (t.CONTENTPLAYHEAD = encodeURIComponentRFC3986(t.CONTENTPLAYHEAD)), t.ERRORCODE && !/^[0-9]{3}$/.test(t.ERRORCODE) && (t.ERRORCODE = 900), t.CACHEBUSTING = leftpad(Math.round(1e8 * Math.random()).toString()), t.TIMESTAMP = encodeURIComponentRFC3986(new Date().toISOString()), t.RANDOM = t.random = t.CACHEBUSTING;

    for (let i in e) {
      let s = e[i];

      if ("string" == typeof s) {
        for (let e in t) {
          const r = t[e],
                i = `[${e}]`,
                n = `%%${e}%%`;
          s = (s = s.replace(i, r)).replace(n, r);
        }

        r.push(s);
      }
    }

    return r;
  }

  function encodeURIComponentRFC3986(e) {
    return encodeURIComponent(e).replace(/[!'()*]/g, e => `%${e.charCodeAt(0).toString(16)}`);
  }

  function leftpad(e) {
    return e.length < 8 ? range(0, 8 - e.length, !1).map(e => "0").join("") + e : e;
  }

  function range(e, t, r) {
    let i = [],
        s = e < t,
        n = r ? s ? t + 1 : t - 1 : t;

    for (let t = e; s ? t < n : t > n; s ? t++ : t--) i.push(t);

    return i;
  }

  function isNumeric(e) {
    return !isNaN(parseFloat(e)) && isFinite(e);
  }

  function flatten(e) {
    return e.reduce((e, t) => e.concat(Array.isArray(t) ? flatten(t) : t), []);
  }

  const util = {
    track: track,
    resolveURLTemplates: resolveURLTemplates,
    encodeURIComponentRFC3986: encodeURIComponentRFC3986,
    leftpad: leftpad,
    range: range,
    isNumeric: isNumeric,
    flatten: flatten
  };

  function childByName(e, t) {
    const r = e.childNodes;

    for (let e in r) {
      const i = r[e];
      if (i.nodeName === t) return i;
    }
  }

  function childrenByName(e, t) {
    const r = [],
          i = e.childNodes;

    for (let e in i) {
      const s = i[e];
      s.nodeName === t && r.push(s);
    }

    return r;
  }

  function resolveVastAdTagURI(e, t) {
    if (!t) return e;

    if (0 === e.indexOf("//")) {
      const {
        protocol: t
      } = location;
      return `${t}${e}`;
    }

    if (-1 === e.indexOf("://")) {
      return `${t.slice(0, t.lastIndexOf("/"))}/${e}`;
    }

    return e;
  }

  function parseBoolean(e) {
    return -1 !== ["true", "TRUE", "1"].indexOf(e);
  }

  function parseNodeText(e) {
    return e && (e.textContent || e.text || "").trim();
  }

  function copyNodeAttribute(e, t, r) {
    const i = t.getAttribute(e);
    i && r.setAttribute(e, i);
  }

  function parseDuration(e) {
    if (null == e) return -1;
    if (util.isNumeric(e)) return parseInt(e);
    const t = e.split(":");
    if (3 !== t.length) return -1;
    const r = t[2].split(".");
    let i = parseInt(r[0]);
    2 === r.length && (i += parseFloat(`0.${r[1]}`));
    const s = parseInt(60 * t[1]),
          n = parseInt(60 * t[0] * 60);
    return isNaN(n) || isNaN(s) || isNaN(i) || s > 3600 || i > 60 ? -1 : n + s + i;
  }

  function splitVAST(e) {
    const t = [];
    let r = null;
    return e.forEach((i, s) => {
      if (i.sequence && (i.sequence = parseInt(i.sequence, 10)), i.sequence > 1) {
        const t = e[s - 1];
        if (t && t.sequence === i.sequence - 1) return void (r && r.push(i));
        delete i.sequence;
      }

      r = [i], t.push(r);
    }), t;
  }

  function mergeWrapperAdData(e, t) {
    e.errorURLTemplates = t.errorURLTemplates.concat(e.errorURLTemplates), e.impressionURLTemplates = t.impressionURLTemplates.concat(e.impressionURLTemplates), e.extensions = t.extensions.concat(e.extensions), e.creatives.forEach(e => {
      if (t.trackingEvents && t.trackingEvents[e.type]) for (let r in t.trackingEvents[e.type]) {
        const i = t.trackingEvents[e.type][r];
        e.trackingEvents[r] || (e.trackingEvents[r] = []), e.trackingEvents[r] = e.trackingEvents[r].concat(i);
      }
    }), t.videoClickTrackingURLTemplates && t.videoClickTrackingURLTemplates.length && e.creatives.forEach(e => {
      "linear" === e.type && (e.videoClickTrackingURLTemplates = e.videoClickTrackingURLTemplates.concat(t.videoClickTrackingURLTemplates));
    }), t.videoCustomClickURLTemplates && t.videoCustomClickURLTemplates.length && e.creatives.forEach(e => {
      "linear" === e.type && (e.videoCustomClickURLTemplates = e.videoCustomClickURLTemplates.concat(t.videoCustomClickURLTemplates));
    }), t.videoClickThroughURLTemplate && e.creatives.forEach(e => {
      "linear" === e.type && null == e.videoClickThroughURLTemplate && (e.videoClickThroughURLTemplate = t.videoClickThroughURLTemplate);
    });
  }

  const parserUtils = {
    childByName: childByName,
    childrenByName: childrenByName,
    resolveVastAdTagURI: resolveVastAdTagURI,
    parseBoolean: parseBoolean,
    parseNodeText: parseNodeText,
    copyNodeAttribute: copyNodeAttribute,
    parseDuration: parseDuration,
    splitVAST: splitVAST,
    mergeWrapperAdData: mergeWrapperAdData
  };

  function parseCreativeCompanion(e, t) {
    const r = new CreativeCompanion(t);
    return parserUtils.childrenByName(e, "Companion").forEach(e => {
      const t = new CompanionAd();
      t.id = e.getAttribute("id") || null, t.width = e.getAttribute("width"), t.height = e.getAttribute("height"), t.companionClickTrackingURLTemplates = [], parserUtils.childrenByName(e, "HTMLResource").forEach(e => {
        t.type = e.getAttribute("creativeType") || "text/html", t.htmlResource = parserUtils.parseNodeText(e);
      }), parserUtils.childrenByName(e, "IFrameResource").forEach(e => {
        t.type = e.getAttribute("creativeType") || 0, t.iframeResource = parserUtils.parseNodeText(e);
      }), parserUtils.childrenByName(e, "StaticResource").forEach(r => {
        t.type = r.getAttribute("creativeType") || 0, parserUtils.childrenByName(e, "AltText").forEach(e => {
          t.altText = parserUtils.parseNodeText(e);
        }), t.staticResource = parserUtils.parseNodeText(r);
      }), parserUtils.childrenByName(e, "TrackingEvents").forEach(e => {
        parserUtils.childrenByName(e, "Tracking").forEach(e => {
          const r = e.getAttribute("event"),
                i = parserUtils.parseNodeText(e);
          r && i && (null == t.trackingEvents[r] && (t.trackingEvents[r] = []), t.trackingEvents[r].push(i));
        });
      }), parserUtils.childrenByName(e, "CompanionClickTracking").forEach(e => {
        t.companionClickTrackingURLTemplates.push(parserUtils.parseNodeText(e));
      }), t.companionClickThroughURLTemplate = parserUtils.parseNodeText(parserUtils.childByName(e, "CompanionClickThrough")), t.companionClickTrackingURLTemplate = parserUtils.parseNodeText(parserUtils.childByName(e, "CompanionClickTracking")), r.variations.push(t);
    }), r;
  }

  class CreativeLinear extends Creative {
    constructor(e = {}) {
      super(e), this.type = "linear", this.duration = 0, this.skipDelay = null, this.mediaFiles = [], this.videoClickThroughURLTemplate = null, this.videoClickTrackingURLTemplates = [], this.videoCustomClickURLTemplates = [], this.adParameters = null, this.icons = [];
    }

  }

  class Icon {
    constructor() {
      this.program = null, this.height = 0, this.width = 0, this.xPosition = 0, this.yPosition = 0, this.apiFramework = null, this.offset = null, this.duration = 0, this.type = null, this.staticResource = null, this.htmlResource = null, this.iframeResource = null, this.iconClickThroughURLTemplate = null, this.iconClickTrackingURLTemplates = [], this.iconViewTrackingURLTemplate = null;
    }

  }

  class MediaFile {
    constructor() {
      this.id = null, this.fileURL = null, this.deliveryType = "progressive", this.mimeType = null, this.codec = null, this.bitrate = 0, this.minBitrate = 0, this.maxBitrate = 0, this.width = 0, this.height = 0, this.apiFramework = null, this.scalable = null, this.maintainAspectRatio = null;
    }

  }

  function parseCreativeLinear(e, t) {
    let r;
    const i = new CreativeLinear(t);
    i.duration = parserUtils.parseDuration(parserUtils.parseNodeText(parserUtils.childByName(e, "Duration")));
    const s = e.getAttribute("skipoffset");
    if (null == s) i.skipDelay = null;else if ("%" === s.charAt(s.length - 1) && -1 !== i.duration) {
      const e = parseInt(s, 10);
      i.skipDelay = i.duration * (e / 100);
    } else i.skipDelay = parserUtils.parseDuration(s);
    const n = parserUtils.childByName(e, "VideoClicks");
    n && (i.videoClickThroughURLTemplate = parserUtils.parseNodeText(parserUtils.childByName(n, "ClickThrough")), parserUtils.childrenByName(n, "ClickTracking").forEach(e => {
      i.videoClickTrackingURLTemplates.push(parserUtils.parseNodeText(e));
    }), parserUtils.childrenByName(n, "CustomClick").forEach(e => {
      i.videoCustomClickURLTemplates.push(parserUtils.parseNodeText(e));
    }));
    const a = parserUtils.childByName(e, "AdParameters");
    a && (i.adParameters = parserUtils.parseNodeText(a)), parserUtils.childrenByName(e, "TrackingEvents").forEach(e => {
      parserUtils.childrenByName(e, "Tracking").forEach(e => {
        let t = e.getAttribute("event");
        const s = parserUtils.parseNodeText(e);

        if (t && s) {
          if ("progress" === t) {
            if (!(r = e.getAttribute("offset"))) return;
            t = "%" === r.charAt(r.length - 1) ? `progress-${r}` : `progress-${Math.round(parserUtils.parseDuration(r))}`;
          }

          null == i.trackingEvents[t] && (i.trackingEvents[t] = []), i.trackingEvents[t].push(s);
        }
      });
    }), parserUtils.childrenByName(e, "MediaFiles").forEach(e => {
      parserUtils.childrenByName(e, "MediaFile").forEach(e => {
        const t = new MediaFile();
        t.id = e.getAttribute("id"), t.fileURL = parserUtils.parseNodeText(e), t.deliveryType = e.getAttribute("delivery"), t.codec = e.getAttribute("codec"), t.mimeType = e.getAttribute("type"), t.apiFramework = e.getAttribute("apiFramework"), t.bitrate = parseInt(e.getAttribute("bitrate") || 0), t.minBitrate = parseInt(e.getAttribute("minBitrate") || 0), t.maxBitrate = parseInt(e.getAttribute("maxBitrate") || 0), t.width = parseInt(e.getAttribute("width") || 0), t.height = parseInt(e.getAttribute("height") || 0);
        let r = e.getAttribute("scalable");
        r && "string" == typeof r && ("true" === (r = r.toLowerCase()) ? t.scalable = !0 : "false" === r && (t.scalable = !1));
        let s = e.getAttribute("maintainAspectRatio");
        s && "string" == typeof s && ("true" === (s = s.toLowerCase()) ? t.maintainAspectRatio = !0 : "false" === s && (t.maintainAspectRatio = !1)), i.mediaFiles.push(t);
      });
    });
    const o = parserUtils.childByName(e, "Icons");
    return o && parserUtils.childrenByName(o, "Icon").forEach(e => {
      const t = new Icon();
      t.program = e.getAttribute("program"), t.height = parseInt(e.getAttribute("height") || 0), t.width = parseInt(e.getAttribute("width") || 0), t.xPosition = parseXPosition(e.getAttribute("xPosition")), t.yPosition = parseYPosition(e.getAttribute("yPosition")), t.apiFramework = e.getAttribute("apiFramework"), t.offset = parserUtils.parseDuration(e.getAttribute("offset")), t.duration = parserUtils.parseDuration(e.getAttribute("duration")), parserUtils.childrenByName(e, "HTMLResource").forEach(e => {
        t.type = e.getAttribute("creativeType") || "text/html", t.htmlResource = parserUtils.parseNodeText(e);
      }), parserUtils.childrenByName(e, "IFrameResource").forEach(e => {
        t.type = e.getAttribute("creativeType") || 0, t.iframeResource = parserUtils.parseNodeText(e);
      }), parserUtils.childrenByName(e, "StaticResource").forEach(e => {
        t.type = e.getAttribute("creativeType") || 0, t.staticResource = parserUtils.parseNodeText(e);
      });
      const r = parserUtils.childByName(e, "IconClicks");
      r && (t.iconClickThroughURLTemplate = parserUtils.parseNodeText(parserUtils.childByName(r, "IconClickThrough")), parserUtils.childrenByName(r, "IconClickTracking").forEach(e => {
        t.iconClickTrackingURLTemplates.push(parserUtils.parseNodeText(e));
      })), t.iconViewTrackingURLTemplate = parserUtils.parseNodeText(parserUtils.childByName(e, "IconViewTracking")), i.icons.push(t);
    }), i;
  }

  function parseXPosition(e) {
    return -1 !== ["left", "right"].indexOf(e) ? e : parseInt(e || 0);
  }

  function parseYPosition(e) {
    return -1 !== ["top", "bottom"].indexOf(e) ? e : parseInt(e || 0);
  }

  class CreativeNonLinear extends Creative {
    constructor(e = {}) {
      super(e), this.type = "nonlinear", this.variations = [];
    }

  }

  class NonLinearAd {
    constructor() {
      this.id = null, this.width = 0, this.height = 0, this.expandedWidth = 0, this.expandedHeight = 0, this.scalable = !0, this.maintainAspectRatio = !0, this.minSuggestedDuration = 0, this.apiFramework = "static", this.type = null, this.staticResource = null, this.htmlResource = null, this.iframeResource = null, this.nonlinearClickThroughURLTemplate = null, this.nonlinearClickTrackingURLTemplates = [], this.adParameters = null;
    }

  }

  function parseCreativeNonLinear(e, t) {
    const r = new CreativeNonLinear(t);
    return parserUtils.childrenByName(e, "TrackingEvents").forEach(e => {
      let t, i;
      parserUtils.childrenByName(e, "Tracking").forEach(e => {
        t = e.getAttribute("event"), i = parserUtils.parseNodeText(e), t && i && (null == r.trackingEvents[t] && (r.trackingEvents[t] = []), r.trackingEvents[t].push(i));
      });
    }), parserUtils.childrenByName(e, "NonLinear").forEach(e => {
      const t = new NonLinearAd();
      t.id = e.getAttribute("id") || null, t.width = e.getAttribute("width"), t.height = e.getAttribute("height"), t.expandedWidth = e.getAttribute("expandedWidth"), t.expandedHeight = e.getAttribute("expandedHeight"), t.scalable = parserUtils.parseBoolean(e.getAttribute("scalable")), t.maintainAspectRatio = parserUtils.parseBoolean(e.getAttribute("maintainAspectRatio")), t.minSuggestedDuration = parserUtils.parseDuration(e.getAttribute("minSuggestedDuration")), t.apiFramework = e.getAttribute("apiFramework"), parserUtils.childrenByName(e, "HTMLResource").forEach(e => {
        t.type = e.getAttribute("creativeType") || "text/html", t.htmlResource = parserUtils.parseNodeText(e);
      }), parserUtils.childrenByName(e, "IFrameResource").forEach(e => {
        t.type = e.getAttribute("creativeType") || 0, t.iframeResource = parserUtils.parseNodeText(e);
      }), parserUtils.childrenByName(e, "StaticResource").forEach(e => {
        t.type = e.getAttribute("creativeType") || 0, t.staticResource = parserUtils.parseNodeText(e);
      });
      const i = parserUtils.childByName(e, "AdParameters");
      i && (t.adParameters = parserUtils.parseNodeText(i)), t.nonlinearClickThroughURLTemplate = parserUtils.parseNodeText(parserUtils.childByName(e, "NonLinearClickThrough")), parserUtils.childrenByName(e, "NonLinearClickTracking").forEach(e => {
        t.nonlinearClickTrackingURLTemplates.push(parserUtils.parseNodeText(e));
      }), r.variations.push(t);
    }), r;
  }

  function parseAd(e) {
    const t = e.childNodes;

    for (let r in t) {
      const i = t[r];

      if (-1 !== ["Wrapper", "InLine"].indexOf(i.nodeName)) {
        if (parserUtils.copyNodeAttribute("id", e, i), parserUtils.copyNodeAttribute("sequence", e, i), "Wrapper" === i.nodeName) return parseWrapper(i);
        if ("InLine" === i.nodeName) return parseInLine(i);
      }
    }
  }

  function parseInLine(e) {
    const t = e.childNodes,
          r = new Ad();
    r.id = e.getAttribute("id") || null, r.sequence = e.getAttribute("sequence") || null;

    for (let e in t) {
      const i = t[e];

      switch (i.nodeName) {
        case "Error":
          r.errorURLTemplates.push(parserUtils.parseNodeText(i));
          break;

        case "Impression":
          r.impressionURLTemplates.push(parserUtils.parseNodeText(i));
          break;

        case "Creatives":
          parserUtils.childrenByName(i, "Creative").forEach(e => {
            const t = {
              id: e.getAttribute("id") || null,
              adId: parseCreativeAdIdAttribute(e),
              sequence: e.getAttribute("sequence") || null,
              apiFramework: e.getAttribute("apiFramework") || null
            };

            for (let i in e.childNodes) {
              const s = e.childNodes[i];

              switch (s.nodeName) {
                case "Linear":
                  let e = parseCreativeLinear(s, t);
                  e && r.creatives.push(e);
                  break;

                case "NonLinearAds":
                  let i = parseCreativeNonLinear(s, t);
                  i && r.creatives.push(i);
                  break;

                case "CompanionAds":
                  let n = parseCreativeCompanion(s, t);
                  n && r.creatives.push(n);
              }
            }
          });
          break;

        case "Extensions":
          parseExtensions(r.extensions, parserUtils.childrenByName(i, "Extension"));
          break;

        case "AdSystem":
          r.system = {
            value: parserUtils.parseNodeText(i),
            version: i.getAttribute("version") || null
          };
          break;

        case "AdTitle":
          r.title = parserUtils.parseNodeText(i);
          break;

        case "Description":
          r.description = parserUtils.parseNodeText(i);
          break;

        case "Advertiser":
          r.advertiser = parserUtils.parseNodeText(i);
          break;

        case "Pricing":
          r.pricing = {
            value: parserUtils.parseNodeText(i),
            model: i.getAttribute("model") || null,
            currency: i.getAttribute("currency") || null
          };
          break;

        case "Survey":
          r.survey = parserUtils.parseNodeText(i);
      }
    }

    return r;
  }

  function parseWrapper(e) {
    const t = parseInLine(e);
    let r = parserUtils.childByName(e, "VASTAdTagURI");
    if (r ? t.nextWrapperURL = parserUtils.parseNodeText(r) : (r = parserUtils.childByName(e, "VASTAdTagURL")) && (t.nextWrapperURL = parserUtils.parseNodeText(parserUtils.childByName(r, "URL"))), t.creatives.forEach(e => {
      if (-1 !== ["linear", "nonlinear"].indexOf(e.type)) {
        if (e.trackingEvents) {
          t.trackingEvents || (t.trackingEvents = {}), t.trackingEvents[e.type] || (t.trackingEvents[e.type] = {});

          for (let r in e.trackingEvents) {
            const i = e.trackingEvents[r];
            t.trackingEvents[e.type][r] || (t.trackingEvents[e.type][r] = []), i.forEach(i => {
              t.trackingEvents[e.type][r].push(i);
            });
          }
        }

        e.videoClickTrackingURLTemplates && (t.videoClickTrackingURLTemplates || (t.videoClickTrackingURLTemplates = []), e.videoClickTrackingURLTemplates.forEach(e => {
          t.videoClickTrackingURLTemplates.push(e);
        })), e.videoClickThroughURLTemplate && (t.videoClickThroughURLTemplate = e.videoClickThroughURLTemplate), e.videoCustomClickURLTemplates && (t.videoCustomClickURLTemplates || (t.videoCustomClickURLTemplates = []), e.videoCustomClickURLTemplates.forEach(e => {
          t.videoCustomClickURLTemplates.push(e);
        }));
      }
    }), t.nextWrapperURL) return t;
  }

  function parseExtensions(e, t) {
    t.forEach(t => {
      const r = new AdExtension(),
            i = t.attributes,
            s = t.childNodes;
      if (t.attributes) for (let e in i) {
        const t = i[e];
        t.nodeName && t.nodeValue && (r.attributes[t.nodeName] = t.nodeValue);
      }

      for (let e in s) {
        const t = s[e],
              i = parserUtils.parseNodeText(t);

        if ("#comment" !== t.nodeName && "" !== i) {
          const e = new AdExtensionChild();

          if (e.name = t.nodeName, e.value = i, t.attributes) {
            const r = t.attributes;

            for (let t in r) {
              const i = r[t];
              e.attributes[i.nodeName] = i.nodeValue;
            }
          }

          r.children.push(e);
        }
      }

      e.push(r);
    });
  }

  function parseCreativeAdIdAttribute(e) {
    return e.getAttribute("AdID") || e.getAttribute("adID") || e.getAttribute("adId") || null;
  }

  var domain;

  function EventHandlers() {}

  function EventEmitter() {
    EventEmitter.init.call(this);
  }

  function $getMaxListeners(e) {
    return void 0 === e._maxListeners ? EventEmitter.defaultMaxListeners : e._maxListeners;
  }

  function emitNone(e, t, r) {
    if (t) e.call(r);else for (var i = e.length, s = arrayClone(e, i), n = 0; n < i; ++n) s[n].call(r);
  }

  function emitOne(e, t, r, i) {
    if (t) e.call(r, i);else for (var s = e.length, n = arrayClone(e, s), a = 0; a < s; ++a) n[a].call(r, i);
  }

  function emitTwo(e, t, r, i, s) {
    if (t) e.call(r, i, s);else for (var n = e.length, a = arrayClone(e, n), o = 0; o < n; ++o) a[o].call(r, i, s);
  }

  function emitThree(e, t, r, i, s, n) {
    if (t) e.call(r, i, s, n);else for (var a = e.length, o = arrayClone(e, a), l = 0; l < a; ++l) o[l].call(r, i, s, n);
  }

  function emitMany(e, t, r, i) {
    if (t) e.apply(r, i);else for (var s = e.length, n = arrayClone(e, s), a = 0; a < s; ++a) n[a].apply(r, i);
  }

  function _addListener(e, t, r, i) {
    var s, n, a;
    if ("function" != typeof r) throw new TypeError('"listener" argument must be a function');

    if ((n = e._events) ? (n.newListener && (e.emit("newListener", t, r.listener ? r.listener : r), n = e._events), a = n[t]) : (n = e._events = new EventHandlers(), e._eventsCount = 0), a) {
      if ("function" == typeof a ? a = n[t] = i ? [r, a] : [a, r] : i ? a.unshift(r) : a.push(r), !a.warned && (s = $getMaxListeners(e)) && s > 0 && a.length > s) {
        a.warned = !0;
        var o = new Error("Possible EventEmitter memory leak detected. " + a.length + " " + t + " listeners added. Use emitter.setMaxListeners() to increase limit");
        o.name = "MaxListenersExceededWarning", o.emitter = e, o.type = t, o.count = a.length, emitWarning(o);
      }
    } else a = n[t] = r, ++e._eventsCount;

    return e;
  }

  function emitWarning(e) {
    "function" == typeof console.warn ? console.warn(e) : console.log(e);
  }

  function _onceWrap(e, t, r) {
    var i = !1;

    function s() {
      e.removeListener(t, s), i || (i = !0, r.apply(e, arguments));
    }

    return s.listener = r, s;
  }

  function listenerCount(e) {
    var t = this._events;

    if (t) {
      var r = t[e];
      if ("function" == typeof r) return 1;
      if (r) return r.length;
    }

    return 0;
  }

  function spliceOne(e, t) {
    for (var r = t, i = r + 1, s = e.length; i < s; r += 1, i += 1) e[r] = e[i];

    e.pop();
  }

  function arrayClone(e, t) {
    for (var r = new Array(t); t--;) r[t] = e[t];

    return r;
  }

  function unwrapListeners(e) {
    for (var t = new Array(e.length), r = 0; r < t.length; ++r) t[r] = e[r].listener || e[r];

    return t;
  }

  function xdr() {
    let e;
    return window.XDomainRequest && (e = new XDomainRequest()), e;
  }

  function supported() {
    return !!xdr();
  }

  function get(e, t, r) {
    let i = "function" == typeof window.ActiveXObject ? new window.ActiveXObject("Microsoft.XMLDOM") : void 0;
    if (!i) return r(new Error("FlashURLHandler: Microsoft.XMLDOM format not supported"));
    i.async = !1, request.open("GET", e), request.timeout = t.timeout || 0, request.withCredentials = t.withCredentials || !1, request.send(), request.onprogress = function () {}, request.onload = function () {
      i.loadXML(request.responseText), r(null, i);
    };
  }

  EventHandlers.prototype = Object.create(null), EventEmitter.EventEmitter = EventEmitter, EventEmitter.usingDomains = !1, EventEmitter.prototype.domain = void 0, EventEmitter.prototype._events = void 0, EventEmitter.prototype._maxListeners = void 0, EventEmitter.defaultMaxListeners = 10, EventEmitter.init = function () {
    this.domain = null, EventEmitter.usingDomains && (!domain.active || this instanceof domain.Domain || (this.domain = domain.active)), this._events && this._events !== Object.getPrototypeOf(this)._events || (this._events = new EventHandlers(), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
  }, EventEmitter.prototype.setMaxListeners = function (e) {
    if ("number" != typeof e || e < 0 || isNaN(e)) throw new TypeError('"n" argument must be a positive number');
    return this._maxListeners = e, this;
  }, EventEmitter.prototype.getMaxListeners = function () {
    return $getMaxListeners(this);
  }, EventEmitter.prototype.emit = function (e) {
    var t,
        r,
        i,
        s,
        n,
        a,
        o,
        l = "error" === e;
    if (a = this._events) l = l && null == a.error;else if (!l) return !1;

    if (o = this.domain, l) {
      if (t = arguments[1], !o) {
        if (t instanceof Error) throw t;
        var c = new Error('Uncaught, unspecified "error" event. (' + t + ")");
        throw c.context = t, c;
      }

      return t || (t = new Error('Uncaught, unspecified "error" event')), t.domainEmitter = this, t.domain = o, t.domainThrown = !1, o.emit("error", t), !1;
    }

    if (!(r = a[e])) return !1;
    var p = "function" == typeof r;

    switch (i = arguments.length) {
      case 1:
        emitNone(r, p, this);
        break;

      case 2:
        emitOne(r, p, this, arguments[1]);
        break;

      case 3:
        emitTwo(r, p, this, arguments[1], arguments[2]);
        break;

      case 4:
        emitThree(r, p, this, arguments[1], arguments[2], arguments[3]);
        break;

      default:
        for (s = new Array(i - 1), n = 1; n < i; n++) s[n - 1] = arguments[n];

        emitMany(r, p, this, s);
    }

    return !0;
  }, EventEmitter.prototype.addListener = function (e, t) {
    return _addListener(this, e, t, !1);
  }, EventEmitter.prototype.on = EventEmitter.prototype.addListener, EventEmitter.prototype.prependListener = function (e, t) {
    return _addListener(this, e, t, !0);
  }, EventEmitter.prototype.once = function (e, t) {
    if ("function" != typeof t) throw new TypeError('"listener" argument must be a function');
    return this.on(e, _onceWrap(this, e, t)), this;
  }, EventEmitter.prototype.prependOnceListener = function (e, t) {
    if ("function" != typeof t) throw new TypeError('"listener" argument must be a function');
    return this.prependListener(e, _onceWrap(this, e, t)), this;
  }, EventEmitter.prototype.removeListener = function (e, t) {
    var r, i, s, n, a;
    if ("function" != typeof t) throw new TypeError('"listener" argument must be a function');
    if (!(i = this._events)) return this;
    if (!(r = i[e])) return this;
    if (r === t || r.listener && r.listener === t) 0 == --this._eventsCount ? this._events = new EventHandlers() : (delete i[e], i.removeListener && this.emit("removeListener", e, r.listener || t));else if ("function" != typeof r) {
      for (s = -1, n = r.length; n-- > 0;) if (r[n] === t || r[n].listener && r[n].listener === t) {
        a = r[n].listener, s = n;
        break;
      }

      if (s < 0) return this;

      if (1 === r.length) {
        if (r[0] = void 0, 0 == --this._eventsCount) return this._events = new EventHandlers(), this;
        delete i[e];
      } else spliceOne(r, s);

      i.removeListener && this.emit("removeListener", e, a || t);
    }
    return this;
  }, EventEmitter.prototype.removeAllListeners = function (e) {
    var t, r;
    if (!(r = this._events)) return this;
    if (!r.removeListener) return 0 === arguments.length ? (this._events = new EventHandlers(), this._eventsCount = 0) : r[e] && (0 == --this._eventsCount ? this._events = new EventHandlers() : delete r[e]), this;

    if (0 === arguments.length) {
      for (var i, s = Object.keys(r), n = 0; n < s.length; ++n) "removeListener" !== (i = s[n]) && this.removeAllListeners(i);

      return this.removeAllListeners("removeListener"), this._events = new EventHandlers(), this._eventsCount = 0, this;
    }

    if ("function" == typeof (t = r[e])) this.removeListener(e, t);else if (t) do {
      this.removeListener(e, t[t.length - 1]);
    } while (t[0]);
    return this;
  }, EventEmitter.prototype.listeners = function (e) {
    var t,
        r = this._events;
    return r && (t = r[e]) ? "function" == typeof t ? [t.listener || t] : unwrapListeners(t) : [];
  }, EventEmitter.listenerCount = function (e, t) {
    return "function" == typeof e.listenerCount ? e.listenerCount(t) : listenerCount.call(e, t);
  }, EventEmitter.prototype.listenerCount = listenerCount, EventEmitter.prototype.eventNames = function () {
    return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
  };
  const flashURLHandler = {
    get: get,
    supported: supported
  };

  function get$1(e, t, r) {
    r(new Error("Please bundle the library for node to use the node urlHandler"));
  }

  const nodeURLHandler = {
    get: get$1
  };

  function xhr() {
    try {
      const e = new window.XMLHttpRequest();
      return "withCredentials" in e ? e : null;
    } catch (e) {
      return console.log("Error in XHRURLHandler support check:", e), null;
    }
  }

  function supported$1() {
    return !!xhr();
  }

  function get$2(e, t, r) {
    if ("https:" === window.location.protocol && 0 === e.indexOf("http://")) return r(new Error("XHRURLHandler: Cannot go from HTTPS to HTTP."));

    try {
      const i = xhr();
      i.open("GET", e), i.timeout = t.timeout || 0, i.withCredentials = t.withCredentials || !1, i.overrideMimeType && i.overrideMimeType("text/xml"), i.onreadystatechange = function () {
        4 === i.readyState && (200 === i.status ? r(null, i.responseXML) : r(new Error(`XHRURLHandler: ${i.statusText}`)));
      }, i.send();
    } catch (e) {
      r(new Error("XHRURLHandler: Unexpected error"));
    }
  }

  const XHRURLHandler = {
    get: get$2,
    supported: supported$1
  };

  function get$3(e, t, r) {
    return r || ("function" == typeof t && (r = t), t = {}), "undefined" == typeof window || null === window ? nodeURLHandler.get(e, t, r) : XHRURLHandler.supported() ? XHRURLHandler.get(e, t, r) : flashURLHandler.supported() ? flashURLHandler.get(e, t, r) : r(new Error("Current context is not supported by any of the default URLHandlers. Please provide a custom URLHandler"));
  }

  const urlHandler = {
    get: get$3
  };

  class VASTResponse {
    constructor() {
      this.ads = [], this.errorURLTemplates = [];
    }

  }

  const DEFAULT_MAX_WRAPPER_DEPTH = 10,
        DEFAULT_EVENT_DATA = {
    ERRORCODE: 900,
    extensions: []
  };

  class VASTParser extends EventEmitter {
    constructor() {
      super(), this.remainingAds = [], this.parentURLs = [], this.errorURLTemplates = [], this.rootErrorURLTemplates = [], this.maxWrapperDepth = null, this.URLTemplateFilters = [], this.fetchingOptions = {};
    }

    addURLTemplateFilter(e) {
      "function" == typeof e && this.URLTemplateFilters.push(e);
    }

    removeURLTemplateFilter() {
      this.URLTemplateFilters.pop();
    }

    countURLTemplateFilters() {
      return this.URLTemplateFilters.length;
    }

    clearURLTemplateFilters() {
      this.URLTemplateFilters = [];
    }

    trackVastError(e, t, ...r) {
      this.emit("VAST-error", Object.assign(DEFAULT_EVENT_DATA, t, ...r)), util.track(e, t);
    }

    getErrorURLTemplates() {
      return this.rootErrorURLTemplates.concat(this.errorURLTemplates);
    }

    fetchVAST(e, t, r) {
      return new Promise((i, s) => {
        this.URLTemplateFilters.forEach(t => {
          e = t(e);
        }), this.parentURLs.push(e), this.emit("VAST-resolving", {
          url: e,
          wrapperDepth: t,
          originalUrl: r
        }), this.urlHandler.get(e, this.fetchingOptions, (t, r) => {
          this.emit("VAST-resolved", {
            url: e,
            error: t
          }), t ? s(t) : i(r);
        });
      });
    }

    initParsingStatus(e = {}) {
      this.rootURL = "", this.remainingAds = [], this.parentURLs = [], this.errorURLTemplates = [], this.rootErrorURLTemplates = [], this.maxWrapperDepth = e.wrapperLimit || DEFAULT_MAX_WRAPPER_DEPTH, this.fetchingOptions = {
        timeout: e.timeout,
        withCredentials: e.withCredentials
      }, this.urlHandler = e.urlhandler || urlHandler;
    }

    getRemainingAds(e) {
      if (0 === this.remainingAds.length) return Promise.reject(new Error("No more ads are available for the given VAST"));
      const t = e ? util.flatten(this.remainingAds) : this.remainingAds.shift();
      return this.errorURLTemplates = [], this.parentURLs = [], this.resolveAds(t, {
        wrapperDepth: 0,
        originalUrl: this.rootURL
      }).then(e => this.buildVASTResponse(e));
    }

    getAndParseVAST(e, t = {}) {
      return this.initParsingStatus(t), this.rootURL = e, this.fetchVAST(e).then(r => (t.originalUrl = e, t.isRootVAST = !0, this.parse(r, t).then(e => this.buildVASTResponse(e))));
    }

    parseVAST(e, t = {}) {
      return this.initParsingStatus(t), t.isRootVAST = !0, this.parse(e, t).then(e => this.buildVASTResponse(e));
    }

    buildVASTResponse(e) {
      const t = new VASTResponse();
      return t.ads = e, t.errorURLTemplates = this.getErrorURLTemplates(), this.completeWrapperResolving(t), t;
    }

    parse(e, {
      resolveAll: t = !0,
      wrapperSequence: r = null,
      originalUrl: i = null,
      wrapperDepth: s = 0,
      isRootVAST: n = !1
    }) {
      if (!e || !e.documentElement || "VAST" !== e.documentElement.nodeName) return Promise.reject(new Error("Invalid VAST XMLDocument"));
      let a = [];
      const o = e.documentElement.childNodes;

      for (let e in o) {
        const t = o[e];

        if ("Error" === t.nodeName) {
          const e = parserUtils.parseNodeText(t);
          n ? this.rootErrorURLTemplates.push(e) : this.errorURLTemplates.push(e);
        }

        if ("Ad" === t.nodeName) {
          const e = parseAd(t);
          e ? a.push(e) : this.trackVastError(this.getErrorURLTemplates(), {
            ERRORCODE: 101
          });
        }
      }

      const l = a.length,
            c = a[l - 1];
      return 1 === l && void 0 !== r && null !== r && c && !c.sequence && (c.sequence = r), !1 === t && (this.remainingAds = parserUtils.splitVAST(a), a = this.remainingAds.shift()), this.resolveAds(a, {
        wrapperDepth: s,
        originalUrl: i
      });
    }

    resolveAds(e = [], {
      wrapperDepth: t,
      originalUrl: r
    }) {
      const i = [];
      return e.forEach(e => {
        const s = this.resolveWrappers(e, t, r);
        i.push(s);
      }), Promise.all(i).then(e => {
        const i = util.flatten(e);

        if (!i && this.remainingAds.length > 0) {
          const e = this.remainingAds.shift();
          return this.resolveAds(e, {
            wrapperDepth: t,
            originalUrl: r
          });
        }

        return i;
      });
    }

    resolveWrappers(e, t, r) {
      return new Promise((i, s) => {
        if (t++, !e.nextWrapperURL) return delete e.nextWrapperURL, i(e);
        if (t >= this.maxWrapperDepth || -1 !== this.parentURLs.indexOf(e.nextWrapperURL)) return e.errorCode = 302, delete e.nextWrapperURL, i(e);
        e.nextWrapperURL = parserUtils.resolveVastAdTagURI(e.nextWrapperURL, r);
        const n = e.sequence;
        r = e.nextWrapperURL, this.fetchVAST(e.nextWrapperURL, t, r).then(s => this.parse(s, {
          originalUrl: r,
          wrapperSequence: n,
          wrapperDepth: t
        }).then(t => {
          if (delete e.nextWrapperURL, 0 === t.length) return e.creatives = [], i(e);
          t.forEach(t => {
            t && parserUtils.mergeWrapperAdData(t, e);
          }), i(t);
        })).catch(t => {
          e.errorCode = 301, e.errorMessage = t.message, i(e);
        });
      });
    }

    completeWrapperResolving(e) {
      if (0 === e.ads.length) this.trackVastError(e.errorURLTemplates, {
        ERRORCODE: 303
      });else for (let t = e.ads.length - 1; t >= 0; t--) {
        let r = e.ads[t];
        (r.errorCode || 0 === r.creatives.length) && (this.trackVastError(r.errorURLTemplates.concat(e.errorURLTemplates), {
          ERRORCODE: r.errorCode || 303
        }, {
          ERRORMESSAGE: r.errorMessage || ""
        }, {
          extensions: r.extensions
        }, {
          system: r.system
        }), e.ads.splice(t, 1));
      }
    }

  }

  let storage = null;
  const DEFAULT_STORAGE = {
    data: {},
    length: 0,

    getItem(e) {
      return this.data[e];
    },

    setItem(e, t) {
      this.data[e] = t, this.length = Object.keys(this.data).length;
    },

    removeItem(e) {
      delete data[e], this.length = Object.keys(this.data).length;
    },

    clear() {
      this.data = {}, this.length = 0;
    }

  };

  class Storage {
    constructor() {
      this.storage = this.initStorage();
    }

    initStorage() {
      if (storage) return storage;

      try {
        storage = "undefined" != typeof window && null !== window ? window.localStorage || window.sessionStorage : null;
      } catch (e) {
        storage = null;
      }

      return storage && !this.isStorageDisabled(storage) || (storage = DEFAULT_STORAGE).clear(), storage;
    }

    isStorageDisabled(e) {
      const t = "__VASTStorage__";

      try {
        if (e.setItem(t, t), e.getItem(t) !== t) return e.removeItem(t), !0;
      } catch (e) {
        return !0;
      }

      return e.removeItem(t), !1;
    }

    getItem(e) {
      return this.storage.getItem(e);
    }

    setItem(e, t) {
      return this.storage.setItem(e, t);
    }

    removeItem(e) {
      return this.storage.removeItem(e);
    }

    clear() {
      return this.storage.clear();
    }

  }

  class VASTClient {
    constructor(e, t, r) {
      this.cappingFreeLunch = e || 0, this.cappingMinimumTimeInterval = t || 0, this.defaultOptions = {
        withCredentials: !1,
        timeout: 0
      }, this.vastParser = new VASTParser(), this.storage = r || new Storage(), void 0 === this.lastSuccessfulAd && (this.lastSuccessfulAd = 0), void 0 === this.totalCalls && (this.totalCalls = 0), void 0 === this.totalCallsTimeout && (this.totalCallsTimeout = 0);
    }

    getParser() {
      return this.vastParser;
    }

    get lastSuccessfulAd() {
      return this.storage.getItem("vast-client-last-successful-ad");
    }

    set lastSuccessfulAd(e) {
      this.storage.setItem("vast-client-last-successful-ad", e);
    }

    get totalCalls() {
      return this.storage.getItem("vast-client-total-calls");
    }

    set totalCalls(e) {
      this.storage.setItem("vast-client-total-calls", e);
    }

    get totalCallsTimeout() {
      return this.storage.getItem("vast-client-total-calls-timeout");
    }

    set totalCallsTimeout(e) {
      this.storage.setItem("vast-client-total-calls-timeout", e);
    }

    hasRemainingAds() {
      return this.vastParser.remainingAds.length > 0;
    }

    getNextAds(e) {
      return this.vastParser.getRemainingAds(e);
    }

    get(e, t = {}) {
      const r = Date.now();
      return (t = Object.assign(this.defaultOptions, t)).hasOwnProperty("resolveAll") || (t.resolveAll = !1), this.totalCallsTimeout < r ? (this.totalCalls = 1, this.totalCallsTimeout = r + 36e5) : this.totalCalls++, new Promise((i, s) => {
        if (this.cappingFreeLunch >= this.totalCalls) return s(new Error(`VAST call canceled – FreeLunch capping not reached yet ${this.totalCalls}/${this.cappingFreeLunch}`));
        const n = r - this.lastSuccessfulAd;
        if (n < 0) this.lastSuccessfulAd = 0;else if (n < this.cappingMinimumTimeInterval) return s(new Error(`VAST call canceled – (${this.cappingMinimumTimeInterval})ms minimum interval reached`));
        this.vastParser.getAndParseVAST(e, t).then(e => i(e)).catch(e => s(e));
      });
    }

  }

  function parseAdXML(_x) {
    return _parseAdXML.apply(this, arguments);
  }

  function _parseAdXML() {
    _parseAdXML = asyncToGenerator(
    /*#__PURE__*/
    regenerator.mark(function _callee(playerInstance) {
      var _playerInstance$confi, isVAST, src, vastClient, data;

      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _playerInstance$confi = playerInstance.config, isVAST = _playerInstance$confi.isVAST, src = _playerInstance$confi.src; // validate isVAST value is right

              if (!(isVAST !== true)) {
                _context.next = 3;
                break;
              }

              throw new Error('isVAST should be true to parse src as an ad');

            case 3:
              if (!(!src || typeof src !== 'string')) {
                _context.next = 5;
                break;
              }

              throw new Error('src must be a URL string');

            case 5:
              vastClient = new VASTClient(); // Request and parse vast tag

              _context.next = 8;
              return vastClient.get(src);

            case 8:
              data = _context.sent;
              return _context.abrupt("return", data);

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _parseAdXML.apply(this, arguments);
  }

  function defaultIcons() {
    return {
      play: {
        viewbox: '0 0 448 512',
        path: 'M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z'
      },
      pause: {
        viewbox: '0 0 448 512',
        path: 'M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z'
      },
      volume: {
        viewbox: '0 0 576 512',
        path: 'M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zm233.32-51.08c-11.17-7.33-26.18-4.24-33.51 6.95-7.34 11.17-4.22 26.18 6.95 33.51 66.27 43.49 105.82 116.6 105.82 195.58 0 78.98-39.55 152.09-105.82 195.58-11.17 7.32-14.29 22.34-6.95 33.5 7.04 10.71 21.93 14.56 33.51 6.95C528.27 439.58 576 351.33 576 256S528.27 72.43 448.35 19.97zM480 256c0-63.53-32.06-121.94-85.77-156.24-11.19-7.14-26.03-3.82-33.12 7.46s-3.78 26.21 7.41 33.36C408.27 165.97 432 209.11 432 256s-23.73 90.03-63.48 115.42c-11.19 7.14-14.5 22.07-7.41 33.36 6.51 10.36 21.12 15.14 33.12 7.46C447.94 377.94 480 319.54 480 256zm-141.77-76.87c-11.58-6.33-26.19-2.16-32.61 9.45-6.39 11.61-2.16 26.2 9.45 32.61C327.98 228.28 336 241.63 336 256c0 14.38-8.02 27.72-20.92 34.81-11.61 6.41-15.84 21-9.45 32.61 6.43 11.66 21.05 15.8 32.61 9.45 28.23-15.55 45.77-45 45.77-76.88s-17.54-61.32-45.78-76.86z'
      },
      mute: {
        viewbox: '0 0 512 512',
        path: 'M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zM461.64 256l45.64-45.64c6.3-6.3 6.3-16.52 0-22.82l-22.82-22.82c-6.3-6.3-16.52-6.3-22.82 0L416 210.36l-45.64-45.64c-6.3-6.3-16.52-6.3-22.82 0l-22.82 22.82c-6.3 6.3-6.3 16.52 0 22.82L370.36 256l-45.63 45.63c-6.3 6.3-6.3 16.52 0 22.82l22.82 22.82c6.3 6.3 16.52 6.3 22.82 0L416 301.64l45.64 45.64c6.3 6.3 16.52 6.3 22.82 0l22.82-22.82c6.3-6.3 6.3-16.52 0-22.82L461.64 256z'
      },
      fullscreen: {
        viewbox: '0 0 448 512',
        path: 'M0 180V56c0-13.3 10.7-24 24-24h124c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H64v84c0 6.6-5.4 12-12 12H12c-6.6 0-12-5.4-12-12zM288 44v40c0 6.6 5.4 12 12 12h84v84c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12V56c0-13.3-10.7-24-24-24H300c-6.6 0-12 5.4-12 12zm148 276h-40c-6.6 0-12 5.4-12 12v84h-84c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h124c13.3 0 24-10.7 24-24V332c0-6.6-5.4-12-12-12zM160 468v-40c0-6.6-5.4-12-12-12H64v-84c0-6.6-5.4-12-12-12H12c-6.6 0-12 5.4-12 12v124c0 13.3 10.7 24 24 24h124c6.6 0 12-5.4 12-12z'
      }
    };
  }

  function GgEzControls(playerInstance) {
    //get necessary vars from instance
    var container = playerInstance.container,
        _playerInstance$confi = playerInstance.config,
        controls = _playerInstance$confi.controls,
        muted = _playerInstance$confi.muted; // if for any reason controls config is falsey return

    if (!controls) return null; // create the controls container element

    var controlContainer = document.createElement('div');
    controlContainer.id = "".concat(container.id, "-GgEzControls");
    controlContainer.className = 'gg-ez-controls';
    var iconPaths = defaultIcons(); // function to get necessary icon

    var getIcon = function getIcon(_ref, _ref2) {
      var color = _ref.color,
          _ref$play = _ref.play,
          src = _ref$play.src,
          iconColor = _ref$play.color;
      var viewbox = _ref2.viewbox,
          path = _ref2.path;

      if (src) {
        var img = document.createElement('img');
        img.src = src;
        return img;
      }

      var template = document.createElement('template');
      var svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewbox='".concat(viewbox, "' ><path d='").concat(path, "' fill='").concat(iconColor ? iconColor : color, "'></svg>");
      template.innerHTML = svg.trim();
      return template.content.firstChild;
    }; // start creating each button


    if (controls.play) {
      // create button element
      var playPause = document.createElement('div');
      playPause.className = 'gg-ez-control-icon gg-ez-playpause';
      var playIcon = getIcon(controls, iconPaths.play);
      var pauseIcon = getIcon(controls, iconPaths.pause);

      if (playerInstance.player.paused) {
        playIcon.classList.add('active');
      } else {
        pauseIcon.classList.add('active');
      }

      playPause.append(playIcon, pauseIcon);
      playPause.addEventListener('click', function () {
        if (playerInstance.player.paused) {
          pauseIcon.classList.add('active');
          playIcon.classList.remove('active');
        } else {
          playIcon.classList.add('active');
          pauseIcon.classList.remove('active');
        }

        playerInstance.playPause();
      }); // append to correnponding div

      controlContainer.append(playPause);
    }

    if (controls.fullscreen) {
      // create button element
      var fullscreen = document.createElement('div');
      fullscreen.className = 'gg-ez-control-icon gg-ez-fullscreen';
      var fullscreenIcon = getIcon(controls, iconPaths.fullscreen);
      fullscreen.append(fullscreenIcon); // append to correnponding div

      fullscreen.addEventListener('click', function () {
        playerInstance.fullscreenToggle();
      });
      controlContainer.append(fullscreen);
    }

    if (controls.volume) {
      // create button element
      var volume = document.createElement('div');
      volume.className = 'gg-ez-control-icon gg-ez-volume';
      var volumeIcon = getIcon(controls, iconPaths.volume);
      var muteIcon = getIcon(controls, iconPaths.mute);

      if (playerInstance.player.muted) {
        muteIcon.classList.add('active');
      } else {
        volumeIcon.classList.add('active');
      }

      volume.addEventListener('click', function () {
        if (playerInstance.player.muted) {
          volumeIcon.classList.add('active');
          muteIcon.classList.remove('active');
        } else {
          volumeIcon.classList.remove('active');
          muteIcon.classList.add('active');
        }

        playerInstance.muteUnmute();
      });
      volume.append(volumeIcon, muteIcon); // append to correnponding div

      controlContainer.append(volume);
    }

    container.append(controlContainer);
    return document.getElementById(controlContainer.id);
  }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  var GgEzVp = function GgEzVp(options) {
    var _this = this;

    classCallCheck(this, GgEzVp);

    defineProperty(this, "init", function () {
      var _this$config = _this.config,
          containerId = _this$config.container,
          isVAST = _this$config.isVAST;
      var currentContainer = document.getElementById(containerId);

      if (!currentContainer) {
        throw new Error('No container found. Is the id correct?');
      }

      currentContainer.className += ' gg-ez-container';
      console.log({
        currentContainer: currentContainer
      });
      _this.container = currentContainer; //console.log({ parseAdXML });

      _this.renderVideoElement();

      if (isVAST) {
        return _this.fetchVASTData();
      }

      setTimeout(function () {
        return _this.emitter.emit('dataready');
      });
    });

    defineProperty(this, "renderVideoElement", function () {
      _this.on('dataready', function () {
        var controls = _this.config.controls;
        _this.player = renderVideoElement(_this);
        _this.controlContainer = controls ? GgEzControls(_this) : null;
        if (_this.controlContainer) _this.container.addEventListener('mouseenter', function () {
          return _this.controlContainer.classList.add('active');
        });

        _this.container.addEventListener('mouseleave', function () {
          return _this.controlContainer.classList.remove('active');
        });

        _this.ready = true;

        _this.emitter.emit('ready');
      });
    });

    defineProperty(this, "fetchVASTData",
    /*#__PURE__*/
    asyncToGenerator(
    /*#__PURE__*/
    regenerator.mark(function _callee() {
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return parseAdXML(_this);

            case 3:
              _this.VASTData = _context.sent;

              _this.emitter.emit('dataready');

              _context.next = 10;
              break;

            case 7:
              _context.prev = 7;
              _context.t0 = _context["catch"](0);

              _this.emitter.emit('error', _context.t0.toString());

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 7]]);
    })));

    defineProperty(this, "on", function (eventName) {
      var isInternal = ['ready', 'dataready', 'predestroy', 'error'].includes(eventName); // Set internal event listeners

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (isInternal) {
        var teardown = _this.emitter.on.apply(_this.emitter, [eventName].concat(args)); // Store listener for teardown on this.destroy


        _this.instanceListeners.push(teardown);
      } // Set player event listeners


      if (_this.player && (!isInternal || eventName === 'error')) {
        var _this$player;

        (_this$player = _this.player).addEventListener.apply(_this$player, [eventName].concat(args)); // Store listener for teardown on this.destroy


        _this.playerListeners.push([eventName].concat(args));
      }
    });

    defineProperty(this, "instanceListeners", []);

    defineProperty(this, "playerListeners", []);

    defineProperty(this, "playPause", function () {
      if (_this.player.paused) {
        _this.play();
      } else {
        _this.pause();
      }
    });

    defineProperty(this, "play", function () {
      _this.player.play();
    });

    defineProperty(this, "pause", function () {
      _this.player.pause();
    });

    defineProperty(this, "volume", function (val) {
      var value = val < 0 ? 0 : val > 1 ? 1 : value;
      _this.player.volume = value;
    });

    defineProperty(this, "muteUnmute", function () {
      if (_this.player.muted) {
        _this.unmute();
      } else {
        _this.mute();
      }
    });

    defineProperty(this, "mute", function () {
      _this.player.muted = true;
    });

    defineProperty(this, "unmute", function () {
      _this.player.muted = false;
    });

    defineProperty(this, "fullscreenToggle", function () {
      var el = _this.player;

      if (!_this.config.fullscreen) {
        if (el.requestFullscreen) {
          el.requestFullscreen();
        } else if (el.mozRequestFullScreen) {
          /* Firefox */
          el.mozRequestFullScreen();
        } else if (el.webkitRequestFullscreen) {
          /* Chrome, Safari and Opera */
          el.webkitRequestFullscreen();
        } else if (el.msRequestFullscreen) {
          /* IE/Edge */
          el.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          /* Firefox */
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          /* Chrome, Safari and Opera */
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          /* IE/Edge */
          document.msExitFullscreen();
        }
      }
    });

    defineProperty(this, "removeListeners", function () {
      // remove internal listeners
      _this.instanceListeners.forEach(function (teardownFn) {
        teardownFn();
      }); // remove player listeners


      _this.playerListeners.forEach(function (listenerConfig) {
        var _this$player2;

        (_this$player2 = _this.player).removeEventListener.apply(_this$player2, toConsumableArray(listenerConfig));
      });

      _this.instanceListeners = [];
      _this.playerListeners = [];
    });

    defineProperty(this, "destroy", function () {
      _this.emitter.emit('predestroy');

      _this.pause();

      _this.removeListeners();

      _this.container.parentNode.removeChild(_this.container);
    });

    // set up the event emitter
    this.emitter = new nanoevents(); // merge default options with user provided options

    this.config = _objectSpread({}, defaultOptions, {}, options, {
      controls: options.controls !== undefined ? options.controls && _objectSpread({}, defaultOptions.controls, {}, options.controls) : defaultOptions.controls
    }); // flag than can be used from the outside to check if the instance is ready

    this.ready = false; // set vast data default

    this.VASTData = null; // set up any extra processes

    this.init();
  };
  var defaultOptions = {
    container: null,
    width: null,
    height: null,
    src: null,
    controls: defineProperty({
      bg: null,
      color: '#FFFFFF',
      timer: true,
      play: {
        color: null,
        src: null
      },
      stop: {
        color: null,
        src: null
      },
      replay: {
        color: null,
        src: null
      },
      volume: {
        color: null,
        src: null
      },
      fullscreen: {
        color: null,
        src: null
      }
    }, "timer", {
      color: null
    }),
    autoPlay: false,
    volume: 1,
    muted: true,
    poster: null,
    preload: 'auto',
    loop: false,
    isVAST: false,
    fullscreen: false
  };

  return GgEzVp;

}));
//# sourceMappingURL=gg-ez-vp.umd.js.map
