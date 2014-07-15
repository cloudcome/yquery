define("yquery/1.7.1/yquery-debug", ["yquery/1.7.1/0-core-debug", "yquery/1.7.1/1-dom-debug", "yquery/1.7.1/2-modify-debug", "yquery/1.7.1/3-attr-prop-debug", "yquery/1.7.1/4-pos-size-debug", "yquery/1.7.1/5-event-debug", "yquery/1.7.1/6-animate-debug", "yquery/1.7.1/7-ajax-debug", "yquery/1.7.1/Deferred-debug"], function(require, exports, module) {
  /*!
   * 云淡然的Yquery
   * @author ydr.me
   * @version 1.7.0
   * 2014年7月15日10:03:28
   */
  /**
   * v1.5
   * 重写
   * 更加规范的向HTML5靠拢
   * 使用querySelectorAll来获取DOM元素
   * 使用insertAdjacent...来操作DOM元素
   * 使用classList来操作class
   *
   * v1.6
   * 使用XMLHttpRequest来操作ajax，适合发布任何data数据（包括字符串、二进制以及文件）
   * 使用FormData传输数据会自动替换为POST请求
   * DOM匹配以及操作DOM的attribute和property
   * 获取各种client/offset/scroll/width/height/inner/outer距离
   * 获取和操作DOM的css/style
   * 事件委托与事件触发，事件委托无法触发！？
   *
   * v1.7
   * 2014年5月27日14:24:22
   * 完善了事件委托
   * 2014年6月13日18:28:13
   * 完善事件委托、精简API、基本动画
   * 2014年6月16日17:24:03
   * data、attr、prop完善
   * 2014年6月17日10:01:12
   * 事件绑定bind，触屏tap、swipe
   * 2014年6月21日14:22:29
   * 重写了实例化、初始化方法
   * 2014年6月24日13:58:54
   * 对$.fn.css()增加了容错性，与jquery一致了
   * 2014年6月27日10:23:39
   * siblings方法可以传选择器了
   * 2014年7月2日14:34:01
   * 增加了几个静态方法：isEmptyObject/toHumbString
   * 增加了几个原型方法：tapick=tap + click、taphold
   * 2014年7月5日12:53:26
   * 增加clone
   * 2014年7月9日19:57:49
   * 增加自定义事件，同时可以trigger自定义事件了
   * 2014年7月10日16:34:29
   * 修正了 offset 的错误
   * 2014年7月12日14:17:25
   * 完善创建事件
   * 2014年7月14日18:27:50
   * 发布到Github，适配到spm
   * 2014年7月15日10:03:37
   * 模块化
   *
   */
  var $ = require("yquery/1.7.1/0-core-debug");
  require("yquery/1.7.1/1-dom-debug");
  require("yquery/1.7.1/2-modify-debug");
  require("yquery/1.7.1/3-attr-prop-debug");
  require("yquery/1.7.1/4-pos-size-debug");
  require("yquery/1.7.1/5-event-debug");
  require("yquery/1.7.1/6-animate-debug");
  require("yquery/1.7.1/7-ajax-debug");
  $.VERSION = '1.7.1';
  $.AUTHOR = 'ydr.me';
  module.exports = $;
});
define("yquery/1.7.1/0-core-debug", [], function(require, exports, module) {
  // 0-core.js
  // 2014年7月15日09:52:56
  /**
   * 初始化返回Yquery对象
   * @param  {String/Element/NodeList/Array/Yquery/Function} selector 选择器、字符串、元素、元素集合、数组、Yquery、回调
   * @param  {Element/Yquery}                                context  上下文
   * @return Yquery实例
   * @version 1.0
   * 2014年7月15日09:54:53
   */
  var udf,
    // id键
    idKey = '__yquery__',
    // 唯一id
    id = 0,
    win = window,
    doc = win.document,
    browserPrefix = ['', 'webkit', 'moz', 'ms', 'o', 'khtml'],
    regNumericCss = /width|height|top|right|bottom|left/i,
    regNumeric = /^-?([1-9]\d*|0)(\.\d*[1-9])?$/,
    regTag = /<.*?>/,
    $ = function(selector, context) {
      return new Yquery(selector, context);
    };
  $.fn = Yquery.prototype = {};
  $.fn.constructor = Yquery;
  $.fn.extend = function(obj) {
    $.each(obj, function(key, val) {
      $.fn[key] = val;
    });
  };
  /**
   * 方法扩展 和 合并多个对象
   * @version 1.1
   * @return 合并后的对象
   * 2013年6月27日16:11:23
   * 2013年12月2日16:44:51
   */
  $.extend = function() {
    var A = arguments,
      A0 = A[0],
      i = 1,
      j = A.length,
      k;
    if (j == 1) {
      for (i in A0) {
        $[i] = A0[i];
      }
    } else {
      // 循环参数，从第1个开始（起始为0）
      for (; i < j; i++) {
        // 循环第i个对象
        for (k in A[i]) {
          A0[k] = A[i][k];
        }
      }
      return A0;
    }
  };
  // is方法
  ['Array', 'Object', 'Function', 'String', 'Element', 'Number'].forEach(function(t) {
    $['is' + t] = function(any) {
      return _type(any) == t.toLowerCase();
    };
  });
  $.extend({
    _id: idKey,
    // 文档是否准备完毕
    isReady: !1,
    isYquery: _isYquery,
    // 文档准备完毕之后运行的事件队列
    readyFunctions: [],
    noop: function() {},
    each: _each,
    type: _type,
    html5: _html5,
    css3: _css3,
    inArray: _inArray,
    isNumeric: _isNumeric,
    toHumpString: _toHumpString,
    parseFloat: _parseFloat,
    isEmptyObject: _isEmptyObject
  });
  module.exports = $;
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////[ private API ]///////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**
   * each 循环遍历
   * @version 1.2
   * @param {object}    obj 要遍历的对象
   * @param {function}  callback 遍历对象的每个回调
   * @param {Boolean}   isReverse 是否反转逆序遍历，只针对数组
   * @return {undefined}
   * 2013年6月27日14:04:37
   * 2013年6月28日9:42:17
   * 2013年12月26日11:21:57
   * 2014年6月16日11:02:16
   */
  function _each(obj, callback, isReverse) {
    var i,
      j,
      type = _type(obj);
    if (type == 'array') {
      if (isReverse) {
        for (i = obj.length - 1; i >= 0; i--) {
          if (callback.call(obj[i], i, obj[i]) === false) {
            break;
          }
        }
      } else {
        for (i = 0, j = obj.length; i < j; i++) {
          if (callback.call(obj[i], i, obj[i]) === false) {
            break;
          }
        }
      }
    } else if (type === 'object') {
      for (i in obj) {
        if (obj.hasOwnProperty(i)) {
          if (callback.call(obj[i], i, obj[i]) === false) {
            break;
          }
        }
      }
    }
    return obj;
  }
  /**
   * 初始化
   * @param {String/Function/Element/Object} selector   选择器/ready方法/元素对象/元素yquery对象
   * @param {Element}                        context    上下文
   * @return this
   * @version 1.1
   * 2013年12月29日1:41:59
   * 2014年6月21日14:38:01
   */
  function Yquery(selector, context) {
    var nodes = [],
      type = _type(selector);
    context = context || doc;
    if (_isYquery(context)) context = context.length ? context[0] : doc;
    // 如果 selector 是字符串
    // 如： $('#id')/$('.class')/$('div')/$('#id .class div') 等原生支持的选择器
    if (type == 'string') {
      selector = selector.trim();
      nodes = selector === '' ? [context] : regTag.test(selector) ? _parseElement(selector) : context.querySelectorAll(selector);
    }
    // 如果 selector 是元素或数组或者是nodelist
    // 如： $(document.body) 、$([document.body, document.links[0]]) 、 $(document.links)
    else if (type == 'element' || type == 'array' || type == 'nodelist') {
      nodes = selector;
    }
    // 如果 selector 是 window 或 document
    // 如： $(window) / $(document)
    else if (selector == win || selector == doc) {
      nodes = selector;
      this.length = 1;
    }
    // 如果 selector 是 回调函数
    // 如： $(function(){});
    else if (type == 'function') {
      if ($.isReady) {
        selector();
      } else {
        $.readyFunctions.push(selector);
      }
      return;
    }
    // 如果 selector 是 yquery 对象
    // 如： $($('body'))
    else if (_isYquery(selector)) {
      return selector;
    }
    // 将数组转换为数组
    return _makeArray(this, nodes);
  }
  /**
   * 判断数据类型
   * @link http://javascript.ruanyifeng.com/stdlib/object.html#toc3
   * @param {*} any Anything
   * @return {String} 数据类型
   * 包括：array/boolean/element/function/nan/
   *     null/number/object/regexp/string/undefined/window
   * @version 1.5
   * 2013年6月28日12:42:11
   * 2013年7月1日18:08:02
   * 2013年7月24日23:30:01
   * 2013年12月3日9:45:13
   * 2014年2月11日22:14:36
   * 2014年6月16日17:40:23
   */
  function _type(any) {
    if (any === win) return 'window';
    else if (any === doc) return 'document';
    else if (any === udf) return 'undefined';
    else if (any === null) return 'null';
    else if (Array.isArray(any)) return 'array';
    var ret = Object.prototype.toString.call(any).match(/\s(.*?)\]/i)[1].toLowerCase();
    if (/element/.test(ret)) return 'element';
    else if (isNaN(any) && ret === 'number') return 'nan';
    return ret;
  }
  /**
   * 判断是否为yquery对象
   * @param {*} object 任何
   * @return {Boolean}
   * @version 1.1
   * 2013年12月20日10:43:31
   * 2014年6月21日14:39:07
   */
  function _isYquery(object) {
    return object !== udf && object !== null && object.constructor === Yquery;
  }
  /**
   * 更合理的整数格式化
   * @param  {*} obj  传入对象
   * @return {Number} 输出0或合法值
   * @version 1.0
   * 2014年7月3日10:47:16
   */
  function _parseFloat(obj) {
    obj = parseFloat(obj);
    return _type(obj) === 'nan' ? 0 : obj;
  }
  /**
   * 生成唯一ID用来标识DOM
   * @return {Number} 数值
   */
  function _generatorId() {
    return id++;
  }
  /**
   * 把NodeList转换为数组
   * @link http://haiyupeter.iteye.com/blog/1513403
   * @param {Object} object the
   * @param {Object} object NodeList
   * @return {Array} the
   * @version 1.3
   * 2013年6月27日14:04:37
   * 2013年6月28日9:40:48
   * 2013年12月3日10:31:02
   * 2014年7月6日10:08:19
   */
  function _makeArray(the, object) {
    // FORM表单也有length属性，坑
    if (the.length === 1 || object.length === udf || object.nodeName === 'FORM') {
      the[0] = object;
      if (object[idKey] === udf) object[idKey] = _generatorId();
      the.length = 1;
    } else {
      for (var i = 0; i < object.length; i++) {
        the[i] = object[i];
        if (object[i][idKey] === udf) object[i][idKey] = _generatorId();
      }
      the.length = object.length;
    }
    the.splice = [].splice;
    return the;
  }
  /**
   * 转换字符串为驼峰形式
   * 如-webkit-animate => webkitAnimate
   * @param {String} string 带转换字符串
   * @param {Boolean} isUpperCaseFirstLetter 是否大写首字母
   * @return {String} 转换后的字符串
   * @version 1.0
   * 2013年12月27日10:39:19
   */
  function _toHumpString(string, isUpperCaseFirstLetter) {
    string = string.replace(/-([a-z])/g, function(match, match1) {
      return match1.toUpperCase();
    });
    return isUpperCaseFirstLetter ? string.replace(/^[a-z]/, function(match) {
      return match.toUpperCase();
    }) : string;
  }
  /**
   * 判断数据是否为指定数值类型
   * 部分参考自jquery@2.1.0
   * @param  {*}               any              任何数据
   * @param  {Number/Boolean}  radixORstrict    两种情况：
   * @return {Boolean}                          是否为指定数值，是为true
   *
   * 1、radix为数值时，表示验证进制，会将any进行字符串化，
   * 因此传入值最好是字符串，否则会判断不准确
   * 2、radix为true时，表示严格判断any是否为**十进制**字符串，
   * 如'123.' 或 '.123' 或 “0000.123” 或 “1.2e+11” 都是不严格正确的
   *
   * @version 1.0
   * 2014年6月24日11:43:46
   */
  function _isNumeric(any, radixORstrict) {
    var b = _type(any) !== 'array' && any !== '' && any - _parseFloat(any) >= 0,
      word = 'abcdefghijklmnopqrstuvwxyz',
      regString, reg,
      numString;
    // 严格10进制判断
    if (radixORstrict === true) {
      return regNumeric.test(any);
    } else if (radixORstrict === udf) return b;
    regString = '^';
    numString = any.toString(radixORstrict);
    if (radixORstrict === 8) {
      regString += '0';
    } else if (radixORstrict === 16) {
      regString += '0x';
    }
    regString += '[0-';
    if (radixORstrict < 11) {
      regString += radixORstrict - 1;
    } else {
      regString += '9a-' + word.slice(radixORstrict - 11, radixORstrict - 10);
    }
    regString += ']+$';
    reg = new RegExp(regString, 'i');
    return reg.test(numString);
  }
  /**
   * 获取html5的对象
   * @param {Object} parentObj 父级对象
   * @param {String} fnName 对象标准名称（参考w3c）
   * @param {Boolean} isReturnObject 是否返回支持浏览器的该对象
   * @return {Object} 对象
   * @version 1.0
   * 2013年12月27日10:39:19
   */
  function _html5(parentObj, fnName, isReturnObject) {
    var ret = null,
      valName = '',
      i;
    for (i in browserPrefix) {
      if (/^on/.test(fnName)) {
        valName = fnName.replace('on', 'on' + browserPrefix[i]);
      } else {
        valName = browserPrefix[i] + _prefix(fnName);
      }
      if ((ret = parentObj[valName]) !== udf) break;
      else valName = '';
    }

    function _prefix(string) {
      return string.replace(/^[a-z]/, function(v) {
        return browserPrefix[i] ? v.toUpperCase() : v;
      });
    }
    return isReturnObject ? ret : valName;
  }
  /**
   * 获取设设置元素的css值
   * @param {Object} element  元素
   * @param {String} key   css键
   * @param {String} val   css值
   * @return {Number} css值
   * @version 1.0
   * 2013年12月27日10:37:27
   */
  function _css3(element, key, val) {
    if (!$.isElement(element)) return;
    var keyName = '',
      prefix = '',
      isGet = val === udf,
      ret = udf,
      i;
    for (i in browserPrefix) {
      prefix = browserPrefix[i];
      keyName = _toHumpString(prefix ? prefix + '-' + key : key, prefix);
      // get
      if (isGet) {
        if ((ret = getComputedStyle(element)[keyName]) !== udf) break;
      }
      // set
      else {
        if (regNumericCss.test(key) && _isNumeric(val, !0)) val += 'px';
        if (keyName in element.style) {
          element.style[keyName] = val;
          break;
        }
      }
    }
    return ret || keyName;
  }
  /**
   * 标签字符串换换为Dom节点
   * @param {String} string dom字符串
   * @return {Object} dom节点
   * @version 1.1
   * 2013年6月28日12:40:20
   * 2013年7月1日18:52:12
   */
  function _parseElement(string) {
    var tempWrap = doc.createElement('div');
    tempWrap.innerHTML = string;
    return tempWrap.children;
  }
  /**
   * 判断数据是否在数组中
   * @param {*}     value 任何
   * @param {Array} array 数组
   * @return {Number}    不在返回-1，存在返回索引值
   * @version 1.1
   * 2013年12月27日10:43:31
   * 2014年6月13日17:37:48
   */
  function _inArray(value, array) {
    return array.indexOf(value);
  }
  /**
   * 判断是否为一个空对象，无原型、无属性
   * @param  {*}  obj 对象
   * @return {Boolean}   是为true
   * @version 1.0
   * 2014年6月25日12:01:22
   */
  function _isEmptyObject(obj) {
    if (_type(obj) !== 'object') return !1;
    var i;
    for (i in obj) {
      return !1;
    }
    return obj.prototype === udf;
  }
});
define("yquery/1.7.1/1-dom-debug", ["yquery/1.7.1/0-core-debug"], function(require, exports, module) {
  // 1-dom.js
  // 2014年7月15日10:20:15
  var $ = require("yquery/1.7.1/0-core-debug"),
    win = window,
    doc = win.document,
    htmlElem = doc.documentElement,
    matchesSelector = $.html5(doc.body, 'matchesSelector');
  $.fn.extend({
    /**
     * this访问控制，尤其是要操作到this中的第0个元素时
     * @param {*} returnValue 指定返回值，当this.lengt为0时
     * @private
     */
    _access: function(callback, returnValue) {
      if (this.length) return callback.call(this[0]);
      else return arguments.length === 2 ? returnValue : this;
    },
    /**
     * 根据选择器在集合对象中查找子代对象集合
     * @param {String/Element/Yquery} selector 选择器
     * @return new this
     * @version 1.0
     * 2013年12月29日23:30:20
     */
    find: function(selector) {
      var ret = [],
        type = $.type(selector);
      this.each(function() {
        var the = this;
        if (type === 'string') {
          ret = ret.concat([].slice.call(the.querySelectorAll(selector)));
        } else {
          $(selector).each(function() {
            if (the.contains(this)) ret.push(this);
          });
        }
      });
      return $(ret);
    },
    /**
     * 遍历this
     * @param {Function} callback 遍历回调
     * @return this
     * @version 1.0
     * 2013年12月29日1:42:58
     */
    each: function(callback) {
      var i = 0,
        element;
      for (; i < this.length; i++) {
        element = this[i];
        callback.call(element, i, element);
      }
      return this;
    },
    /**
     * 返回指定索引值的元素
     * @param {Number} index 元素索引值，倒数最后一个为-1
     * @return new this
     * @version 1.0
     * 2013年12月29日3:33:45
     */
    eq: function(index) {
      var the = $.extend([], this);
      return $(the.splice(index, 1));
    },
    /**
     * 获取集合中的最后一个元素
     * @return new this
     * @version 1.0
     * 2014年7月10日10:59:54
     */
    last: function() {
      return this.eq(this.length - 1);
    },
    /**
     * 获取当前元素的前一个兄弟元素
     * @return new this
     * @version 1.0
     * 2013年12月29日2:06:02
     */
    prev: function() {
      return this._access(function() {
        return $(this.previousElementSibling);
      });
    },
    /**
     * 获取当前元素的后一个兄弟元素
     * @return new this
     * @version 1.0
     * 2013年12月29日2:06:02
     */
    next: function() {
      return this._access(function() {
        return $(this.nextElementSibling);
      });
    },
    /**
     * 获取当前元素的兄弟元素集合
     * @param {String} selector 选择器，可以为空
     * @return new this
     * @version 1.0
     * 2013年12月29日2:14:20
     */
    siblings: function(selector) {
      return this._access(function() {
        var element = this,
          children = element.parentElement.children,
          ret = [];
        this.each.call(children, function() {
          if (!this.isEqualNode(element)) {
            if (selector) {
              if (_matchesSelector(this, selector)) ret.push(this);
            } else ret.push(this);
          }
        });
        return $(ret);
      });
    },
    /**
     * 判断当前元素在兄弟元素中的排位
     * @return {Number} 索引值，起始值为0
     * @version 1.0
     * 2014年6月16日16:02:28
     */
    index: function() {
      return this._access(function() {
        var element = this,
          children = element.parentElement.children,
          index = -1,
          i;
        for (i in children) {
          index++;
          if (children[i].isEqualNode(element)) break;
        }
        return index;
      }, -1);
    },
    /**
     * 筛选出元素中有指定选择器元素的集合
     * @param  {String/Element}    选择器或元素
     * @return this
     * @version 1.2
     * 2013年12月29日2:23:07
     * 2014年7月6日09:51:02
     * 2014年7月12日16:49:39
     */
    has: function(selector) {
      var ret = [];
      this.each(function() {
        if ($(this).find(selector).length) ret.push(this);
      });
      return $(ret);
    },
    /**
     * 将目标元素从当前元素集合中移除，返回新的元素集合
     * @param {String/Element/Function} any
     * @return new this
     * @version 1.0
     * 2013年12月29日23:17:19
     */
    not: function(any) {
      var the = this,
        type = $.type(any),
        $elements = $(any),
        ret = $.extend([], this);
      if (type === 'function') {
        $elements = [];
        this.each(function() {
          if (any.call(this) === true) {
            $elements.push(this);
          }
        });
        $elements = $($elements);
      }
      $elements.each(function() {
        if ($(the).has(this)) {
          _removeInArray(this, ret);
        }
      });
      return $(ret);
    },
    /**
     * 将目标元素从当前元素集合中取出，返回新的元素集合
     * @param {String/Element/Function} any
     * @return new this
     * @version 1.0
     * 2013年12月29日23:17:19
     */
    filter: function(any) {
      var the = this,
        type = $.type(any),
        $elements = $(any),
        ret = [];
      if (type == 'function') {
        $elements = [];
        this.each(function() {
          if (any.call(this) === true) {
            $elements.push(this);
          }
        });
        $elements = $($elements);
      }
      $elements.each(function() {
        if ($(the).has(this)) {
          ret.push(this);
        }
      });
      return $(ret);
    },
    /**
     * 获取匹配选择器距离当前元素（集合）的最近祖先元素，包括当前元素（集合）
     * @param {String} selector 选择器
     * @return new this
     * @version 1.1
     * 2013年12月29日1:50:50
     * 2014年6月24日20:00:40
     * 修正了对 document 与 documentElement 的判断
     */
    closest: function(selector) {
      return this._access(function() {
        var element = this,
          find;
        if (element === doc) return $();
        else if (element === htmlElem) return selector.toLowerCase() === 'html' ? $(htmlElem) : $();
        while (element !== null) {
          if (_matchesSelector(element, selector)) {
            find = element;
            break;
          }
          element = element.parentElement;
        }
        return $(find);
      });
    },
    /**
     * 只返回第一个元素的指定父亲或祖先
     * @param {Boolean} isPositionParent 是否指定查找最近的相对定位的祖先
     * @return this
     * @version 1.1
     * 2014年7月3日10:54:58
     * 2014年7月10日16:03:22
     */
    parent: function(isPositionParent) {
      return this._access(function() {
        if ($.css3(this, 'position') === 'fixed' && isPositionParent) return $(doc);
        return $(isPositionParent ? this.offsetParent : this.parentElement);
      });
    },
    /**
     * 获取元素的所有内容
     * @return this
     * @version 1.0
     * 2014年7月12日16:07:59
     */
    contents: function() {
      var ret = [];
      this.each(function() {
        var the = this;
        if (the.contentDocument) ret.push(the.contentDocument);
        else ret = ret.concat([].slice.call(the.childNodes));
      });
      return $(ret);
    },
    /**
     * 选择元素的子代
     * @param  {String} selector 选择器，可选
     * @return this
     * @version 1.0
     * 2014年7月11日10:26:48
     */
    children: function(selector) {
      var ret = [];
      this.each(function() {
        var arr = [].slice.call(this.children);
        if (selector) {
          arr.forEach(function(element) {
            if (_matchesSelector(element, selector)) ret.push(element);
          });
        } else {
          ret = ret.concat(arr);
        }
      });
      return $(ret);
    },
    /**
     * 将目标元素加入到当前元素集合中，返回新的元素集合
     * @param {String/Element/yquery} any
     * @return this
     * @version 1.0
     * 2013年12月29日23:17:19
     */
    add: function(any) {
      var the = this,
        ret = [];
      the.each(function() {
        ret.push(this);
      });
      $(any).each(function() {
        if (!the.has(this)) {
          ret.push(this);
        }
      });
      return $(ret);
    }
  });
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////[ private API ]///////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**
   * DOM匹配选择器
   * @param {Object} element 元素
   * @param {String} selector 选择器
   * @return {Boolean}
   * @version 1.0
   * 2013年12月26日15:55:48
   */
  function _matchesSelector(element, selector) {
    return selector ? element[matchesSelector](selector) : element;
  }
  /**
   * 移除数组中指定的1个数据
   * @param {*} value 任何
   * @param {Array} array 数组
   * @return {Array} 新数组
   * @version 1.0
   * 2013年12月29日2:57:22
   */
  function _removeInArray(value, array) {
    for (var i in array) {
      if (array[i] === value) array.splice(i, 1);
    }
    return array;
  }
});
define("yquery/1.7.1/2-modify-debug", ["yquery/1.7.1/0-core-debug"], function(require, exports, module) {
  // 2-modify.js
  // 2014年7月15日10:57:10
  var $ = require("yquery/1.7.1/0-core-debug"),
    udf,
    win = window,
    doc = win.document,
    regTag = /<.*?>/;
  $.fn.extend({
    /**
     * 克隆
     * @param  {Boolean} isDeep 是否深度克隆
     * @return this
     * 不会克隆dom上的事件绑定
     * @version 1.0
     * 2014年7月5日12:56:25
     */
    clone: function(isDeep) {
      var ret = [];
      this.each(function() {
        ret.push(this.cloneNode(isDeep));
      });
      return $(ret);
    },
    /**
     * 将元素后插到当前元素（集合）内
     * @param {String/Element/Function} any
     * @return this
     * @version 1.0
     * 2013年12月29日1:44:15
     */
    append: function(any) {
      return this.each(function(index) {
        _insert(this, 'beforeend', any, index);
      });
    },
    /**
     * 将元素前插到当前元素（集合）内
     * @param {String/Element/Function} any
     * @return this
     * @version 1.0
     * 2013年12月29日1:44:15
     */
    prepend: function(any) {
      return this.each(function(index) {
        _insert(this, 'afterbegin', any, index);
      });
    },
    /**
     * 将元素前插到当前元素（集合）前
     * @param {String/Element/Function} any
     * @return this
     * @version 1.0
     * 2013年12月29日1:44:15
     */
    before: function(any) {
      return this.each(function(index) {
        _insert(this, 'beforebegin', any, index);
      });
    },
    /**
     * 将元素后插到当前元素（集合）后
     * @param {String/Element/Function} any
     * @return this
     * @version 1.0
     * 2013年12月29日1:44:15
     */
    after: function(any) {
      return this.each(function(index) {
        _insert(this, 'afterend', any, index);
      });
    },
    /**
     * 移除当前元素（集合）
     * @return null
     * @version 1.0
     * 2013年12月29日1:44:15
     */
    remove: function() {
      this.each(function() {
        this.remove();
      });
      return null;
    },
    /**
     * 清空当前元素（集合）内容
     * @return this
     * @version 1.0
     * 2013年12月29日1:44:15
     */
    empty: function() {
      return this.each(function() {
        this.innerHTML = '';
      });
    },
    /**
     * 获取和设置当前元素（集合）的 innerHTML 内容
     * @param {String} innerHTML
     * @return this
     * @version 1.0
     * 2013年12月29日1:48:05
     */
    html: function(html) {
      var isCallback = $.type(html) === 'function',
        callback = html;
      if (html === udf) {
        return this._access(function() {
          return this.innerHTML;
        }, udf);
      }
      return this.each(function() {
        if (isCallback) html = callback.call(this);
        this.innerHTML = html;
      });
    },
    /**
     * 获取和设置当前元素（集合）的 textContent 内容
     * @param {String} string
     * @return this
     * @version 1.0
     * 2013年12月29日1:48:05
     */
    text: function(string) {
      if (string === udf) {
        return this._access(function() {
          return this.textContent;
        }, udf);
      }
      return this.each(function() {
        this.textContent = string;
      });
    },
    /**
     * 包裹当前集合中的每一个元素
     * @param  {String} html 字符串
     * @return this
     * @version 1.0
     * 2014年7月3日19:13:27
     */
    wrap: function(html) {
      return this.each(function() {
        var element = this,
          $wrap = $(html).insertAfter(element);
        $wrap[0].appendChild(element);
      });
    },
  });
  // $.fn.appendTo
  // $.fn.prependTo
  // $.fn.insertBefore
  // $.fn.insertAfter
  $.each({
    appendTo: 'append',
    prependTo: 'prepend',
    insertBefore: 'before',
    insertAfter: 'after'
  }, function(key, val) {
    $.fn[key] = function(selector) {
      this.each(function() {
        $(selector)[val](this);
      });
      return this;
    };
  });
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////[ private API ]///////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**
   * 治疗火狐的 insertAdjacentText insertAdjacentElement
   * @param  {Element} parent   父级元素
   * @param  {String}  position 位置
   * @param  {String}  text     字符串
   * @return undefined
   * @version 1.0
   * 2014年7月15日12:02:53
   */
  function _insertTextOrElement(parent, position, textOrElement) {
    var isString = $.isString(textOrElement);
    if (isString && parent.insertAdjacentText) return parent.insertAdjacentText(position, textOrElement);
    else if (!isString && parent.insertAdjacentElement) return parent.insertAdjacentElement(position, textOrElement);
    var node = isString ? doc.createTextNode(textOrElement) : textOrElement,
      temp;
    switch (position) {
      case 'beforebegin':
        parent.parentNode.insertBefore(node, parent);
        break;
      case 'afterbegin':
        temp = parent.firstChild;
        if (temp) parent.insertBefore(node, temp);
        else parent.appendChild(node);
        break;
      case 'beforeend':
        parent.appendChild(node);
        break;
      case 'afterend':
        temp = parent.nextSibling;
        if (temp) parent.parentNode.insertBefore(node, temp);
        else parent.parentNode.appendChild(node);
        break;
    }
  }
  /**
   * 在父级元素上操作DOM
   * @param {Object} parent   父级元素
   * @param {String} position 位置: beforebegin/afterbegin/beforeend/afterend
   * @param {*}      any      任何：string/text/object
   * @param {Number} index    序号，如果大于0则复制节点
   * @return {Undefined}
   * @version 1.0
   * 2013年12月2日17:08:26
   */
  function _insert(parent, position, any, index) {
    if ($.isFunction(any)) {
      any = any.call(parent);
    }
    // 字符串
    if ($.isString(any)) {
      if (regTag.test(any)) {
        parent.insertAdjacentHTML(position, any);
      } else {
        _insertTextOrElement(parent, position, any);
      }
    }
    // 数字
    else if ($.isNumber(any)) {
      _insertTextOrElement(parent, position, any);
    }
    // 元素
    else if ($.isElement(any)) {
      _insertTextOrElement(parent, position, index > 0 ? any.cloneNode(!0) : any);
    }
    // Yquery
    else if ($.isYquery(any)) {
      any.each(function() {
        _insert(parent, position, this);
      });
    }
  }
});
define("yquery/1.7.1/3-attr-prop-debug", ["yquery/1.7.1/0-core-debug"], function(require, exports, module) {
  // 3-attr-prop.js
  // 2014年7月15日12:04:07
  var $ = require("yquery/1.7.1/0-core-debug"),
    idKey = $._id,
    udf,
    // data MAP
    dataDb = {};
  $.fn.extend({
    /**
     * get set 控制
     * get $.fn(key) => $.fn(key) * 1
     * get $.fn([key1, key2, ...]) => $.fn(key) * n
     * set $.fn({}) => $.fn(key, val) * n
     * set $.fn(key, val) => $.fn(key, val) * 1
     * .css/attr/prop/
     * @private
     */
    _getSet: function(fn, key, val) {
      var typeKey = $.type(key),
        temp, element;
      if ((typeKey === 'string' || typeKey === 'array') && val === udf) {
        return this._access(function() {
          var ret = {};
          element = this;
          temp = typeKey === 'array' ? key : [key];
          temp.forEach(function(k) {
            ret[k] = fn(element, k);
          });
          return temp.length > 1 ? ret : ret[temp[0]];
        });
      }
      temp = {};
      if (val === udf) {
        temp = key;
      } else {
        temp[key] = val;
      }
      return this.each(function() {
        element = this;
        $.each(temp, function(k, v) {
          fn(element, k, v);
        });
      });
    },
    /**
     * 获取和设置当前元素（集合）的一个或多个 attribute（属性）
     * @param {String/Object} key 属性名称或属性JSON对象
     * @param {String}        val 属性值
     * @return this
     * @version 1.1
     * 2013年12月29日1:52:47
     * 2014年6月16日17:29:41
     */
    attr: function(key, val) {
      return this._getSet(_attr, key, val);
    },
    /**
     * 判断当前元素是否包含该属性值
     * @param {String} key 属性值
     * @return {Boolean}
     * @version 1.0
     * 2013年12月29日1:53:55
     */
    // hasAttr: function (key) {
    //    return this._access(function(){
    //        return this.hasAttribute(key);
    //    }, !1);
    // },
    /**
     * 移除当前元素集合指定属性值
     * @param {String} key 属性值
     * @return this
     * @version 1.0
     * 2013年12月29日1:53:55
     */
    removeAttr: function(key) {
      return this.each(function() {
        this.removeAttribute(key);
      });
    },
    /**
     * 获取和设置当前元素（集合）的一个或多个 property（性质）
     * @param {String/Object} key 性质名称或属性JSON对象
     * @param {String} val 性质值
     * @return this
     * @version 1.1
     * 2013年12月29日1:52:47
     * 2014年6月16日17:29:59
     */
    prop: function(key, val) {
      return this._getSet(_prop, key, val);
    },
    /**
     * 判断当前元素是否包含该性质值
     * @param {String} key 性质值
     * @return {Boolean}
     * @version 1.0
     * 2013年12月29日1:53:55
     */
    // hasProp: function (key) {
    //    return this[0][key] !== udf;
    // },
    /**
     * 移除当前元素集合指定性质值
     * @param {String} key 性质值
     * @return this
     * @version 1.0
     * 2013年12月29日1:53:55
     */
    // removeProp: function (key) {
    //    return this.each(function () {
    //        this[key] = udf;
    //    });
    // },
    /**
     * 返回当前元素的 value 性质值
     * @return {String} 性质值
     * @version 1.0
     * 2013年12月29日1:55:19
     */
    val: function(val) {
      return this.prop('value', val);
    },
    /**
     * 设置、获取dataset数据
     * @param {String/Array} key data键
     * @param {String} val data值
     * @version 1.0
     * 2014年6月16日12:27:36
     */
    data: function(key, val) {
      return this._getSet(_data, key, val);
    },
    /**
     * 设置和获取css
     * @param {String/Object} key   css键/css键值对
     * @param {String}        val   css值
     * @return this
     * @version 1.0
     * 2013年12月29日1:55:41
     */
    css: function(key, val) {
      return this._getSet($.css3, key, val);
    }
  });
  // $.fn.addClass
  // $.fn.removeClass
  // $.fn.hasClass
  ['add', 'remove', 'has'].forEach(function(value, index) {
    $.fn[value + 'Class'] = function(classString) {
      if (index == 2) {
        return this._access(function() {
          return _class(this, classString, index);
        }, udf);
      }
      return this.each(function() {
        _class(this, classString, index);
      });
    };
  });
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////[ private API ]///////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**
   * 操作 DOM 的 data 数据，这里的优先级与 jquery 相似
   * 1、读取内置的存储空间
   * 2、读取dataset值
   * @param  {Element} element 元素
   * @param  {String}  key  键
   * @param  {*}       val  值
   * @version 1.0
   * 2014年6月16日12:26:36
   */
  function _data(element, key, val) {
    var ret = udf;
    // get
    if (val === udf) {
      ret = dataDb[element[idKey]] && dataDb[element[idKey]][key] || element.dataset[key];
      try {
        ret = JSON.parse(ret);
      } catch (e) {}
    }
    // set
    else {
      if (dataDb[element[idKey]] === udf) dataDb[element[idKey]] = {};
      if (element.dataset[key] === udf) {
        dataDb[element[idKey]][key] = val;
      } else {
        element.dataset[key] = val;
      }
    }
    return ret;
  }
  /**
   * 操作Class
   * @param {Object} element     Element
   * @param {String} classString 字符串，多个class以逗号分开
   * @param {Number} index       操作类型：0=add，1=remove，2=contains
   * @return {Undefined} undefined
   * @version 1.0
   * 2013年12月17日11:37:47
   */
  function _class(element, classString, index) {
    var dcl = element.classList,
      ret;
    if (!$.isElement(element)) return ret;
    (classString || '').trim().split(/\s+/).forEach(function(v) {
      switch (index) {
        case 0:
          if (v !== '') dcl.add(v);
          break;
        case 1:
          if (v === '') {
            element.className = '';
          } else {
            dcl.remove(v);
          }
          break;
        case 2:
          ret = v !== '' && dcl.contains(v);
          return ret;
        default:
          break;
      }
    });
    return ret;
  }
  /**
   * 操作DOM的attribute
   * @param {Element} element 元素
   * @param {String} key 键
   * @param {String} key 值
   * @version 1.1
   * 2013年12月26日16:39:58
   * 2014年6月16日17:26:20
   */
  function _attr(element, key, val) {
    if (!$.isElement(element)) return;
    if (val === udf) {
      return element.getAttribute(key);
    } else {
      element.setAttribute(key, val);
    }
  }
  /**
   * 操作DOM的property
   * @param {Element} element 元素
   * @param {String} key 键
   * @param {String} key 值
   * @version 1.1
   * 2013年12月26日16:39:58
   * 2014年6月16日17:26:20
   */
  function _prop(element, key, val) {
    if (val === udf) {
      return element[key];
    } else {
      element[key] = val;
    }
  }
});
define("yquery/1.7.1/4-pos-size-debug", ["yquery/1.7.1/0-core-debug"], function(require, exports, module) {
  // 4-pos-size.js
  // 2014年7月15日12:12:45
  var $ = require("yquery/1.7.1/0-core-debug"),
    udf,
    win = window,
    doc = win.document,
    htmlElem = doc.documentElement,
    body = doc.body;
  $.fn.extend({
    /**
     * 返回元素相对于最近定位祖先元素的绝对距离
     * 1、不包括测量元素（自己）的边框和外边距
     * 2、不包括被测量元素（祖先）的内边距和边框
     * @return {Object} 含 top/left 的键值对
     * @version 1.0
     * 2013年12月27日10:11:33
     */
    position: function() {
      return this._access(function() {
        var element = this,
          top,
          left;
        if (!$.isElement(element)) return {
          top: 0,
          left: 0
        };
        top = element.offsetTop - $.parseFloat($.css3(element, 'marginTop'));
        left = element.offsetLeft - $.parseFloat($.css3(element, 'marginLeft'));
        return {
          top: top,
          left: left
        };
      });
    },
    /**
     * 返回第一个元素相对于文档的绝对距离
     * 设置所有元素相对于文档的绝对距离
     * 该距离为元素的外边框距离文档边缘的长度
     * @return {Object} 含 top/right/bottom/left 的对象
     * @version 1.1
     * 2013年12月27日10:02:30
     * 2014年7月3日10:27:41
     */
    offset: function(offset) {
      if (offset) {
        return this.each(function() {
          var element = this,
            $element = $(element),
            position = $element.position(),
            cssLeft,
            cssTop,
            current;
          if (!$.isElement(element)) return;
          cssLeft = $element.css('left');
          cssTop = $element.css('top');
          if ($element.css('position') === 'static') $element.css('position', 'relative');
          if (cssLeft === 'auto') $element.css('left', position.left);
          if (cssTop === 'auto') $element.css('top', position.top);
          cssLeft = $.parseFloat($element.css('left'));
          cssTop = $.parseFloat($element.css('top'));
          current = $element.offset();
          if (offset.left === udf) offset.left = current.left;
          if (offset.top === udf) offset.top = current.top;
          if (offset.left !== current.left) $.css3(element, 'left', cssLeft + offset.left - current.left);
          if (offset.top !== current.top) $.css3(element, 'top', cssTop + offset.top - current.top);
        });
      }
      return this._access(function() {
        var element = this,
          bounding;
        if (!$.isElement(element)) return {
          top: 0,
          left: 0
        };
        // 元素距离屏幕边缘的位置
        bounding = element.getBoundingClientRect();
        return {
          top: bounding.top + win.scrollY,
          left: bounding.left + win.scrollX
        };
      }, udf);
    }
  });
  // 返回的是以内容盒模型为准的值
  // $.fn.width
  // $.fn.innerWidth
  // $.fn.outerWidth
  // $.fn.clientWidth
  // $.fn.height
  // $.fn.innerHeight
  // $.fn.outerHeight
  // $.fn.clientHeight
  ['', 'inner', 'outer', 'client'].forEach(function(prefix, index) {
    ['width', 'height'].forEach(function(suffix) {
      $.fn[index ? $.toHumpString(prefix + '-' + suffix) : suffix] = function(value) {
        if (value === udf) {
          return this._access(function() {
            var element = this;
            return _widthOrHeight(element, suffix)[index];
          }, udf);
        }
        return this.each(function() {
          this.style[suffix] = _widthOrHeight(this, suffix, value)[index] + 'px';
        });
      };
    });
  });
  // $.fn.scrollTop// $.fn.scrollLeft
  ['Top', 'Left'].forEach(function(suffix) {
    var fnName = 'scroll' + suffix;
    $.fn[fnName] = function(value) {
      // get
      if (value === udf) {
        return this._access(function() {
          return _scroll(this, suffix);
        }, udf);
      }
      // set
      return this.each(function() {
        if (this === win || this === doc || this === htmlElem || this === body) {
          htmlElem[fnName] = value;
          doc.body[fnName] = value;
        } else {
          this[fnName] = value;
        }
      });
    };
  });
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////[ private API ]///////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**
   * 获取和设置元素的宽度
   * @param {Object} element 元素
   * @param {String} key 宽度或高度
   * @param {Number} value 值
   * @return {Number} 返回获取值
   * @version 1.0
   * 2013年12月29日0:26:04
   */
  function _widthOrHeight(element, key, val) {
    var boxSizing = 'content-box',
      // undefined 或 布尔值 时为获取
      isGet = val === udf || $.type(val) === 'boolean',
      humpKey = $.toHumpString(key, !0),
      isVertical = /height/.test(key),
      padding = 0,
      border = 0,
      margin = 0,
      scrollbar,
      // 内容尺寸
      content = 0,
      // 内容 + 内边距
      inner = 0,
      // 内容 + 内边距 + 边框
      outer = 0,
      // 实际内容 + 内边距
      client = 0,
      // 内容 + 内边距 + 边框
      // offset = 0,
      firstNone = !1;
    if (element === win || element === doc) {
      content = win['inner' + humpKey];
      inner = content;
      outer = win['outer' + humpKey];
    } else {
      if ($.css3(element, 'display') === 'none') {
        $.css3(element, 'display', 'block');
        firstNone = !0;
      }
      padding = isVertical ? $.parseFloat($.css3(element, 'paddingTop')) + $.parseFloat($.css3(element, 'paddingBottom')) : $.parseFloat($.css3(element, 'paddingLeft')) + $.parseFloat($.css3(element, 'paddingRight'));
      border = isVertical ? $.parseFloat($.css3(element, 'borderTopWidth')) + $.parseFloat($.css3(element, 'borderBottomWidth')) : $.parseFloat($.css3(element, 'borderLeftWidth')) + $.parseFloat($.css3(element, 'borderRightWidth'));
      margin = isVertical ? $.parseFloat($.css3(element, 'marginTop')) + $.parseFloat($.css3(element, 'marginBottom')) : $.parseFloat($.css3(element, 'marginLeft')) + $.parseFloat($.css3(element, 'marginRight'));
      boxSizing = $.css3(element, 'boxSizing');
      client = element['client' + humpKey];
      outer = element['offset' + humpKey];
      // get
      if (isGet) {
        inner = outer - border;
        content = inner - padding;
        if (val === true) outer += margin;
      }
      // set
      else {
        scrollbar = outer - border - client;
        val = $.parseFloat(val);
        // 边框盒模型
        if (boxSizing === 'border-box') {
          outer = val;
          content = val + padding + border;
          inner = val + border;
          client = val + scrollbar + border;
        }
        // 边距盒模型
        else if (boxSizing === 'padding-box') {
          inner = val;
          content = val + padding;
          outer = val - border;
          client = val + scrollbar;
        }
        // 内容盒模型
        else {
          content = val;
          inner = val - padding;
          outer = val - border - padding;
          client = val + scrollbar - padding;
        }
      }
    }
    if (firstNone) {
      $.css3(element, 'display', '');
    }
    return [content, inner, outer, client];
  }
  /**
   * 获得元素的滚动值
   * @param  {Element} element 元素
   * @param  {String}  suffix  后缀，Top/Left
   * @return {Number}  值
   * 其中，window、document、html、body四个值是一样的
   * @version 1.0
   * 2014年7月6日21:56:00
   */
  function _scroll(element, suffix, val) {
    var fnName = 'scroll' + suffix,
      isBody = element === win || element === doc || element === htmlElem || element === body;
    if (val === udf) return isBody ? (htmlElem[fnName] || doc.body[fnName]) : element[fnName];
    val = $.parseFloat(val);
    if (isBody) {
      body[fnName] = val;
    } else {
      element[fnName] = val;
    }
  }
});
define("yquery/1.7.1/5-event-debug", ["yquery/1.7.1/0-core-debug"], function(require, exports, module) {
  // 5-event.js
  // 2014年7月15日12:11:53
  var $ = require("yquery/1.7.1/0-core-debug"),
    udf,
    win = window,
    doc = win.document,
    body = doc.body,
    // 为了适应jQuery，参考jQuery，其他事件请使用bind绑定
    normalEvents = 'blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu'.split(' '),
    customTouchEvents = 'tap taphold swipe swipeup swiperight swipedown swipeleft'.split(' '),
    // 不能增删！！
    mustEventProperties = 'detail which clientX clientY pageX pageY screenX screenY'.split(' '),
    /**
     * http://hi.baidu.com/flondon/item/a83892e3b454192a5a7cfb35
     * eventType 共5种类型：Events、HTMLEvents、UIEevents、MouseEvents、MutationEvents。
     * ● Events ：所有的事件。
     * ● HTMLEvents：abort、blur、change、error、focus、load、reset、resize、scroll、select、submit、unload。
     * ● UIEvents：DOMActivate、DOMFocusIn、DOMFocusOut、keydown、keypress、keyup。
     * ● MouseEvents：click、mousedown、mousemove、mouseout、mouseover、mouseup、touch。
     * ● MutationEvents：DOMAttrModified、DOMNodeInserted、DOMNodeRemoved、DOMCharacterDataModified、DOMNodeInsertedIntoDocument、DOMNodeRemovedFromDocument、DOMSubtreeModified。
     */
    // htmlEvents = 'abort blur change error focus load reset resize scroll select submit unload'.split(' '),
    // mouseEvents = /click|mouse|touch/,
    // uiEvents = /key|DOM(Active|Focus)/,
    // mutationEvents = /DOM(Attr|Node|Character|Subtree)/,
    // Any events specific to one element do not bubble: submit, focus, blur, load, 
    // unload, change, reset, scroll, most of the DOM events (DOMFocusIn, DOMFocusOut, DOMNodeRemoved, etc),
    // mouseenter, mouseleave, etc
    // @link http://stackoverflow.com/questions/5574207/javascript-which-events-do-not-bubble
    canNotBubbleEvents = 'blur error focus load unload change scroll submit mouseenter mouseleave'.split(' '),
    defaults = {
      tap: {
        x: 30,
        y: 30,
        timeout: 500
      },
      taphold: {
        x: 30,
        y: 30,
        timeout: 750
      },
      swipe: {
        x: 30,
        y: 30
      }
    };
  $.fn.extend({
    /**
     * 事件绑定
     * @param  {String}   eventType 1个或多个事件类型
     * @param  {Function} fn        事件回调
     * @return this
     * @version 1.1
     * 2014年6月17日10:04:55
     * 2014年7月3日17:29:03
     */
    bind: function(eventType, fn) {
      eventType = eventType.split(' ');
      return this.each(function() {
        var element = this;
        $.each(eventType, function(index, ev) {
          _listen(element, ev, fn);
        });
      });
    },
    /**
     * 轻击与单击的结合版
     * @param  {Function} fn 事件回调
     * @return this
     * @version 1.0
     * 2014年7月2日16:28:02
     */
    tapick: function(fn) {
      return 'ontouchend' in doc ? this.tap(fn) : this.click(fn);
    },
    /**
     * 事件委托
     * @param {String} eventType 1个或多个事件类型，以空格分开
     * @param {String} selector  选择器（可省略）
     * @param {Function} fn      事件函数
     * @return this
     * @version 1.1
     * 2013年12月29日19:30:25
     * 2014年5月27日14:07:41
     *
     * $('#demo').on('click', fn);
     * $('#demo').on('click', fn);
     * $('#demo').on('click', '.selector', fn);
     */
    on: function(eventType, selector, fn) {
      eventType = eventType.split(' ');
      return this.each(function() {
        var the = this;
        eventType.forEach(function(ev) {
          if (~$.inArray(ev, canNotBubbleEvents)) {
            $(selector, the).each(function() {
              _listen(the, ev, fn);
            });
          }
          // 可以冒泡的事件
          else {
            _listen(the, ev, _checkAndCallback);
          }

          function _checkAndCallback(e) {
            var $element;
            if (fn === udf) {
              if (selector.call(the, e) === false) _eventFalse(e);
            } else {
              $element = $(e.target).closest(selector);
              if ($(the).has($element).length) {
                if (fn.call($element[0], e) === false) _eventFalse(e);
              }
            }
          }
        });
      });
    },
    /**
     * 触发事件
     * @param {String}  eventType 事件类型
     * @param {Object/String}  eventOrType   事件对象或事件类型
     * @param {Boolean}        canBubble     是否可以冒泡，默认true
     * @param {Boolean}        cancelable    是否可以阻止冒泡，默认true
     * @param {*}              detail        细节信息
     * @return this
     * @version 1.2
     * 2013年12月29日23:41:55
     * 2014年5月27日12:48:22
     * 2014年7月12日12:50:05
     */
    trigger: function(eventType, canBubble, cancelable, detail) {
      return this.each(function() {
        _triggerEvent(this, eventType, canBubble, cancelable, detail);
      });
    }
  });
  // 赋值到原型链
  normalEvents.concat(customTouchEvents).forEach(function(eventType) {
    $.fn[eventType] = function(fn) {
      return this.each(function() {
        if (eventType === 'focus' || eventType === 'blur') {
          return this[eventType]();
        }
        _listen(this, eventType, fn);
      });
    };
  });
  // 添加自定义 tap 事件
  // 添加自定义 taphold 事件
  // 添加自定义 swipe 事件
  // 添加自定义 swipeup 事件
  // 添加自定义 swiperight 事件
  // 添加自定义 swipedown 事件
  // 添加自定义 swipeleft 事件
  (function() {
    var timeid, x0, y0, t0,
      tapOptions = defaults.tap,
      tapholdOptions = defaults.taphold,
      swipeOptions = defaults.swipe,
      events = {};
    customTouchEvents.forEach(function(eventType) {
      events[eventType] = _createEvent(eventType);
    });
    // touchstart
    _listen(doc, 'touchstart', function(e) {
      if (e.touches && e.touches.length === 1) {
        var firstTouch = e.touches[0],
          element = firstTouch.target,
          toucheCallout = $.css3(body, 'touch-callout'),
          userSelect = $.css3(body, 'user-select');
        _reset(e);
        $.css3(body, 'touch-callout', 'none');
        $.css3(body, 'user-select', 'none');
        x0 = firstTouch.pageX;
        y0 = firstTouch.pageY;
        t0 = Date.now();
        timeid = setTimeout(function() {
          $.css3(body, 'touch-callout', toucheCallout);
          $.css3(body, 'user-select', userSelect);
          _mergeEvent(events.taphold, e);
          _triggerEvent(element, events.taphold);
        }, tapholdOptions.timeout);
      }
    });
    // touchmove
    _listen(doc, 'touchmove', function(e) {
      if (e.touches && e.touches.length === 1) {
        var firstTouch = e.touches[0],
          element = firstTouch.target,
          deltaX = Math.abs(firstTouch.pageX - x0),
          deltaY = Math.abs(firstTouch.pageY - y0),
          rect = element.getBoundingClientRect();
        // 在元素范围
        if (firstTouch.clientX > rect.left && firstTouch.clientY > rect.top && firstTouch.clientX < rect.right && firstTouch.clientY < rect.bottom) {
          if (timeid && (deltaX > tapholdOptions.x || deltaY > tapholdOptions.y)) _reset(e);
        }
      }
    });
    // touchend
    _listen(doc, 'touchend', function(e) {
      _reset(e);
      var firstTouch = e.changedTouches[0],
        x1 = firstTouch.pageX,
        y1 = firstTouch.pageY,
        x = x1 - x0,
        y = y1 - y0,
        deltaX = Math.abs(x),
        deltaY = Math.abs(y),
        deltaT = Date.now() - t0,
        element = firstTouch.target;
      if (deltaX < tapOptions.x && deltaY < tapOptions.y && deltaT < tapOptions.timeout) {
        _mergeEvent(events.tap, e);
        _triggerEvent(element, events.tap);
      }
      if (deltaX >= swipeOptions.x || deltaY >= swipeOptions.y) {
        setTimeout(function() {
          var dir = deltaX > deltaY ? (x > 0 ? 'right' : 'left') : (y > 0 ? 'down' : 'up');
          _mergeEvent(events.swipe, e);
          _mergeEvent(events['swipe' + dir], e);
          _triggerEvent(element, events.swipe);
          _triggerEvent(element, events['swipe' + dir]);
        }, 0);
      }
    });
    _listen(doc, 'touchcancel', _reset);
    _listen(win, 'scroll', _reset);

    function _reset(e) {
      if (e.changedTouches && e.changedTouches.length === 1 || e.touches && e.touches.length === 1) {
        if (timeid) clearTimeout(timeid);
        timeid = 0;
      }
    }
  })();
  $.extend({
    // 为了兼容 jQuery 的写法，不得不开头大写
    Event: _createEvent,
    proxy: function(fn, context) {
      return fn.bind(context);
    },
    tapSetup: function(settings) {
      $.extend(defaults.tap, settings);
    },
    tapholdSetup: function(settings) {
      $.extend(defaults.taphold, settings);
    },
    swipeSetup: function(settings) {
      $.extend(defaults.swipe, settings);
    }
  });
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////[ private API ]///////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**
   * 事件绑定
   * @param {Element}  element     DOM元素
   * @param {String}   eventType   事件类型
   * @param {Function} fn          事件回调
   * @return {Undefined}
   * @version 1.0
   * 2013年12月3日10:00:41
   */
  function _listen(element, eventType, fn) {
    element.addEventListener(eventType, function(e) {
      e.originalEvent = e;
      if (fn.call(element, e) === false) _eventFalse(e);
    }, !1);
  }
  _listen(doc, 'DOMContentLoaded', function() {
    $.readyFunctions.forEach(function(fn) {
      fn();
    });
    delete($.readyFunctions);
    $.isReady = !0;
  });
  /**
   * 阻止事件传递、默认事件、事件队列
   * @param {Object} e   事件对象
   * @return {Undefined}
   * @version 1.0
   * 2013年12月29日23:00:01
   */
  function _eventFalse(e) {
    if (e.preventDefault !== udf) e.preventDefault();
    if (e.stopPropagation !== udf) e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
  }
  /**
   * 触发事件
   * @param {String}  eventType  事件类型
   * @param {Boolean} canBubble  是否可以冒泡，默认true
   * @param {Boolean} cancelable 是否可以阻止冒泡，默认true
   * @param {*}       detail     任何细节信息
   * @version 1.1
   * 2014年5月27日13:53:36
   * 2014年7月12日11:34:34
   *
   * http://www.sitepoint.com/javascript-custom-events/
   * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
   * https://developer.mozilla.org/en-US/docs/Web/API/document.createEvent
   * https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
   * http://stackoverflow.com/questions/2490825/how-to-trigger-event-in-javascript?answertab=votes#tab-top
   */
  function _createEvent(eventType, canBubble, cancelable, detail) {
    // 1.
    if (canBubble === udf) canBubble = !0;
    if (cancelable === udf) cancelable = !0;
    var _event = new Event(eventType, {
      bubbles: canBubble,
      cancelable: cancelable,
      detail: detail
    });
    return _event;
    // 2.
    // var args = arguments,
    //     argL = args.length,
    //     _event;
    // if (argL === 2) {
    //     detail = cancelable;
    // }
    // if (argL <= 2) {
    //     canBubble = !0;
    //     cancelable = !0;
    // }
    // _event = new CustomEvent(eventType, {
    //     detail: detail,
    //     bubbles: canBubble,
    //     canBubble: canBubble,
    //     cancelable: cancelable,
    // });
    // return _event;
    // 3.
    // var eventTypeArr = ['Events', 'HTMLEvents', 'MouseEvents', 'UIEvents', 'MutationEvents'],
    //     eventInitArr = ['', '', 'Mouse', 'UI', 'Mutation'],
    //     eventTypeIndex = 0,
    //     _event,
    //     args = [eventType, !!canBubble, !!cancelable, win, {},
    //         0, 0, 0, 0, !1, !1, !1, !1, 0, null
    //     ];
    // if (~_inArray(eventType, htmlEvents)) {
    //     eventTypeIndex = 1;
    // } else if (mouseEvents.test(eventType)) {
    //     eventTypeIndex = 2;
    // } else if (uiEvents.test(eventType)) {
    //     eventTypeIndex = 3;
    // } else if (mutationEvents.test(eventType)) {
    //     eventTypeIndex = 4;
    // }
    // _event = doc.createEvent(eventTypeArr[eventTypeIndex]);
    // _event['init' + eventInitArr[eventTypeIndex] + 'Event'].apply(_event, args);
    // return _event;
  }
  /**
   * 触发事件
   * @param {Element}        element       元素
   * @param {Object/String}  eventOrType   事件对象或事件类型
   * @param {Boolean}        canBubble     是否可以冒泡，默认true
   * @param {Boolean}        cancelable    是否可以阻止冒泡，默认true
   * @param {*}              detail        细节信息
   * @version 1.1
   * 2014年5月27日13:53:36
   * 2014年7月12日12:46:13
   */
  function _triggerEvent(element, eventOrType, canBubble, cancelable, detail) {
    if ($.type(eventOrType) === 'string') {
      element.dispatchEvent(_createEvent(eventOrType, canBubble, cancelable, detail));
    } else {
      element.dispatchEvent(eventOrType);
    }
  }
  /**
   * 合并必要的信息到创建的事件对象上
   * @param  {Event} createEvent    创建的事件对象
   * @param  {Event} originalEvent  原始的事件对象
   * @return {Event} 合并后的事件对象
   * @version 1.0
   * 2014年7月12日13:36:11
   */
  function _mergeEvent(createEvent, originalEvent) {
    var copyEvent = originalEvent;
    _copy();
    if (copyEvent.touches && copyEvent.touches.length) {
      copyEvent = copyEvent.touches[0];
      _copy();
    } else if (copyEvent.changedTouches && copyEvent.changedTouches.length) {
      copyEvent = copyEvent.changedTouches[0];
      _copy();
    }

    function _copy() {
      mustEventProperties.forEach(function(prototype) {
        if (prototype in copyEvent) createEvent[prototype] = copyEvent[prototype];
      });
    }
    return createEvent;
  }
});
define("yquery/1.7.1/6-animate-debug", ["yquery/1.7.1/0-core-debug"], function(require, exports, module) {
  // 6-animate.js
  // 2014年7月15日13:18:41
  var $ = require("yquery/1.7.1/0-core-debug"),
    udf,
    regNumericCss = /width|height|top|right|bottom|left/i,
    // yquery MAP
    yqueryStore = {},
    win = window,
    idKey = $._id,
    transitionendEventType = $.html5(win, 'ontransitionend').slice(2);
  $.fn.extend({
    /**
     * 动画
     * 私有接口
     * @param  {Object}   to       终点
     * @param  {Number}   duration 动画时间
     * @param  {String}   easing   动画缓冲效果[ linear | ease | ease-in | ease-out | ease-in-out ]
     * @param  {Function} callback 回调
     * @param  {Array}    store    需要记住的css值
     * @return $
     * @private
     * @version 1.0
     * 2014年6月25日15:27:50
     *
     * 0:
     * _animate(to, udf, udf, udf, store, fn);
     *
     * 1:
     * _animate(to, fn, udf, udf, store, fn);
     * _animate(to, 300, udf, udf, store, fn);
     *
     * 2:
     * _animate(to, 300, fn, udf, store, fn);
     * _animate(to, 300, 'easing', udf, store, fn);
     *
     * 3:
     * _animate(to, 300, 'easing', fn, store, fn);
     */
    _animate: function(to, duration, easing, callback, store, doCallback) {
      var dftEasing = 'ease-in-out',
        dftCallback = $.noop;
      if (duration === udf) {
        duration = 1;
        easing = dftEasing;
        callback = dftCallback;
      } else if ($.type(duration) === 'function') {
        callback = duration;
        duration = 1;
        easing = dftEasing;
      } else if ($.type(duration) === 'number') {
        switch ($.type(easing)) {
          case 'undefined':
            easing = dftEasing;
            callback = dftCallback;
            break;
          case 'function':
            callback = easing;
            easing = dftEasing;
            break;
          case 'string':
            if ($.type(callback) !== 'function') callback = dftCallback;
            break;
        }
      }
      if (to === udf) {
        return this.each(function() {
          if ($.type(doCallback) === 'function') {
            doCallback.call(this, callback);
          } else {
            callback.call(this);
          }
        });
      }
      var callbackLength = 0,
        the = this,
        length = the.length;
      return the.each(function() {
        var element = this;
        if ($.type(to) === 'function') to = to.call(element);
        _animate(element, to, duration, easing, function(isScroll) {
          if (!callbackLength && !isScroll) the.css({
            'transition-duration': '',
            'transition-property': '',
            'transition-timing-function': ''
          });
          callbackLength++;
          if (callbackLength === length) {
            if ($.type(doCallback) === 'function') {
              doCallback.call(element, callback);
            } else {
              callback.call(element);
            }
          }
        }, store);
      });
    },
    /**
     * 动画
     * 对外接口
     * @param  {Object}   to       终点
     * @param  {Number}   duration 动画时间
     * @param  {String}   easing   动画缓冲效果[ linear | ease | ease-in | ease-out | ease-in-out ]
     * @param  {Function} callback 回调
     * @return {[type]} [description]
     * @return $
     * @version 1.0
     * 2014年6月25日15:27:50
     */
    animate: function(to, duration, easing, callback) {
      return this._animate(to, duration, easing, callback);
    },
    /**
     * 结束动画
     * @param  {Boolean} isGoToEnd  是否跳到动画结尾，默认false
     * @return this
     * @version 1.0
     * 2014年6月16日10:57:55
     */
    stop: function(isGoToEnd) {
      return this.each(function() {
        var element = this;
        if (!_store(element, 'animateTo')) return !1;
        // stop true
        if (isGoToEnd) {
          $.css3(element, 'transition-duration', '');
          $.css3(element, 'transition-property', '');
          $.css3(element, 'transition-timing-function', '');
          _store(element, 'animateTo', !1);
          _store(element, 'animateCallback')();
        }
        // stop false
        else {
          $.css3(element, 'transition-duration', '.01ms');
          $.each(_store(element, 'animateTo'), function(key) {
            $.css3(element, key, $.css3(element, key));
          });
        }
      });
    }
  });
  // $.fn.fadeIn
  // $.fn.fadeOut
  ['In', 'Out'].forEach(function(val, key) {
    $.fn['fade' + val] = function(duration, easing, callback) {
      var to = {},
        store, doCallback, the = this;
      // out
      if (key) {
        to.opacity = 0;
        store = ['display'];
        doCallback = function(cb) {
          if (the.css('opacity') === '0') the.css('display', 'none');
          cb.call(this);
        };
      }
      // in
      else {
        the.each(function() {
          if ($.css3(this, 'display') === 'none') {
            $.css3(this, 'display', _store(this, 'display') || 'block');
          }
        });
        to.opacity = 1;
      }
      return the._animate(to, duration, easing, callback, store, doCallback);
    };
  });
  // $.fn.show
  // $.fn.hide
  ['show', 'hide'].forEach(function(fnName, index) {
    $.fn[fnName] = function(duration, easing, callback) {
      var store, doCallback, the = this,
        to;
      to = !index && the.css('display') !== 'none' ? udf : function() {
        return {
          width: index ? 0 : (_store(this, 'width') || ''),
          height: index ? 0 : (_store(this, 'height') || '')
        };
      };
      // hide
      if (index) {
        store = ['width', 'height', 'display'];
        doCallback = function(cb) {
          cb.call(this);
          if ($.parseFloat(the.css('width')) === 0 && $.parseFloat(the.css('height')) === 0) the.css('display', 'none');
        };
      }
      // show
      else {
        the.each(function() {
          if ($.css3(this, 'display') === 'none') {
            $.css3(this, 'display', _store(this, 'display') || 'block');
          }
        });
      }
      return the._animate(to, duration, easing, callback, store, doCallback);
    };
  });
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////[ private API ]///////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**
   * 设置 requestAnimationFrame
   * @param {Function} 回调
   * @return {Number}  动画ID
   */
  var _requestAnimationFrame = (function() {
    return win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.oRequestAnimationFrame || function(callback) {
      return setTimeout(callback, 1000 / 60);
    };
  })();
  /**
   * 清除 requestAnimationFrame
   * @param {Number} 动画ID
   */
  // var _cancelRequestAnimationFrame = (function() {
  //     return win.cancelRequestAnimationFrame || win.webkitCancelRequestAnimationFrame || win.mozCancelRequestAnimationFrame || win.oCancelRequestAnimationFrame || function(requestAnimationFrameId) {
  //         clearTimeout(requestAnimationFrameId);
  //     };
  // })();
  /**
   * 滚动动画
   * @param  {Number}   left     滚动的左距离，可以为null
   * @param  {Number}   top      滚动的上距离，可以为null
   * @param  {Number}   duration 滚动的消耗时间
   * @param  {Function} callback 滚动结束回调
   * @return undefined
   * @version 1.0
   * 2014年7月6日22:42:34
   */
  function _animateScroll(element, left, top, duration, callback) {
    var isTop = left === null,
      suffix = isTop ? 'Top' : 'Left',
      from = $(element)['scroll' + suffix](),
      to = isTop ? top : left,
      totalDistance = Math.abs(to - from),
      flag = to < from ? -1 : 1,
      perMillisecond = totalDistance / duration,
      beginTimestamp = 0,
      pastTime = 0,
      pastDistance = 0;
    (function _recursion() {
      if (!beginTimestamp) beginTimestamp = Date.now();
      // 15毫秒移动的距离大于总距离 || 花费时间大于计划时间 || 花费距离大于计划距离
      if (pastTime >= duration || pastDistance >= totalDistance) {
        $(element)['scroll' + suffix](to);
        callback.call(element, !0);
      } else {
        _requestAnimationFrame(function() {
          var thisTimestamp = Date.now();
          pastTime = thisTimestamp - beginTimestamp;
          pastDistance = pastTime * perMillisecond;
          $(element)['scroll' + suffix](from + flag * pastDistance);
          _recursion();
        });
      }
    })();
  }
  /**
   * 执行动画
   * TODO: 判断开始与结束是否相等
   * @param  {Element}  element  元素
   * @param  {Object}   to       终点
   * @param  {Number}   duration 时间
   * @param  {String}   easing   过渡效果
   * @param  {Function} callback 回调
   * @param  {Array}    store    记住当前位置，以备下次使用
   * @version 1.2
   * 2014年6月13日18:23:09
   * 2014年6月16日12:28:39
   * 2014年7月6日22:44:57
   */
  function _animate(element, to, duration, easing, callback, store) {
    var keys = [],
      toKeys = Object.keys(to),
      toKey0,
      toVal0,
      newTo = {};
    // animate scroll
    if (toKeys.length === 1) {
      toKey0 = $.toHumpString(toKeys[0]);
      toVal0 = to[toKeys[0]];
      if (toKey0 === 'scrollTop') return _animateScroll(element, null, toVal0, duration, callback);
      else if (toKey0 === 'scrollLeft') return _animateScroll(element, toVal0, null, duration, callback);
    }
    if (duration === 0) duration = 1;
    $.each(to, function(key, val) {
      if (regNumericCss.test(key) && $.isNumeric(val, !0)) val += 'px';
      val += '';
      if ($.css3(element, key) !== val) {
        newTo[key] = val;
        keys.push(key);
      }
    });
    // 空目标 或 隐藏元素 或 空目标
    if ($.isEmptyObject(newTo) || $.css3(element, 'display') === 'none' || !keys) return callback();
    // 动画最后目标
    _store(element, 'animateTo', to);
    // 动画最后回调
    _store(element, 'animateCallback', callback);
    // 动画完成长度
    _store(element, 'animateDone', 0);
    // 动画总长度
    _store(element, 'animateLength', keys.length);
    (store || []).forEach(function(key) {
      _store(element, key, $.css3(element, key));
    });
    // 监听，只执行最后一次回调
    if (!_store(element, 'animateHasCallback')) {
      $(element).bind(transitionendEventType, function() {
        _store(element, 'animateHasCallback', !0);
        _store(element, 'animateDone', _store(element, 'animateDone') + 1);
        if (_store(element, 'animateDone') === _store(element, 'animateLength')) {
          if (_store(element, 'animateTo')) {
            $.css3(element, 'transition-duration', '');
            $.css3(element, 'transition-property', '');
            $.css3(element, 'transition-timing-function', '');
            _store(element, 'animateTo', !1);
            _store(element, 'animateCallback')();
          }
        }
      });
    }
    $.css3(element, 'transition-duration', duration + 'ms');
    $.css3(element, 'transition-property', keys.join(','));
    $.css3(element, 'transition-timing-function', easing);
    setTimeout(function() {
      for (var i in to) {
        keys.push($.css3(element, i, to[i]));
      }
    }, 0);
  }
  /**
   * 读取或设置元素的存储数据
   * @param {Element} element 元素
   * @param {String}  key     键
   * @param {*}       val     值
   * @version 1.0
   * 2014年6月25日11:53:06
   */
  function _store(element, key, val) {
    if (yqueryStore[element[idKey]] === udf) yqueryStore[element[idKey]] = {};
    if (val === udf) return yqueryStore[element[idKey]][key];
    yqueryStore[element[idKey]][key] = val;
  }
});
define("yquery/1.7.1/7-ajax-debug", ["yquery/1.7.1/0-core-debug", "yquery/1.7.1/Deferred-debug"], function(require, exports, module) {
  // 7-ajax.js
  // 2014年7月15日13:46:49
  var $ = require("yquery/1.7.1/0-core-debug"),
    Deferred = require("yquery/1.7.1/Deferred-debug"),
    udf,
    win = window,
    doc = win.document,
    defaults = {
      ajax: {
        url: '',
        headers: null,
        data: null,
        type: 'get',
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        username: null,
        password: null,
        dataType: 'json',
        timeout: 0,
        isNoCache: !0,
        isUpload: !1
      }
    };
  $.fn.extend({
    /**
     * 表单序列化集合中的第一个表单
     * @return {Object} FormData instance
     * @version 1.0
     * 2014年7月6日09:56:27
     */
    serialize: function() {
      return this._access(function() {
        if (this.nodeName) return new FormData(this);
      }, udf);
    }
  });
  $.extend({
    param: _httpBuildQuery,
    ajaxSetup: function(settings) {
      $.extend(defaults.ajax, settings);
    },
    // ajax
    ajax: function(settings) {
      var deferred = new Deferred(),
        xhr = new XMLHttpRequest(),
        options = $.extend({}, defaults.ajax, settings),
        hasCallback = 0,
        isGet = options.type == 'get',
        isFormData = options.data && options.data.constructor === FormData;
      if (!options.headers) options.headers = {};
      options.headers['X-Requested-With'] = 'XMLHttpRequest';
      if (isFormData) {
        options.type = 'post';
      } else {
        if (isGet) {
          options.url = _URLParm(options.url, options.data, options.isNoCache);
          options.data = null;
        } else {
          if (options.contentType) options.headers['content-type'] = options.contentType;
          options.data = _httpBuildQuery(options.data);
        }
      }
      xhr.onload = function() {
        var response = xhr.responseText,
          status = xhr.status,
          state = xhr.readyState;
        if (!hasCallback && state == 4) {
          hasCallback = 1;
          if (status === 200) {
            if (options.dataType === 'json') {
              try {
                response = JSON.parse(response);
              } catch (e) {
                response = null;
              }
            }
            deferred.resolve(xhr, response, xhr);
          } else {
            deferred.reject(xhr, xhr);
          }
        }
      };
      xhr.onerror = function() {
        deferred.reject(xhr, xhr);
      };
      xhr.onabort = function() {
        deferred.reject(xhr, xhr);
      };
      xhr.ontimeout = function() {
        deferred.reject(xhr, xhr);
      };
      if (options.isUpload) {
        xhr.upload.onprogress = function(e) {
          if (e.lengthComputable) deferred.run(xhr, e);
        };
      }
      xhr.open(options.type, options.url, !0, options.username, options.password);
      $.each(options.headers, function(key, val) {
        xhr.setRequestHeader(key, val);
      });
      xhr.send(options.data);
      return deferred;
    },
    // 获取脚本
    getScript: function(settings) {
      var options = $.extend({}, defaults.getScript, settings),
        script = _createElement('script', {
          src: _URLParm(options.url, options.data, !0),
          onload: function() {
            deferred.resolve(win);
          },
          onerror: function() {
            deferred.reject(win);
          }
        }),
        deferred = new Deferred();
      $('head').append(script);
      return deferred;
    },
    // 跨域请求获得JSONP数据
    getJSON: function(settings) {
      var options = $.extend({}, defaults.getJSONP, settings),
        fnName = 'yquery_' + Date.now(),
        script,
        deferred = new Deferred();
      win[fnName] = function() {
        deferred.resolve(win, arguments[0]);
        delete(win[fnName]);
        script.remove();
      };
      options.url = options.url.replace(/\?$/, fnName);
      script = _createElement('script', {
        src: _URLParm(options.url, options.data, !0),
        onerror: function() {
          deferred.reject(win);
          delete(win[fnName]);
          script.remove();
        }
      });
      $('head').append(script);
      return deferred;
    }
  });
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////[ private API ]///////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**
   * 是否为可输出的字符串
   * 包括数字和字符串
   * @param {*} obj 任何
   * @return {Boolean}
   * @version 1.0
   * 2013年12月27日10:42:16
   */
  function _isPlainString(obj) {
    var type = $.type(obj);
    return type == 'string' || type == 'number';
  }
  /**
   * 构建URLparam部分
   * @param {String} url URL
   * @param {Object} data 数据
   * @param {Boolean} isNoCache 是否无cache
   * @return {String}    新URL
   */
  function _URLParm(url, data, isNoCache) {
    var reg, begin = '_',
      hasFind = 0,
      time = Date.now();
    url = url.replace(/#.*$/, '');
    url += url.indexOf('?') == -1 ? '?' : '&';
    data = data || {};
    if (data !== udf) {
      // 无缓存
      if (isNoCache) {
        reg = new RegExp('\\?' + begin + '=|&' + begin + '=');
        hasFind = reg.test(url);
        while (hasFind) {
          reg = new RegExp('\\?' + begin + '=|&' + begin + '=');
          if (reg.test(url)) {
            begin += '_';
          } else {
            hasFind = 0;
          }
        }
        data[begin] = time;
      }
      url += _httpBuildQuery(data);
    }
    return url;
  }
  /**
   * 转换对象为 querystring 字符串
   * @version 1.1
   * @param {Object} object 对象
   * @return {String} 字符串
   * 2013年7月18日22:18:59
   * 2013年12月26日13:23:41
   */
  function _httpBuildQuery(object) {
    function _(key, val) {
      var t, i, v, a = [],
        deepKey;
      key = key || '';
      for (i in val) {
        v = val[i];
        t = $.type(v);
        deepKey = (key ? key + '[' : '') + i + (key ? ']' : '');
        if (_isPlainString(v)) {
          a.push(deepKey + '=' + v);
        } else if (t == 'array' || t == 'object') {
          a.push(_(deepKey, v));
        }
      }
      return a.join('&');
    }
    return _('', object);
  }
  /**
   * 创建 Element
   * @param  {String} tagName    标签
   * @param  {Object} properties 属性键值对
   * @return {Object} 创建对象
   * @version 1.0
   * 2014年6月13日17:19:31
   */
  function _createElement(tagName, properties) {
    var element = doc.createElement(tagName),
      i;
    for (i in properties) {
      element[i] = properties[i];
    }
    return element;
  }
});
define("yquery/1.7.1/Deferred-debug", [], function(require, exports, module) {
  // Deferred.js
  // 2014年7月15日13:39:10
  module.exports = Deferred;
  /**
   * Deferred
   * @constructor
   */
  function Deferred() {
    var the = this;
    // 进度回调队列
    the.progressQueue = [];
    // 成功回调队列
    the.doneQueue = [];
    // 失败回调队列
    the.failQueue = [];
    // 总是回调
    the.alwaysQueue = [];
    // 是否已经执行回调了
    the.hasCallback = !1;
    // 状态
    the.state = 'pending';
  }
  Deferred.prototype = {
    /**
     * 成功回调入栈
     * @param  {Function} callback 成功回调
     */
    progress: function(callback) {
      this.progressQueue.push(callback);
      return this;
    },
    /**
     * 成功回调入栈
     * @param  {Function} callback 成功回调
     */
    done: function(callback) {
      this.doneQueue.push(callback);
      return this;
    },
    /**
     * 失败回调入栈
     * @param  {Function} callback 失败回调
     */
    fail: function(callback) {
      this.failQueue.push(callback);
      return this;
    },
    /**
     * 总是回调入栈
     * @param  {Function} callback 失败回调
     */
    always: function(callback) {
      this.alwaysQueue.push(callback);
      return this;
    },
    /**
     * 不间断一直执行回调
     * 如进度等
     * @param  {*}  the  this
     * @param  {*}  args  传参
     * @version 1.0
     * 2014年6月13日16:18:25
     */
    run: function(the) {
      if (this.hasCallback) return;
      var args = [].slice.call(arguments, 1);
      this.progressQueue.forEach(function(fn) {
        fn.apply(the, args);
      });
    },
    /**
     * 执行成功回调
     * @param  {*}  the  this
     * @param  {*}  args  传参
     * @version 1.0
     * 2014年6月13日16:13:27
     */
    resolve: function(the) {
      if (this.hasCallback) return;
      this.state = 'resolved';
      var args = [].slice.call(arguments, 1);
      this.hasCallback = !0;
      this.doneQueue.forEach(function(fn) {
        fn.apply(the, args);
      });
      this.alwaysQueue.forEach(function(fn) {
        fn.apply(the, args);
      });
    },
    /**
     * 执行失败回调
     * @param  {*}  the  this
     * @param  {*}  args  传参
     * @version 1.0
     * 2014年6月13日16:13:31
     */
    reject: function(the) {
      if (this.hasCallback) return;
      this.state = 'rejected';
      var args = [].slice.call(arguments, 1);
      this.hasCallback = !0;
      this.failQueue.forEach(function(fn) {
        fn.apply(the, args);
      });
      this.alwaysQueue.forEach(function(fn) {
        fn.apply(the, args);
      });
    }
  };
});