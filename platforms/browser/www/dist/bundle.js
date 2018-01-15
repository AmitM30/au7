/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules, executeModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [], result;
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId])
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules, executeModules);
/******/ 		while(resolves.length)
/******/ 			resolves.shift()();
/******/
/******/ 	};
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// objects to store loaded and loading chunks
/******/ 	var installedChunks = {
/******/ 		1: 0
/******/ 	};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		        if (installedModules[moduleId]) return installedModules[moduleId].exports;
/******/
/******/ 		        var module = installedModules[moduleId] = {
/******/ 		          i: moduleId,
/******/ 		          l: false,
/******/ 		          exports: {}
/******/ 		        };
/******/
/******/ 		        if (!modules[moduleId] && typeof moduleId === 'string') {
/******/ 		          var newModuleId;
/******/ 		          if (modules[newModuleId = moduleId + '.js'] || modules[newModuleId = moduleId + '.ts']) {
/******/ 		            moduleId = newModuleId;
/******/
/******/ 		            installedModules[moduleId] = module;
/******/ 		          }
/******/ 		        }
/******/
/******/ 		        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		        module.l = true;
/******/
/******/ 		        return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		if(installedChunks[chunkId] === 0)
/******/ 			return Promise.resolve();
/******/
/******/ 		// an Promise means "currently loading".
/******/ 		if(installedChunks[chunkId]) {
/******/ 			return installedChunks[chunkId][2];
/******/ 		}
/******/ 		// start chunk loading
/******/ 		var head = document.getElementsByTagName('head')[0];
/******/ 		var script = document.createElement('script');
/******/ 		script.type = 'text/javascript';
/******/ 		script.charset = 'utf-8';
/******/ 		script.async = true;
/******/ 		script.timeout = 120000;
/******/
/******/ 		if (__webpack_require__.nc) {
/******/ 			script.setAttribute("nonce", __webpack_require__.nc);
/******/ 		}
/******/ 		script.src = __webpack_require__.p + "" + chunkId + ".bundle.js";
/******/ 		var timeout = setTimeout(onScriptComplete, 120000);
/******/ 		script.onerror = script.onload = onScriptComplete;
/******/ 		function onScriptComplete() {
/******/ 			// avoid mem leaks in IE.
/******/ 			script.onerror = script.onload = null;
/******/ 			clearTimeout(timeout);
/******/ 			var chunk = installedChunks[chunkId];
/******/ 			if(chunk !== 0) {
/******/ 				if(chunk) chunk[1](new Error('Loading chunk ' + chunkId + ' failed.'));
/******/ 				installedChunks[chunkId] = undefined;
/******/ 			}
/******/ 		};
/******/
/******/ 		var promise = new Promise(function(resolve, reject) {
/******/ 			installedChunks[chunkId] = [resolve, reject];
/******/ 		});
/******/ 		installedChunks[chunkId][2] = promise;
/******/
/******/ 		head.appendChild(script);
/******/ 		return promise;
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AggregateError = AggregateError;
exports.initializePAL = initializePAL;
exports.reset = reset;
function AggregateError(message, innerError, skipIfAlreadyAggregate) {
  if (innerError) {
    if (innerError.innerError && skipIfAlreadyAggregate) {
      return innerError;
    }

    var separator = '\n------------------------------------------------\n';

    message += separator + 'Inner Error:\n';

    if (typeof innerError === 'string') {
      message += 'Message: ' + innerError;
    } else {
      if (innerError.message) {
        message += 'Message: ' + innerError.message;
      } else {
        message += 'Unknown Inner Error Type. Displaying Inner Error as JSON:\n ' + JSON.stringify(innerError, null, '  ');
      }

      if (innerError.stack) {
        message += '\nInner Error Stack:\n' + innerError.stack;
        message += '\nEnd Inner Error Stack';
      }
    }

    message += separator;
  }

  var e = new Error(message);
  if (innerError) {
    e.innerError = innerError;
  }

  return e;
}

var FEATURE = exports.FEATURE = {};

var PLATFORM = exports.PLATFORM = {
  noop: function noop() {},
  eachModule: function eachModule() {},
  moduleName: function (_moduleName) {
    function moduleName(_x) {
      return _moduleName.apply(this, arguments);
    }

    moduleName.toString = function () {
      return _moduleName.toString();
    };

    return moduleName;
  }(function (moduleName) {
    return moduleName;
  })
};

PLATFORM.global = function () {
  if (typeof self !== 'undefined') {
    return self;
  }

  if (typeof global !== 'undefined') {
    return global;
  }

  return new Function('return this')();
}();

var DOM = exports.DOM = {};
var isInitialized = exports.isInitialized = false;
function initializePAL(callback) {
  if (isInitialized) {
    return;
  }
  exports.isInitialized = isInitialized = true;
  if (typeof Object.getPropertyDescriptor !== 'function') {
    Object.getPropertyDescriptor = function (subject, name) {
      var pd = Object.getOwnPropertyDescriptor(subject, name);
      var proto = Object.getPrototypeOf(subject);
      while (typeof pd === 'undefined' && proto !== null) {
        pd = Object.getOwnPropertyDescriptor(proto, name);
        proto = Object.getPrototypeOf(proto);
      }
      return pd;
    };
  }

  callback(PLATFORM, FEATURE, DOM);
}
function reset() {
  exports.isInitialized = isInitialized = false;
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Origin = exports.metadata = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.decorators = decorators;
exports.deprecated = deprecated;
exports.mixin = mixin;
exports.protocol = protocol;

var _aureliaPal = __webpack_require__(0);



function isObject(val) {
  return val && (typeof val === 'function' || (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object');
}

var metadata = exports.metadata = {
  resource: 'aurelia:resource',
  paramTypes: 'design:paramtypes',
  propertyType: 'design:type',
  properties: 'design:properties',
  get: function get(metadataKey, target, targetKey) {
    if (!isObject(target)) {
      return undefined;
    }
    var result = metadata.getOwn(metadataKey, target, targetKey);
    return result === undefined ? metadata.get(metadataKey, Object.getPrototypeOf(target), targetKey) : result;
  },
  getOwn: function getOwn(metadataKey, target, targetKey) {
    if (!isObject(target)) {
      return undefined;
    }
    return Reflect.getOwnMetadata(metadataKey, target, targetKey);
  },
  define: function define(metadataKey, metadataValue, target, targetKey) {
    Reflect.defineMetadata(metadataKey, metadataValue, target, targetKey);
  },
  getOrCreateOwn: function getOrCreateOwn(metadataKey, Type, target, targetKey) {
    var result = metadata.getOwn(metadataKey, target, targetKey);

    if (result === undefined) {
      result = new Type();
      Reflect.defineMetadata(metadataKey, result, target, targetKey);
    }

    return result;
  }
};

var originStorage = new Map();
var unknownOrigin = Object.freeze({ moduleId: undefined, moduleMember: undefined });

var Origin = exports.Origin = function () {
  function Origin(moduleId, moduleMember) {
    

    this.moduleId = moduleId;
    this.moduleMember = moduleMember;
  }

  Origin.get = function get(fn) {
    var origin = originStorage.get(fn);

    if (origin === undefined) {
      _aureliaPal.PLATFORM.eachModule(function (key, value) {
        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
          for (var name in value) {
            var exp = value[name];
            if (exp === fn) {
              originStorage.set(fn, origin = new Origin(key, name));
              return true;
            }
          }
        }

        if (value === fn) {
          originStorage.set(fn, origin = new Origin(key, 'default'));
          return true;
        }

        return false;
      });
    }

    return origin || unknownOrigin;
  };

  Origin.set = function set(fn, origin) {
    originStorage.set(fn, origin);
  };

  return Origin;
}();

function decorators() {
  for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
    rest[_key] = arguments[_key];
  }

  var applicator = function applicator(target, key, descriptor) {
    var i = rest.length;

    if (key) {
      descriptor = descriptor || {
        value: target[key],
        writable: true,
        configurable: true,
        enumerable: true
      };

      while (i--) {
        descriptor = rest[i](target, key, descriptor) || descriptor;
      }

      Object.defineProperty(target, key, descriptor);
    } else {
      while (i--) {
        target = rest[i](target) || target;
      }
    }

    return target;
  };

  applicator.on = applicator;
  return applicator;
}

function deprecated(optionsOrTarget, maybeKey, maybeDescriptor) {
  function decorator(target, key, descriptor) {
    var methodSignature = target.constructor.name + '#' + key;
    var options = maybeKey ? {} : optionsOrTarget || {};
    var message = 'DEPRECATION - ' + methodSignature;

    if (typeof descriptor.value !== 'function') {
      throw new SyntaxError('Only methods can be marked as deprecated.');
    }

    if (options.message) {
      message += ' - ' + options.message;
    }

    return _extends({}, descriptor, {
      value: function deprecationWrapper() {
        if (options.error) {
          throw new Error(message);
        } else {
          console.warn(message);
        }

        return descriptor.value.apply(this, arguments);
      }
    });
  }

  return maybeKey ? decorator(optionsOrTarget, maybeKey, maybeDescriptor) : decorator;
}

function mixin(behavior) {
  var instanceKeys = Object.keys(behavior);

  function _mixin(possible) {
    var decorator = function decorator(target) {
      var resolvedTarget = typeof target === 'function' ? target.prototype : target;

      var i = instanceKeys.length;
      while (i--) {
        var property = instanceKeys[i];
        Object.defineProperty(resolvedTarget, property, {
          value: behavior[property],
          writable: true
        });
      }
    };

    return possible ? decorator(possible) : decorator;
  }

  return _mixin;
}

function alwaysValid() {
  return true;
}
function noCompose() {}

function ensureProtocolOptions(options) {
  if (options === undefined) {
    options = {};
  } else if (typeof options === 'function') {
    options = {
      validate: options
    };
  }

  if (!options.validate) {
    options.validate = alwaysValid;
  }

  if (!options.compose) {
    options.compose = noCompose;
  }

  return options;
}

function createProtocolValidator(validate) {
  return function (target) {
    var result = validate(target);
    return result === true;
  };
}

function createProtocolAsserter(name, validate) {
  return function (target) {
    var result = validate(target);
    if (result !== true) {
      throw new Error(result || name + ' was not correctly implemented.');
    }
  };
}

function protocol(name, options) {
  options = ensureProtocolOptions(options);

  var result = function result(target) {
    var resolvedTarget = typeof target === 'function' ? target.prototype : target;

    options.compose(resolvedTarget);
    result.assert(resolvedTarget);

    Object.defineProperty(resolvedTarget, 'protocol:' + name, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: true
    });
  };

  result.validate = createProtocolValidator(options.validate);
  result.assert = createProtocolAsserter(name, options.validate);

  return result;
}

