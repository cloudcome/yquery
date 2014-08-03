#yquery [![spm version](http://spmjs.io/badge/yquery)](http://spmjs.io/package/yquery)

ydr's jquery as yquery 


# FEATURES
- 为标准而生，不知道IE9(lte)是什么，我只认识chrome。
- 没有复杂的兼容考虑，最精简的代码，适合现代浏览器。与jQuery和zepto相比，适用场景略窄。
- 接近完美的CSS3动画。
- 可以直接不带浏览器前缀获取、设置CSS。
- 大部分API与jQuery一致，0学习成本。
- 更小的代码体积，加载更快。
- 模块化管理。


#USAGE
````
var $ = require('yquery');
$('#demo').click(function(){
	$(this).addClass('active');
});
````


#EXTEND
````
module.exports = function($){
	$.fn.myPluginName = fn;
	$.myPluginName = fn;
};
````
[一个jquery原型类插件写法模板](http://qianduanblog.com/post/a-jquery-prototype-class-plugin-writing-template.html)



# MODULES

## 0-core
- `$.fn.extend`
- `$.extend`
- `$.isArray`
- `$.isObject`
- `$.isFunction`
- `$.isString`
- `$.isElement`
- `$.isNumber`
- `$.isNumber`
- `$._id`
- `$.isReady`
- `$.isYquery`
- `$.readyFunctions`
- `$.noop`
- `$.each`
- `$.type`
- `$.html5`
- `$.css3`
- `$.inArray`
- `$.isNumeric`
- `$.toHumpString`
- `$.parseFloat`
- `$.isEmptyObject`


## 1-selector
- `$.fn._access`
- `$.fn.find`
- `$.fn.each`
- `$.fn.eq`
- `$.fn.last`
- `$.fn.prev`
- `$.fn.next`
- `$.fn.index`
- `$.fn.has`
- `$.fn.not`
- `$.fn.filter`
- `$.fn.closest`
- `$.fn.parent`
- `$.fn.contents`
- `$.fn.children`
- `$.fn.add`


## 2-modify
- `$.fn.clone`
- `$.fn.append`
- `$.fn.prepend`
- `$.fn.before`
- `$.fn.after`
- `$.fn.remove`
- `$.fn.empty`
- `$.fn.html`
- `$.fn.text`
- `$.fn.wrap`
- `$.fn.appendTo`
- `$.fn.prependTo`
- `$.fn.insertBefore`
- `$.fn.insertAfter`


## 3-attr-prop
- `$.fn._getSet`
- `$.fn.attr`
- `$.fn.removeAttr`
- `$.fn.prop`
- `$.fn.val`
- `$.fn.data`
- `$.fn.css`
- `$.fn.addClass`
- `$.fn.removeClass`
- `$.fn.hasClass`


## 4-pos-size
- `$.fn.position`
- `$.fn.offset`
- `$.fn.width`
- `$.fn.innerWidth`
- `$.fn.outerWidth`
- `$.fn.clientWidth`
- `$.fn.height`
- `$.fn.innerHeight`
- `$.fn.outerHeight`
- `$.fn.clientHeight`
- `$.fn.scrollTop`
- `$.fn.scrollLeft`


## 5-event
- `$.fn.bind`
- `$.fn.tapick`
- `$.fn.on`
- `$.fn.trigger`
- `$.fn.blur`
- `$.fn.focus`
- `$.fn.focusin`
- `$.fn.focusout`
- `$.fn.load`
- `$.fn.resize`
- `$.fn.scroll`
- `$.fn.unload`
- `$.fn.dblclick`
- `$.fn.mousedown`
- `$.fn.mouseup`
- `$.fn.mousemove`
- `$.fn.mouseover`
- `$.fn.mouseout`
- `$.fn.mouseenter`
- `$.fn.change`
- `$.fn.select`
- `$.fn.submit`
- `$.fn.keydown`
- `$.fn.keypress`
- `$.fn.keyup`
- `$.fn.error`
- `$.fn.contextmenu`
- `$.fn.tap`
- `$.fn.taphold`
- `$.fn.swipe`
- `$.fn.swipeup`
- `$.fn.swiperight`
- `$.fn.swipedown`
- `$.fn.swipeleft`


## 6-animate
- `$.fn._animate`
- `$.fn.animate`
- `$.fn.stop`
- `$.fn.fadeIn`
- `$.fn.fadeOut`
- `$.fn.show`
- `$.fn.hide`


## 7-ajax
- `$.fn.serialize`
- `$.param`
- `$.ajaxSetup`
- `$.ajax`
- `$.getScript`
- `$.getJSON`

