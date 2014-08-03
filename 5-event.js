// 5-event.js
// 2014年7月15日12:11:53

'use strict';

var $ = require('./0-core'),
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