protocol.create = function (name, options) {
  options = ensureProtocolOptions(options);
  var hidden = 'protocol:' + name;
  var result = function result(target) {
    var decorator = protocol(name, options);
    return target ? decorator(target) : decorator;
  };

  result.decorates = function (obj) {
    return obj[hidden] === true;
  };
  result.validate = createProtocolValidator(options.validate);
  result.assert = createProtocolAsserter(name, options.validate);

  return result;
};

/***/ }),

/***/ 2:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.relativeToFile = relativeToFile;
exports.join = join;
exports.buildQueryString = buildQueryString;
exports.parseQueryString = parseQueryString;

function trimDots(ary) {
  for (var i = 0; i < ary.length; ++i) {
    var part = ary[i];
    if (part === '.') {
      ary.splice(i, 1);
      i -= 1;
    } else if (part === '..') {
      if (i === 0 || i === 1 && ary[2] === '..' || ary[i - 1] === '..') {
        continue;
      } else if (i > 0) {
        ary.splice(i - 1, 2);
        i -= 2;
      }
    }
  }
}

function relativeToFile(name, file) {
  var fileParts = file && file.split('/');
  var nameParts = name.trim().split('/');

  if (nameParts[0].charAt(0) === '.' && fileParts) {
    var normalizedBaseParts = fileParts.slice(0, fileParts.length - 1);
    nameParts.unshift.apply(nameParts, normalizedBaseParts);
  }

  trimDots(nameParts);

  return nameParts.join('/');
}

function join(path1, path2) {
  if (!path1) {
    return path2;
  }

  if (!path2) {
    return path1;
  }

  var schemeMatch = path1.match(/^([^/]*?:)\//);
  var scheme = schemeMatch && schemeMatch.length > 0 ? schemeMatch[1] : '';
  path1 = path1.substr(scheme.length);

  var urlPrefix = void 0;
  if (path1.indexOf('///') === 0 && scheme === 'file:') {
    urlPrefix = '///';
  } else if (path1.indexOf('//') === 0) {
    urlPrefix = '//';
  } else if (path1.indexOf('/') === 0) {
    urlPrefix = '/';
  } else {
    urlPrefix = '';
  }

  var trailingSlash = path2.slice(-1) === '/' ? '/' : '';

  var url1 = path1.split('/');
  var url2 = path2.split('/');
  var url3 = [];

  for (var i = 0, ii = url1.length; i < ii; ++i) {
    if (url1[i] === '..') {
      url3.pop();
    } else if (url1[i] === '.' || url1[i] === '') {
      continue;
    } else {
      url3.push(url1[i]);
    }
  }

  for (var _i = 0, _ii = url2.length; _i < _ii; ++_i) {
    if (url2[_i] === '..') {
      url3.pop();
    } else if (url2[_i] === '.' || url2[_i] === '') {
      continue;
    } else {
      url3.push(url2[_i]);
    }
  }

  return scheme + urlPrefix + url3.join('/') + trailingSlash;
}

var encode = encodeURIComponent;
var encodeKey = function encodeKey(k) {
  return encode(k).replace('%24', '$');
};

function buildParam(key, value, traditional) {
  var result = [];
  if (value === null || value === undefined) {
    return result;
  }
  if (Array.isArray(value)) {
    for (var i = 0, l = value.length; i < l; i++) {
      if (traditional) {
        result.push(encodeKey(key) + '=' + encode(value[i]));
      } else {
        var arrayKey = key + '[' + (_typeof(value[i]) === 'object' && value[i] !== null ? i : '') + ']';
        result = result.concat(buildParam(arrayKey, value[i]));
      }
    }
  } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && !traditional) {
    for (var propertyName in value) {
      result = result.concat(buildParam(key + '[' + propertyName + ']', value[propertyName]));
    }
  } else {
    result.push(encodeKey(key) + '=' + encode(value));
  }
  return result;
}

function buildQueryString(params, traditional) {
  var pairs = [];
  var keys = Object.keys(params || {}).sort();
  for (var i = 0, len = keys.length; i < len; i++) {
    var key = keys[i];
    pairs = pairs.concat(buildParam(key, params[key], traditional));
  }

  if (pairs.length === 0) {
    return '';
  }

  return pairs.join('&');
}

function processScalarParam(existedParam, value) {
  if (Array.isArray(existedParam)) {
    existedParam.push(value);
    return existedParam;
  }
  if (existedParam !== undefined) {
    return [existedParam, value];
  }

  return value;
}

function parseComplexParam(queryParams, keys, value) {
  var currentParams = queryParams;
  var keysLastIndex = keys.length - 1;
  for (var j = 0; j <= keysLastIndex; j++) {
    var key = keys[j] === '' ? currentParams.length : keys[j];
    if (j < keysLastIndex) {
      var prevValue = !currentParams[key] || _typeof(currentParams[key]) === 'object' ? currentParams[key] : [currentParams[key]];
      currentParams = currentParams[key] = prevValue || (isNaN(keys[j + 1]) ? {} : []);
    } else {
      currentParams = currentParams[key] = value;
    }
  }
}

