// 7-ajax.js
// 2014年7月15日13:46:49



var $ = require('./0-core'),
    Deferred = require('./Deferred'),
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
            if (this.nodeName)
                return new FormData(this);
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

        xhr.onerror = xhr.onabort = xhr.ontimeout = function() {
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
