// 6-animate.js
// 2014年7月15日13:18:41


'use strict';

var $ = require('./0-core'),
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




