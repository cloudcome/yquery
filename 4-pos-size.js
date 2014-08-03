// 4-pos-size.js
// 2014年7月15日12:12:45


'use strict';

var $ = require('./0-core'),
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