function parseQueryString(queryString) {
  var queryParams = {};
  if (!queryString || typeof queryString !== 'string') {
    return queryParams;
  }

  var query = queryString;
  if (query.charAt(0) === '?') {
    query = query.substr(1);
  }

  var pairs = query.replace(/\+/g, ' ').split('&');
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
    var key = decodeURIComponent(pair[0]);
    if (!key) {
      continue;
    }

    var keys = key.split('][');
    var keysLastIndex = keys.length - 1;

    if (/\[/.test(keys[0]) && /\]$/.test(keys[keysLastIndex])) {
      keys[keysLastIndex] = keys[keysLastIndex].replace(/\]$/, '');
      keys = keys.shift().split('[').concat(keys);
      keysLastIndex = keys.length - 1;
    } else {
      keysLastIndex = 0;
    }

    if (pair.length >= 2) {
      var value = pair[1] ? decodeURIComponent(pair[1]) : '';
      if (keysLastIndex) {
        parseComplexParam(queryParams, keys, value);
      } else {
        queryParams[key] = processScalarParam(queryParams[key], value);
      }
    } else {
      queryParams[key] = true;
    }
  }
  return queryParams;
}

/***/ }),

/***/ 3:
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Loader = exports.TemplateRegistryEntry = exports.TemplateDependency = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _aureliaPath = __webpack_require__(2);

var _aureliaMetadata = __webpack_require__(1);



var TemplateDependency = exports.TemplateDependency = function TemplateDependency(src, name) {
  

  this.src = src;
  this.name = name;
};

var TemplateRegistryEntry = exports.TemplateRegistryEntry = function () {
  function TemplateRegistryEntry(address) {
    

    this.templateIsLoaded = false;
    this.factoryIsReady = false;
    this.resources = null;
    this.dependencies = null;

    this.address = address;
    this.onReady = null;
    this._template = null;
    this._factory = null;
  }

  TemplateRegistryEntry.prototype.addDependency = function addDependency(src, name) {
    var finalSrc = typeof src === 'string' ? (0, _aureliaPath.relativeToFile)(src, this.address) : _aureliaMetadata.Origin.get(src).moduleId;

    this.dependencies.push(new TemplateDependency(finalSrc, name));
  };

  _createClass(TemplateRegistryEntry, [{
    key: 'template',
    get: function get() {
      return this._template;
    },
    set: function set(value) {
      var address = this.address;
      var requires = void 0;
      var current = void 0;
      var src = void 0;
      var dependencies = void 0;

      this._template = value;
      this.templateIsLoaded = true;

      requires = value.content.querySelectorAll('require');
      dependencies = this.dependencies = new Array(requires.length);

      for (var i = 0, ii = requires.length; i < ii; ++i) {
        current = requires[i];
        src = current.getAttribute('from');

        if (!src) {
          throw new Error('<require> element in ' + address + ' has no "from" attribute.');
        }

        dependencies[i] = new TemplateDependency((0, _aureliaPath.relativeToFile)(src, address), current.getAttribute('as'));

        if (current.parentNode) {
          current.parentNode.removeChild(current);
        }
      }
    }
  }, {
    key: 'factory',
    get: function get() {
      return this._factory;
    },
    set: function set(value) {
      this._factory = value;
      this.factoryIsReady = true;
    }
  }]);

  return TemplateRegistryEntry;
}();

var Loader = exports.Loader = function () {
  function Loader() {
    

    this.templateRegistry = {};
  }

  Loader.prototype.map = function map(id, source) {
    throw new Error('Loaders must implement map(id, source).');
  };

  Loader.prototype.normalizeSync = function normalizeSync(moduleId, relativeTo) {
    throw new Error('Loaders must implement normalizeSync(moduleId, relativeTo).');
  };

  Loader.prototype.normalize = function normalize(moduleId, relativeTo) {
    throw new Error('Loaders must implement normalize(moduleId: string, relativeTo: string): Promise<string>.');
  };

  Loader.prototype.loadModule = function loadModule(id) {
    throw new Error('Loaders must implement loadModule(id).');
  };

  Loader.prototype.loadAllModules = function loadAllModules(ids) {
    throw new Error('Loader must implement loadAllModules(ids).');
  };

  Loader.prototype.loadTemplate = function loadTemplate(url) {
    throw new Error('Loader must implement loadTemplate(url).');
  };

  Loader.prototype.loadText = function loadText(url) {
    throw new Error('Loader must implement loadText(url).');
  };

  Loader.prototype.applyPluginToUrl = function applyPluginToUrl(url, pluginName) {
    throw new Error('Loader must implement applyPluginToUrl(url, pluginName).');
  };

  Loader.prototype.addPlugin = function addPlugin(pluginName, implementation) {
    throw new Error('Loader must implement addPlugin(pluginName, implementation).');
  };

  Loader.prototype.getOrCreateTemplateRegistryEntry = function getOrCreateTemplateRegistryEntry(address) {
    return this.templateRegistry[address] || (this.templateRegistry[address] = new TemplateRegistryEntry(address));
  };

  return Loader;
}();

/***/ }),

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("main.js");


/***/ }),

/***/ "aurelia-bootstrapper-webpack":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bootstrap = bootstrap;

__webpack_require__("aurelia-polyfills");

var _aureliaPalBrowser = __webpack_require__("aurelia-pal-browser");

var _aureliaLoaderWebpack = __webpack_require__("aurelia-loader-webpack");

(0, _aureliaPalBrowser.initialize)();

var bootstrapQueue = [];
var sharedLoader = null;
var Aurelia = null;

function onBootstrap(callback) {
  return new Promise(function (resolve, reject) {
    if (sharedLoader) {
      resolve(callback(sharedLoader));
    } else {
      bootstrapQueue.push(function () {
        try {
          resolve(callback(sharedLoader));
        } catch (e) {
          reject(e);
        }
      });
    }
  });
}

function ready(global) {
  return new Promise(function (resolve, reject) {
    if (global.document.readyState === 'complete') {
      resolve(global.document);
    } else {
      global.document.addEventListener('DOMContentLoaded', completed);
      global.addEventListener('load', completed);
    }

    function completed() {
      global.document.removeEventListener('DOMContentLoaded', completed);
      global.removeEventListener('load', completed);
      resolve(global.document);
    }
  });
}

function handleApp(loader, appHost) {
  return config(loader, appHost, appHost.getAttribute('aurelia-app'));
}

function config(loader, appHost, configModuleId) {
  var aurelia = new Aurelia(loader);
  aurelia.host = appHost;
  aurelia.configModuleId = configModuleId || null;

  if (configModuleId) {
    return loader.loadModule(configModuleId).then(function (customConfig) {
      return customConfig.configure(aurelia);
    });
  }

  aurelia.use.standardConfiguration().developmentLogging();

  return aurelia.start().then(function () {
    return aurelia.setRoot();
  });
}

function run() {
  return ready(window).then(function (doc) {
    var appHost = doc.querySelectorAll('[aurelia-app]');
    var loader = new _aureliaLoaderWebpack.WebpackLoader();
    loader.loadModule('aurelia-framework').then(function (m) {
      Aurelia = m.Aurelia;
      for (var i = 0, ii = appHost.length; i < ii; ++i) {
        handleApp(loader, appHost[i]).catch(console.error.bind(console));
      }

      sharedLoader = loader;
      for (var _i = 0, _ii = bootstrapQueue.length; _i < _ii; ++_i) {
        bootstrapQueue[_i]();
      }
      bootstrapQueue = null;
    });
  });
}

function bootstrap(configure) {
  return onBootstrap(function (loader) {
    var aurelia = new Aurelia(loader);
    return configure(aurelia);
  });
}

run();

/***/ }),

/***/ "aurelia-loader-webpack":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebpackLoader = exports.TextTemplateLoader = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.ensureOriginOnExports = ensureOriginOnExports;

var _aureliaMetadata = __webpack_require__(1);

var _aureliaLoader = __webpack_require__(4);

var _aureliaPal = __webpack_require__(0);

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var TextTemplateLoader = exports.TextTemplateLoader = function () {
  function TextTemplateLoader() {
    
  }

  TextTemplateLoader.prototype.loadTemplate = function loadTemplate(loader, entry) {
    return loader.loadText(entry.address).then(function (text) {
      entry.template = _aureliaPal.DOM.createTemplateFromMarkup(text);
    });
  };

  return TextTemplateLoader;
}();

