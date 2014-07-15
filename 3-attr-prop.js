// 3-attr-prop.js
// 2014年7月15日12:04:07

var $ = require('./0-core'),
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
