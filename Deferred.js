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