function ensureOriginOnExports(executed, moduleId) {
  var target = executed;
  var key = void 0;
  var exportedValue = void 0;

  if (target.__useDefault) {
    target = target.default;
  }

  _aureliaMetadata.Origin.set(target, new _aureliaMetadata.Origin(moduleId, 'default'));

  if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object') {
    for (key in target) {
      exportedValue = target[key];

      if (typeof exportedValue === 'function') {
        _aureliaMetadata.Origin.set(exportedValue, new _aureliaMetadata.Origin(moduleId, key));
      }
    }
  }

  return executed;
}

var WebpackLoader = exports.WebpackLoader = function (_Loader) {
  _inherits(WebpackLoader, _Loader);

  function WebpackLoader() {
    

    var _this = _possibleConstructorReturn(this, _Loader.call(this));

    _this.moduleRegistry = Object.create(null);
    _this.loaderPlugins = Object.create(null);
    _this.useTemplateLoader(new TextTemplateLoader());
    _this.modulesBeingLoaded = Object.create(null);

    var that = _this;

    _this.addPlugin('template-registry-entry', {
      'fetch': function fetch(address) {
        var entry = that.getOrCreateTemplateRegistryEntry(address);
        return entry.templateIsLoaded ? entry : that.templateLoader.loadTemplate(that, entry).then(function (x) {
          return entry;
        });
      }
    });

    _aureliaPal.PLATFORM.eachModule = function (callback) {
      var registry = __webpack_require__.c;

      for (var moduleId in registry) {
        if (typeof moduleId !== 'string') {
          continue;
        }
        var moduleExports = registry[moduleId].exports;
        if ((typeof moduleExports === 'undefined' ? 'undefined' : _typeof(moduleExports)) !== 'object') {
          continue;
        }
        try {
          if (callback(moduleId, moduleExports)) return;
        } catch (e) {}
      }
    };
    return _this;
  }

  WebpackLoader.prototype._getActualResult = function _getActualResult(result, resolve, reject) {
    try {
      var isAsync = typeof result === 'function' && /cb\(__webpack_require__/.test(result.toString());
      if (!isAsync) {
        return resolve(result);
      }

      return result(function (actual) {
        return resolve(actual);
      });
    } catch (e) {
      reject(e);
    }
  };

  WebpackLoader.prototype._import = function _import(moduleId) {
    var _this2 = this;

    if (this.modulesBeingLoaded[moduleId]) {
      return this.modulesBeingLoaded[moduleId];
    }
    var moduleIdParts = moduleId.split('!');
    var path = moduleIdParts.splice(moduleIdParts.length - 1, 1)[0];
    var loaderPlugin = moduleIdParts.length === 1 ? moduleIdParts[0] : null;

    var action = new Promise(function (resolve, reject) {
      if (loaderPlugin) {
        try {
          return resolve(_this2.loaderPlugins[loaderPlugin].fetch(path));
        } catch (e) {
          return reject(e);
        }
      } else {
        try {
          var result = __webpack_require__(path);
          return _this2._getActualResult(result, resolve, reject);
        } catch (_) {
          delete __webpack_require__.c[path];
        }
        __webpack_require__.e/* require.ensure */(0).then((function (require) {
          var result = __webpack_require__(6)("./" + path);
          return _this2._getActualResult(result, resolve, reject);
        }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
      }
    }).then(function (result) {
      _this2.modulesBeingLoaded[moduleId] = undefined;
      return result;
    });
    this.modulesBeingLoaded[moduleId] = action;
    return action;
  };

  WebpackLoader.prototype.map = function map(id, source) {};

  WebpackLoader.prototype.normalizeSync = function normalizeSync(moduleId, relativeTo) {
    return moduleId;
  };

  WebpackLoader.prototype.normalize = function normalize(moduleId, relativeTo) {
    return Promise.resolve(moduleId);
  };

  WebpackLoader.prototype.useTemplateLoader = function useTemplateLoader(templateLoader) {
    this.templateLoader = templateLoader;
  };

  WebpackLoader.prototype.loadAllModules = function loadAllModules(ids) {
    var loads = [];

    for (var i = 0, ii = ids.length; i < ii; ++i) {
      loads.push(this.loadModule(ids[i]));
    }

    return Promise.all(loads);
  };

  WebpackLoader.prototype.loadModule = function loadModule(id) {
    var _this3 = this;

    var existing = this.moduleRegistry[id];
    if (existing) {
      return Promise.resolve(existing);
    }
    return this._import(id).then(function (m) {
      return _this3.moduleRegistry[id] = ensureOriginOnExports(m, id);
    });
  };

  WebpackLoader.prototype.loadTemplate = function loadTemplate(url) {
    return this._import(this.applyPluginToUrl(url, 'template-registry-entry'));
  };

  WebpackLoader.prototype.loadText = function loadText(url) {
    return this._import(url).then(function (result) {
      if (result instanceof Array && result[0] instanceof Array && result.hasOwnProperty('toString')) {
        return result.toString();
      }

      return result;
    });
  };

  WebpackLoader.prototype.applyPluginToUrl = function applyPluginToUrl(url, pluginName) {
    return pluginName + '!' + url;
  };

  WebpackLoader.prototype.addPlugin = function addPlugin(pluginName, implementation) {
    this.loaderPlugins[pluginName] = implementation;
  };

  return WebpackLoader;
}(_aureliaLoader.Loader);

_aureliaPal.PLATFORM.Loader = WebpackLoader;

/***/ }),

/***/ "aurelia-pal-browser":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._DOM = exports._FEATURE = exports._PLATFORM = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.initialize = initialize;

var _aureliaPal = __webpack_require__(0);

var _PLATFORM = exports._PLATFORM = {
  location: window.location,
  history: window.history,
  addEventListener: function addEventListener(eventName, callback, capture) {
    this.global.addEventListener(eventName, callback, capture);
  },
  removeEventListener: function removeEventListener(eventName, callback, capture) {
    this.global.removeEventListener(eventName, callback, capture);
  },

  performance: window.performance,
  requestAnimationFrame: function requestAnimationFrame(callback) {
    return this.global.requestAnimationFrame(callback);
  }
};

if (typeof FEATURE_NO_IE === 'undefined') {
  var test = function test() {};

  if (test.name === undefined) {
    Object.defineProperty(Function.prototype, 'name', {
      get: function get() {
        var name = this.toString().match(/^\s*function\s*(\S*)\s*\(/)[1];

        Object.defineProperty(this, 'name', { value: name });
        return name;
      }
    });
  }
}

if (typeof FEATURE_NO_IE === 'undefined') {
  if (!('classList' in document.createElement('_')) || document.createElementNS && !('classList' in document.createElementNS('http://www.w3.org/2000/svg', 'g'))) {
    (function () {
      var protoProp = 'prototype';
      var strTrim = String.prototype.trim;
      var arrIndexOf = Array.prototype.indexOf;
      var emptyArray = [];

      var DOMEx = function DOMEx(type, message) {
        this.name = type;
        this.code = DOMException[type];
        this.message = message;
      };

      var checkTokenAndGetIndex = function checkTokenAndGetIndex(classList, token) {
        if (token === '') {
          throw new DOMEx('SYNTAX_ERR', 'An invalid or illegal string was specified');
        }

        if (/\s/.test(token)) {
          throw new DOMEx('INVALID_CHARACTER_ERR', 'String contains an invalid character');
        }

        return arrIndexOf.call(classList, token);
      };

      var ClassList = function ClassList(elem) {
        var trimmedClasses = strTrim.call(elem.getAttribute('class') || '');
        var classes = trimmedClasses ? trimmedClasses.split(/\s+/) : emptyArray;

        for (var i = 0, ii = classes.length; i < ii; ++i) {
          this.push(classes[i]);
        }

        this._updateClassName = function () {
          elem.setAttribute('class', this.toString());
        };
      };

      var classListProto = ClassList[protoProp] = [];

      DOMEx[protoProp] = Error[protoProp];

      classListProto.item = function (i) {
        return this[i] || null;
      };

      classListProto.contains = function (token) {
        token += '';
        return checkTokenAndGetIndex(this, token) !== -1;
      };

      classListProto.add = function () {
        var tokens = arguments;
        var i = 0;
        var ii = tokens.length;
        var token = void 0;
        var updated = false;

        do {
          token = tokens[i] + '';
          if (checkTokenAndGetIndex(this, token) === -1) {
            this.push(token);
            updated = true;
          }
        } while (++i < ii);

        if (updated) {
          this._updateClassName();
        }
      };

      classListProto.remove = function () {
        var tokens = arguments;
        var i = 0;
        var ii = tokens.length;
        var token = void 0;
        var updated = false;
        var index = void 0;

        do {
          token = tokens[i] + '';
          index = checkTokenAndGetIndex(this, token);
          while (index !== -1) {
            this.splice(index, 1);
            updated = true;
            index = checkTokenAndGetIndex(this, token);
          }
        } while (++i < ii);

        if (updated) {
          this._updateClassName();
        }
      };

      classListProto.toggle = function (token, force) {
        token += '';

        var result = this.contains(token);
        var method = result ? force !== true && 'remove' : force !== false && 'add';

        if (method) {
          this[method](token);
        }

        if (force === true || force === false) {
          return force;
        }

        return !result;
      };

      classListProto.toString = function () {
        return this.join(' ');
      };

      Object.defineProperty(Element.prototype, 'classList', {
        get: function get() {
          return new ClassList(this);
        },
        enumerable: true,
        configurable: true
      });
    })();
  } else {
    var testElement = document.createElement('_');
    testElement.classList.add('c1', 'c2');

    if (!testElement.classList.contains('c2')) {
      var createMethod = function createMethod(method) {
        var original = DOMTokenList.prototype[method];

        DOMTokenList.prototype[method] = function (token) {
          for (var i = 0, ii = arguments.length; i < ii; ++i) {
            token = arguments[i];
            original.call(this, token);
          }
        };
      };

      createMethod('add');
      createMethod('remove');
    }

    testElement.classList.toggle('c3', false);

    if (testElement.classList.contains('c3')) {
      (function () {
        var _toggle = DOMTokenList.prototype.toggle;

        DOMTokenList.prototype.toggle = function (token, force) {
          if (1 in arguments && !this.contains(token) === !force) {
            return force;
          }

          return _toggle.call(this, token);
        };
      })();
    }

    testElement = null;
  }
}

if (typeof FEATURE_NO_IE === 'undefined') {
  // @license http://opensource.org/licenses/MIT
  if ('performance' in window === false) {
    window.performance = {};
  }

  if ('now' in window.performance === false) {
    (function () {
      var nowOffset = Date.now();

      if (performance.timing && performance.timing.navigationStart) {
        nowOffset = performance.timing.navigationStart;
      }

      window.performance.now = function now() {
        return Date.now() - nowOffset;
      };
    })();
  }

  _PLATFORM.performance = window.performance;
}

if (typeof FEATURE_NO_IE === 'undefined') {
  (function () {
    var con = window.console = window.console || {};
    var nop = function nop() {};

    if (!con.memory) con.memory = {};
    ('assert,clear,count,debug,dir,dirxml,error,exception,group,' + 'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' + 'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',').forEach(function (m) {
      if (!con[m]) con[m] = nop;
    });

    if (_typeof(con.log) === 'object') {
      'log,info,warn,error,assert,dir,clear,profile,profileEnd'.split(',').forEach(function (method) {
        console[method] = this.bind(console[method], console);
      }, Function.prototype.call);
    }
  })();
}

if (typeof FEATURE_NO_IE === 'undefined') {
  if (!window.CustomEvent || typeof window.CustomEvent !== 'function') {
    var _CustomEvent = function _CustomEvent(event, params) {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };

      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    };

    _CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = _CustomEvent;
  }
}

