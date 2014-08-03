// 0-core.js
// 2014年7月15日09:52:56


'use strict';

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
    noop: function(){},
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
    else if (type === 'element' || type === 'array' || type === 'nodelist' || type==='htmlcollection') {
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



