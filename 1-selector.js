// 1-selector.js
// 2014年7月15日10:20:15

'use strict';
var $ = require('./0-core'),
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

            $(children).each(function() {
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