if (Element && !Element.prototype.matches) {
  var proto = Element.prototype;
  proto.matches = proto.matchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector || proto.webkitMatchesSelector;
}

var _FEATURE = exports._FEATURE = {
  shadowDOM: !!HTMLElement.prototype.attachShadow,
  scopedCSS: 'scoped' in document.createElement('style'),
  htmlTemplateElement: 'content' in document.createElement('template'),
  mutationObserver: !!(window.MutationObserver || window.WebKitMutationObserver),
  ensureHTMLTemplateElement: function ensureHTMLTemplateElement(t) {
    return t;
  }
};

if (typeof FEATURE_NO_IE === 'undefined') {
  (function () {
    var isSVGTemplate = function isSVGTemplate(el) {
      return el.tagName === 'template' && el.namespaceURI === 'http://www.w3.org/2000/svg';
    };

    var fixSVGTemplateElement = function fixSVGTemplateElement(el) {
      var template = el.ownerDocument.createElement('template');
      var attrs = el.attributes;
      var length = attrs.length;
      var attr = void 0;

      el.parentNode.insertBefore(template, el);

      while (length-- > 0) {
        attr = attrs[length];
        template.setAttribute(attr.name, attr.value);
        el.removeAttribute(attr.name);
      }

      el.parentNode.removeChild(el);

      return fixHTMLTemplateElement(template);
    };

    var fixHTMLTemplateElement = function fixHTMLTemplateElement(template) {
      var content = template.content = document.createDocumentFragment();
      var child = void 0;

      while (child = template.firstChild) {
        content.appendChild(child);
      }

      return template;
    };

    var fixHTMLTemplateElementRoot = function fixHTMLTemplateElementRoot(template) {
      var content = fixHTMLTemplateElement(template).content;
      var childTemplates = content.querySelectorAll('template');

      for (var i = 0, ii = childTemplates.length; i < ii; ++i) {
        var child = childTemplates[i];

        if (isSVGTemplate(child)) {
          fixSVGTemplateElement(child);
        } else {
          fixHTMLTemplateElement(child);
        }
      }

      return template;
    };

    if (!_FEATURE.htmlTemplateElement) {
      _FEATURE.ensureHTMLTemplateElement = fixHTMLTemplateElementRoot;
    }
  })();
}

var shadowPoly = window.ShadowDOMPolyfill || null;

var _DOM = exports._DOM = {
  Element: Element,
  SVGElement: SVGElement,
  boundary: 'aurelia-dom-boundary',
  addEventListener: function addEventListener(eventName, callback, capture) {
    document.addEventListener(eventName, callback, capture);
  },
  removeEventListener: function removeEventListener(eventName, callback, capture) {
    document.removeEventListener(eventName, callback, capture);
  },
  adoptNode: function adoptNode(node) {
    return document.adoptNode(node, true);
  },
  createElement: function createElement(tagName) {
    return document.createElement(tagName);
  },
  createTextNode: function createTextNode(text) {
    return document.createTextNode(text);
  },
  createComment: function createComment(text) {
    return document.createComment(text);
  },
  createDocumentFragment: function createDocumentFragment() {
    return document.createDocumentFragment();
  },
  createMutationObserver: function createMutationObserver(callback) {
    return new (window.MutationObserver || window.WebKitMutationObserver)(callback);
  },
  createCustomEvent: function createCustomEvent(eventType, options) {
    return new window.CustomEvent(eventType, options);
  },
  dispatchEvent: function dispatchEvent(evt) {
    document.dispatchEvent(evt);
  },
  getComputedStyle: function getComputedStyle(element) {
    return window.getComputedStyle(element);
  },
  getElementById: function getElementById(id) {
    return document.getElementById(id);
  },
  querySelectorAll: function querySelectorAll(query) {
    return document.querySelectorAll(query);
  },
  nextElementSibling: function nextElementSibling(element) {
    if (element.nextElementSibling) {
      return element.nextElementSibling;
    }
    do {
      element = element.nextSibling;
    } while (element && element.nodeType !== 1);
    return element;
  },
  createTemplateFromMarkup: function createTemplateFromMarkup(markup) {
    var parser = document.createElement('div');
    parser.innerHTML = markup;

    var temp = parser.firstElementChild;
    if (!temp || temp.nodeName !== 'TEMPLATE') {
      throw new Error('Template markup must be wrapped in a <template> element e.g. <template> <!-- markup here --> </template>');
    }

    return _FEATURE.ensureHTMLTemplateElement(temp);
  },
  appendNode: function appendNode(newNode, parentNode) {
    (parentNode || document.body).appendChild(newNode);
  },
  replaceNode: function replaceNode(newNode, node, parentNode) {
    if (node.parentNode) {
      node.parentNode.replaceChild(newNode, node);
    } else if (shadowPoly !== null) {
      shadowPoly.unwrap(parentNode).replaceChild(shadowPoly.unwrap(newNode), shadowPoly.unwrap(node));
    } else {
      parentNode.replaceChild(newNode, node);
    }
  },
  removeNode: function removeNode(node, parentNode) {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    } else if (parentNode) {
      if (shadowPoly !== null) {
        shadowPoly.unwrap(parentNode).removeChild(shadowPoly.unwrap(node));
      } else {
        parentNode.removeChild(node);
      }
    }
  },
  injectStyles: function injectStyles(styles, destination, prepend) {
    var node = document.createElement('style');
    node.innerHTML = styles;
    node.type = 'text/css';

    destination = destination || document.head;

    if (prepend && destination.childNodes.length > 0) {
      destination.insertBefore(node, destination.childNodes[0]);
    } else {
      destination.appendChild(node);
    }

    return node;
  }
};

