// 2-modify.js
// 2014年7月15日10:57:10


var $ = require('./0-core'),
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