function initialize() {
  if (_aureliaPal.isInitialized) {
    return;
  }

  (0, _aureliaPal.initializePAL)(function (platform, feature, dom) {
    Object.assign(platform, _PLATFORM);
    Object.assign(feature, _FEATURE);
    Object.assign(dom, _DOM);

    Object.defineProperty(dom, 'title', {
      get: function get() {
        return document.title;
      },
      set: function set(value) {
        document.title = value;
      }
    });

    Object.defineProperty(dom, 'activeElement', {
      get: function get() {
        return document.activeElement;
      }
    });

    Object.defineProperty(platform, 'XMLHttpRequest', {
      get: function get() {
        return platform.global.XMLHttpRequest;
      }
    });
  });
}

/***/ }),

/***/ "aurelia-polyfills":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _aureliaPal = __webpack_require__(0);

if (typeof FEATURE_NO_ES2015 === 'undefined') {

  (function (Object, GOPS) {
    'use strict';

    if (GOPS in Object) return;

    var setDescriptor,
        G = _aureliaPal.PLATFORM.global,
        id = 0,
        random = '' + Math.random(),
        prefix = '__\x01symbol:',
        prefixLength = prefix.length,
        internalSymbol = '__\x01symbol@@' + random,
        DP = 'defineProperty',
        DPies = 'defineProperties',
        GOPN = 'getOwnPropertyNames',
        GOPD = 'getOwnPropertyDescriptor',
        PIE = 'propertyIsEnumerable',
        gOPN = Object[GOPN],
        gOPD = Object[GOPD],
        create = Object.create,
        keys = Object.keys,
        defineProperty = Object[DP],
        $defineProperties = Object[DPies],
        descriptor = gOPD(Object, GOPN),
        ObjectProto = Object.prototype,
        hOP = ObjectProto.hasOwnProperty,
        pIE = ObjectProto[PIE],
        toString = ObjectProto.toString,
        indexOf = Array.prototype.indexOf || function (v) {
      for (var i = this.length; i-- && this[i] !== v;) {}
      return i;
    },
        addInternalIfNeeded = function addInternalIfNeeded(o, uid, enumerable) {
      if (!hOP.call(o, internalSymbol)) {
        defineProperty(o, internalSymbol, {
          enumerable: false,
          configurable: false,
          writable: false,
          value: {}
        });
      }
      o[internalSymbol]['@@' + uid] = enumerable;
    },
        createWithSymbols = function createWithSymbols(proto, descriptors) {
      var self = create(proto);
      if (descriptors !== null && (typeof descriptors === 'undefined' ? 'undefined' : _typeof(descriptors)) === 'object') {
        gOPN(descriptors).forEach(function (key) {
          if (propertyIsEnumerable.call(descriptors, key)) {
            $defineProperty(self, key, descriptors[key]);
          }
        });
      }
      return self;
    },
        copyAsNonEnumerable = function copyAsNonEnumerable(descriptor) {
      var newDescriptor = create(descriptor);
      newDescriptor.enumerable = false;
      return newDescriptor;
    },
        get = function get() {},
        onlyNonSymbols = function onlyNonSymbols(name) {
      return name != internalSymbol && !hOP.call(source, name);
    },
        onlySymbols = function onlySymbols(name) {
      return name != internalSymbol && hOP.call(source, name);
    },
        propertyIsEnumerable = function propertyIsEnumerable(key) {
      var uid = '' + key;
      return onlySymbols(uid) ? hOP.call(this, uid) && this[internalSymbol] && this[internalSymbol]['@@' + uid] : pIE.call(this, key);
    },
        setAndGetSymbol = function setAndGetSymbol(uid) {
      var descriptor = {
        enumerable: false,
        configurable: true,
        get: get,
        set: function set(value) {
          setDescriptor(this, uid, {
            enumerable: false,
            configurable: true,
            writable: true,
            value: value
          });
          addInternalIfNeeded(this, uid, true);
        }
      };
      defineProperty(ObjectProto, uid, descriptor);
      return source[uid] = defineProperty(Object(uid), 'constructor', sourceConstructor);
    },
        _Symbol = function _Symbol2(description) {
      if (this && this !== G) {
        throw new TypeError('Symbol is not a constructor');
      }
      return setAndGetSymbol(prefix.concat(description || '', random, ++id));
    },
        source = create(null),
        sourceConstructor = { value: _Symbol },
        sourceMap = function sourceMap(uid) {
      return source[uid];
    },
        $defineProperty = function defineProp(o, key, descriptor) {
      var uid = '' + key;
      if (onlySymbols(uid)) {
        setDescriptor(o, uid, descriptor.enumerable ? copyAsNonEnumerable(descriptor) : descriptor);
        addInternalIfNeeded(o, uid, !!descriptor.enumerable);
      } else {
        defineProperty(o, key, descriptor);
      }
      return o;
    },
        $getOwnPropertySymbols = function getOwnPropertySymbols(o) {
      var cof = toString.call(o);
      o = cof === '[object String]' ? o.split('') : Object(o);
      return gOPN(o).filter(onlySymbols).map(sourceMap);
    };

    descriptor.value = $defineProperty;
    defineProperty(Object, DP, descriptor);

    descriptor.value = $getOwnPropertySymbols;
    defineProperty(Object, GOPS, descriptor);

    var cachedWindowNames = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' ? Object.getOwnPropertyNames(window) : [];
    var originalObjectGetOwnPropertyNames = Object.getOwnPropertyNames;
    descriptor.value = function getOwnPropertyNames(o) {
      if (toString.call(o) === '[object Window]') {
        try {
          return originalObjectGetOwnPropertyNames(o);
        } catch (e) {
          return [].concat([], cachedWindowNames);
        }
      }
      return gOPN(o).filter(onlyNonSymbols);
    };
    defineProperty(Object, GOPN, descriptor);

    descriptor.value = function defineProperties(o, descriptors) {
      var symbols = $getOwnPropertySymbols(descriptors);
      if (symbols.length) {
        keys(descriptors).concat(symbols).forEach(function (uid) {
          if (propertyIsEnumerable.call(descriptors, uid)) {
            $defineProperty(o, uid, descriptors[uid]);
          }
        });
      } else {
        $defineProperties(o, descriptors);
      }
      return o;
    };
    defineProperty(Object, DPies, descriptor);

    descriptor.value = propertyIsEnumerable;
    defineProperty(ObjectProto, PIE, descriptor);

    descriptor.value = _Symbol;
    defineProperty(G, 'Symbol', descriptor);

    descriptor.value = function (key) {
      var uid = prefix.concat(prefix, key, random);
      return uid in ObjectProto ? source[uid] : setAndGetSymbol(uid);
    };
    defineProperty(_Symbol, 'for', descriptor);

    descriptor.value = function (symbol) {
      return hOP.call(source, symbol) ? symbol.slice(prefixLength * 2, -random.length) : void 0;
    };
    defineProperty(_Symbol, 'keyFor', descriptor);

    descriptor.value = function getOwnPropertyDescriptor(o, key) {
      var descriptor = gOPD(o, key);
      if (descriptor && onlySymbols(key)) {
        descriptor.enumerable = propertyIsEnumerable.call(o, key);
      }
      return descriptor;
    };
    defineProperty(Object, GOPD, descriptor);

    descriptor.value = function (proto, descriptors) {
      return arguments.length === 1 ? create(proto) : createWithSymbols(proto, descriptors);
    };
    defineProperty(Object, 'create', descriptor);

    descriptor.value = function () {
      var str = toString.call(this);
      return str === '[object String]' && onlySymbols(this) ? '[object Symbol]' : str;
    };
    defineProperty(ObjectProto, 'toString', descriptor);

    try {
      setDescriptor = create(defineProperty({}, prefix, {
        get: function get() {
          return defineProperty(this, prefix, { value: false })[prefix];
        }
      }))[prefix] || defineProperty;
    } catch (o_O) {
      setDescriptor = function setDescriptor(o, key, descriptor) {
        var protoDescriptor = gOPD(ObjectProto, key);
        delete ObjectProto[key];
        defineProperty(o, key, descriptor);
        defineProperty(ObjectProto, key, protoDescriptor);
      };
    }
  })(Object, 'getOwnPropertySymbols');

  (function (O, S) {
    var dP = O.defineProperty,
        ObjectProto = O.prototype,
        toString = ObjectProto.toString,
        toStringTag = 'toStringTag',
        descriptor;
    ['iterator', 'match', 'replace', 'search', 'split', 'hasInstance', 'isConcatSpreadable', 'unscopables', 'species', 'toPrimitive', toStringTag].forEach(function (name) {
      if (!(name in Symbol)) {
        dP(Symbol, name, { value: Symbol(name) });
        switch (name) {
          case toStringTag:
            descriptor = O.getOwnPropertyDescriptor(ObjectProto, 'toString');
            descriptor.value = function () {
              var str = toString.call(this),
                  tst = typeof this === 'undefined' || this === null ? undefined : this[Symbol.toStringTag];
              return typeof tst === 'undefined' ? str : '[object ' + tst + ']';
            };
            dP(ObjectProto, 'toString', descriptor);
            break;
        }
      }
    });
  })(Object, Symbol);

  (function (Si, AP, SP) {

    function returnThis() {
      return this;
    }

    if (!AP[Si]) AP[Si] = function () {
      var i = 0,
          self = this,
          iterator = {
        next: function next() {
          var done = self.length <= i;
          return done ? { done: done } : { done: done, value: self[i++] };
        }
      };
      iterator[Si] = returnThis;
      return iterator;
    };

    if (!SP[Si]) SP[Si] = function () {
      var fromCodePoint = String.fromCodePoint,
          self = this,
          i = 0,
          length = self.length,
          iterator = {
        next: function next() {
          var done = length <= i,
              c = done ? '' : fromCodePoint(self.codePointAt(i));
          i += c.length;
          return done ? { done: done } : { done: done, value: c };
        }
      };
      iterator[Si] = returnThis;
      return iterator;
    };
  })(Symbol.iterator, Array.prototype, String.prototype);
}

if (typeof FEATURE_NO_ES2015 === 'undefined') {

  Number.isNaN = Number.isNaN || function (value) {
    return value !== value;
  };

  Number.isFinite = Number.isFinite || function (value) {
    return typeof value === "number" && isFinite(value);
  };
}

if (!String.prototype.endsWith || function () {
  try {
    return !"ab".endsWith("a", 1);
  } catch (e) {
    return true;
  }
}()) {
  String.prototype.endsWith = function (searchString, position) {
    var subjectString = this.toString();
    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
      position = subjectString.length;
    }
    position -= searchString.length;
    var lastIndex = subjectString.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
}

if (!String.prototype.startsWith || function () {
  try {
    return !"ab".startsWith("b", 1);
  } catch (e) {
    return true;
  }
}()) {
  String.prototype.startsWith = function (searchString, position) {
    position = position || 0;
    return this.substr(position, searchString.length) === searchString;
  };
}

if (typeof FEATURE_NO_ES2015 === 'undefined') {

  if (!Array.from) {
    Array.from = function () {
      var toInteger = function toInteger(it) {
        return isNaN(it = +it) ? 0 : (it > 0 ? Math.floor : Math.ceil)(it);
      };
      var toLength = function toLength(it) {
        return it > 0 ? Math.min(toInteger(it), 0x1fffffffffffff) : 0;
      };
      var iterCall = function iterCall(iter, fn, val, index) {
        try {
          return fn(val, index);
        } catch (E) {
          if (typeof iter.return == 'function') iter.return();
          throw E;
        }
      };

      return function from(arrayLike) {
        var O = Object(arrayLike),
            C = typeof this == 'function' ? this : Array,
            aLen = arguments.length,
            mapfn = aLen > 1 ? arguments[1] : undefined,
            mapping = mapfn !== undefined,
            index = 0,
            iterFn = O[Symbol.iterator],
            length,
            result,
            step,
            iterator;
        if (mapping) mapfn = mapfn.bind(aLen > 2 ? arguments[2] : undefined);
        if (iterFn != undefined && !Array.isArray(arrayLike)) {
          for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
            result[index] = mapping ? iterCall(iterator, mapfn, step.value, index) : step.value;
          }
        } else {
          length = toLength(O.length);
          for (result = new C(length); length > index; index++) {
            result[index] = mapping ? mapfn(O[index], index) : O[index];
          }
        }
        result.length = index;
        return result;
      };
    }();
  }

  if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(predicate) {
        if (this === null) {
          throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
          value = list[i];
          if (predicate.call(thisArg, value, i, list)) {
            return value;
          }
        }
        return undefined;
      }
    });
  }

  if (!Array.prototype.findIndex) {
    Object.defineProperty(Array.prototype, 'findIndex', {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(predicate) {
        if (this === null) {
          throw new TypeError('Array.prototype.findIndex called on null or undefined');
        }
        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
          value = list[i];
          if (predicate.call(thisArg, value, i, list)) {
            return i;
          }
        }
        return -1;
      }
    });
  }
}

if (typeof FEATURE_NO_ES2016 === 'undefined' && !Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    configurable: true,
    writable: true,
    enumerable: false,
    value: function value(searchElement) {
      var O = Object(this);
      var len = parseInt(O.length) || 0;
      if (len === 0) {
        return false;
      }
      var n = parseInt(arguments[1]) || 0;
      var k;
      if (n >= 0) {
        k = n;
      } else {
        k = len + n;
        if (k < 0) {
          k = 0;
        }
      }
      var currentElement;
      while (k < len) {
        currentElement = O[k];
        if (searchElement === currentElement || searchElement !== searchElement && currentElement !== currentElement) {
          return true;
        }
        k++;
      }
      return false;
    }
  });
}

if (typeof FEATURE_NO_ES2015 === 'undefined') {

  (function () {
    var needsFix = false;

    try {
      var s = Object.keys('a');
      needsFix = s.length !== 1 || s[0] !== '0';
    } catch (e) {
      needsFix = true;
    }

    if (needsFix) {
      Object.keys = function () {
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !{ toString: null }.propertyIsEnumerable('toString'),
            dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'],
            dontEnumsLength = dontEnums.length;

        return function (obj) {
          if (obj === undefined || obj === null) {
            throw TypeError('Cannot convert undefined or null to object');
          }

          obj = Object(obj);

          var result = [],
              prop,
              i;

          for (prop in obj) {
            if (hasOwnProperty.call(obj, prop)) {
              result.push(prop);
            }
          }

          if (hasDontEnumBug) {
            for (i = 0; i < dontEnumsLength; i++) {
              if (hasOwnProperty.call(obj, dontEnums[i])) {
                result.push(dontEnums[i]);
              }
            }
          }

          return result;
        };
      }();
    }
  })();

  (function (O) {
    if ('assign' in O) {
      return;
    }

    O.defineProperty(O, 'assign', {
      configurable: true,
      writable: true,
      value: function () {
        var gOPS = O.getOwnPropertySymbols,
            pIE = O.propertyIsEnumerable,
            filterOS = gOPS ? function (self) {
          return gOPS(self).filter(pIE, self);
        } : function () {
          return Array.prototype;
        };

        return function assign(where) {
          if (gOPS && !(where instanceof O)) {
            console.warn('problematic Symbols', where);
          }

          function set(keyOrSymbol) {
            where[keyOrSymbol] = arg[keyOrSymbol];
          }

          for (var i = 1, ii = arguments.length; i < ii; ++i) {
            var arg = arguments[i];

            if (arg === null || arg === undefined) {
              continue;
            }

            O.keys(arg).concat(filterOS(arg)).forEach(set);
          }

          return where;
        };
      }()
    });
  })(Object);
}

if (typeof FEATURE_NO_ES2015 === 'undefined') {

  (function (global) {
    var i;

    var defineProperty = Object.defineProperty,
        is = function is(a, b) {
      return a === b || a !== a && b !== b;
    };

    if (typeof WeakMap == 'undefined') {
      global.WeakMap = createCollection({
        'delete': sharedDelete,

        clear: sharedClear,

        get: sharedGet,

        has: mapHas,

        set: sharedSet
      }, true);
    }

    if (typeof Map == 'undefined' || typeof new Map().values !== 'function' || !new Map().values().next) {
      var _createCollection;

      global.Map = createCollection((_createCollection = {
        'delete': sharedDelete,

        has: mapHas,

        get: sharedGet,

        set: sharedSet,

        keys: sharedKeys,

        values: sharedValues,

        entries: mapEntries,

        forEach: sharedForEach,

        clear: sharedClear
      }, _createCollection[Symbol.iterator] = mapEntries, _createCollection));
    }

    if (typeof Set == 'undefined' || typeof new Set().values !== 'function' || !new Set().values().next) {
      var _createCollection2;

      global.Set = createCollection((_createCollection2 = {
        has: setHas,

        add: sharedAdd,

        'delete': sharedDelete,

        clear: sharedClear,

        keys: sharedValues,
        values: sharedValues,

        entries: setEntries,

        forEach: sharedForEach
      }, _createCollection2[Symbol.iterator] = sharedValues, _createCollection2));
    }

    if (typeof WeakSet == 'undefined') {
      global.WeakSet = createCollection({
        'delete': sharedDelete,

        add: sharedAdd,

        clear: sharedClear,

        has: setHas
      }, true);
    }

    function createCollection(proto, objectOnly) {
      function Collection(a) {
        if (!this || this.constructor !== Collection) return new Collection(a);
        this._keys = [];
        this._values = [];
        this._itp = [];
        this.objectOnly = objectOnly;

        if (a) init.call(this, a);
      }

      if (!objectOnly) {
        defineProperty(proto, 'size', {
          get: sharedSize
        });
      }

      proto.constructor = Collection;
      Collection.prototype = proto;

      return Collection;
    }

    function init(a) {
      var i;

      if (this.add) a.forEach(this.add, this);else a.forEach(function (a) {
          this.set(a[0], a[1]);
        }, this);
    }

    function sharedDelete(key) {
      if (this.has(key)) {
        this._keys.splice(i, 1);
        this._values.splice(i, 1);

        this._itp.forEach(function (p) {
          if (i < p[0]) p[0]--;
        });
      }

      return -1 < i;
    };

    function sharedGet(key) {
      return this.has(key) ? this._values[i] : undefined;
    }

    function has(list, key) {
      if (this.objectOnly && key !== Object(key)) throw new TypeError("Invalid value used as weak collection key");

      if (key != key || key === 0) for (i = list.length; i-- && !is(list[i], key);) {} else i = list.indexOf(key);
      return -1 < i;
    }

    function setHas(value) {
      return has.call(this, this._values, value);
    }

    function mapHas(value) {
      return has.call(this, this._keys, value);
    }

    function sharedSet(key, value) {
      this.has(key) ? this._values[i] = value : this._values[this._keys.push(key) - 1] = value;
      return this;
    }

    function sharedAdd(value) {
      if (!this.has(value)) this._values.push(value);
      return this;
    }

    function sharedClear() {
      (this._keys || 0).length = this._values.length = 0;
    }

    function sharedKeys() {
      return sharedIterator(this._itp, this._keys);
    }

    function sharedValues() {
      return sharedIterator(this._itp, this._values);
    }

    function mapEntries() {
      return sharedIterator(this._itp, this._keys, this._values);
    }

    function setEntries() {
      return sharedIterator(this._itp, this._values, this._values);
    }

    function sharedIterator(itp, array, array2) {
      var _ref;

      var p = [0],
          done = false;
      itp.push(p);
      return _ref = {}, _ref[Symbol.iterator] = function () {
        return this;
      }, _ref.next = function next() {
        var v,
            k = p[0];
        if (!done && k < array.length) {
          v = array2 ? [array[k], array2[k]] : array[k];
          p[0]++;
        } else {
          done = true;
          itp.splice(itp.indexOf(p), 1);
        }
        return { done: done, value: v };
      }, _ref;
    }

    function sharedSize() {
      return this._values.length;
    }

    function sharedForEach(callback, context) {
      var it = this.entries();
      for (;;) {
        var r = it.next();
        if (r.done) break;
        callback.call(context, r.value[1], r.value[0], this);
      }
    }
  })(_aureliaPal.PLATFORM.global);
}

if (typeof FEATURE_NO_ES2015 === 'undefined') {
  (function () {

    var bind = Function.prototype.bind;

    if (typeof _aureliaPal.PLATFORM.global.Reflect === 'undefined') {
      _aureliaPal.PLATFORM.global.Reflect = {};
    }

    if (typeof Reflect.defineProperty !== 'function') {
      Reflect.defineProperty = function (target, propertyKey, descriptor) {
        if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object' ? target === null : typeof target !== 'function') {
          throw new TypeError('Reflect.defineProperty called on non-object');
        }
        try {
          Object.defineProperty(target, propertyKey, descriptor);
          return true;
        } catch (e) {
          return false;
        }
      };
    }

    if (typeof Reflect.construct !== 'function') {
      Reflect.construct = function (Target, args) {
        if (args) {
          switch (args.length) {
            case 0:
              return new Target();
            case 1:
              return new Target(args[0]);
            case 2:
              return new Target(args[0], args[1]);
            case 3:
              return new Target(args[0], args[1], args[2]);
            case 4:
              return new Target(args[0], args[1], args[2], args[3]);
          }
        }

        var a = [null];
        a.push.apply(a, args);
        return new (bind.apply(Target, a))();
      };
    }

    if (typeof Reflect.ownKeys !== 'function') {
      Reflect.ownKeys = function (o) {
        return Object.getOwnPropertyNames(o).concat(Object.getOwnPropertySymbols(o));
      };
    }
  })();
}

if (typeof FEATURE_NO_ESNEXT === 'undefined') {
  (function () {

    var emptyMetadata = Object.freeze({});
    var metadataContainerKey = '__metadata__';

    if (typeof Reflect.getOwnMetadata !== 'function') {
      Reflect.getOwnMetadata = function (metadataKey, target, targetKey) {
        if (target.hasOwnProperty(metadataContainerKey)) {
          return (target[metadataContainerKey][targetKey] || emptyMetadata)[metadataKey];
        }
      };
    }

    if (typeof Reflect.defineMetadata !== 'function') {
      Reflect.defineMetadata = function (metadataKey, metadataValue, target, targetKey) {
        var metadataContainer = target.hasOwnProperty(metadataContainerKey) ? target[metadataContainerKey] : target[metadataContainerKey] = {};
        var targetContainer = metadataContainer[targetKey] || (metadataContainer[targetKey] = {});
        targetContainer[metadataKey] = metadataValue;
      };
    }

    if (typeof Reflect.metadata !== 'function') {
      Reflect.metadata = function (metadataKey, metadataValue) {
        return function (target, targetKey) {
          Reflect.defineMetadata(metadataKey, metadataValue, target, targetKey);
        };
      };
    }
  })();
}

/***/ }),

/***/ "main.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aurelia_bootstrapper_webpack__ = __webpack_require__("aurelia-bootstrapper-webpack");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aurelia_bootstrapper_webpack___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_aurelia_bootstrapper_webpack__);
/* harmony export (immutable) */ __webpack_exports__["configure"] = configure;
/* eslint-disable no-undef */


function configure(aurelia) {
  aurelia.use.basicConfiguration().developmentLogging();

  aurelia.start().then(function () {
    aurelia.setRoot('app', document.body);
  });
}

/***/ })

/******/ });