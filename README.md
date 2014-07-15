#yquery [![spm version](http://spmjs.io/badge/yquery)](http://spmjs.io/package/yquery)

AUTHOR WEBSITE: [http://ydr.me/](http://ydr.me/)

ydr's jquery as yquery 

__IT IS [A spm package](http://spmjs.io/package/yquery).__


#between with jQuery
- 为标准而生，不知道IE9(lte)是什么，我只认识chrome。
- 没有复杂的兼容考虑，最精简的代码，适合现代浏览器。与jQuery和zepto相比，适用场景略窄。
- 接近完美的CSS3动画。
- 可以直接不带浏览器前缀获取、设置CSS。
- 最大程度的兼容jQuery，0学习成本。
- 更小的代码体积，加载更快。
- 有CDN加速，coming soon。__
- 丰富的插件配置，coming soon。


#usage
````
$(selector, context);
````


#how to extend
````
$.fn.yourPrototypeFunctionName
$.yourStaticFunctionName
````
[一个jquery原型类插件写法模板](http://qianduanblog.com/post/a-jquery-prototype-class-plugin-writing-template.html)



#DOM CURD
- `$.fn.appendTo`
- `$.fn.append`
- `$.fn.prependTo`
- `$.fn.prepend`
- `$.fn.insertBefore`
- `$.fn.before`
- `$.fn.insertAfter`
- `$.fn.after`
- `$.fn.remove`
- `$.fn.empty`
- `$.fn.html`
- `$.fn.text`
- `$.fn.wrap`


#DOM filter
- `$.fn.add`
- `$.fn.clone`
- `$.fn.find`
- `$.fn.eq`
- `$.fn.last`
- `$.fn.prev`
- `$.fn.next`
- `$.fn.siblings`
- `$.fn.has`
- `$.fn.not`
- `$.fn.filter`
- `$.fn.closest`
- `$.fn.parent`
- `$.fn.contents`
- `$.fn.children`


#normal native event
- `$.fn.blur`
- `$.fn.focus`
- `$.fn.focusin`
- `$.fn.focusout`
- `$.fn.load`
- `$.fn.resize`
- `$.fn.scroll`
- `$.fn.unload`
- `$.fn.click`
- `$.fn.dblclick`
- `$.fn.mousedown`
- `$.fn.mouseup`
- `$.fn.mousemove`
- `$.fn.mouseover`
- `$.fn.mouseout`
- `$.fn.mouseenter`
- `$.fn.mouseleave`
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
- `$.fn.tapick`


#events
- `$.fn.bind`
- `$.fn.on`
- `$.fn.trigger`


#animation
- `$.fn.animate`
- `$.fn.stop`
- `$.fn.show`
- `$.fn.hide`
- `$.fn.fadeIn`
- `$.fn.fadeOut`


#attr&prop
- `$.fn.attr`
- `$.fn.removeAttr`
- `$.fn.prop`
- `$.fn.val`
- `$.fn.data`
- `$.fn.css`
- `$.fn.addClass`
- `$.fn.removeClass`
- `$.fn.hasClass`


#position&size
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


#object type
- `$.type`
- `$.isArray`
- `$.isObject`
- `$.isFunction`
- `$.isString`
- `$.isElement`
- `$.isNumber`


#utils
- `$.fn.each`
- `$.fn.serialize`
- `$.fn.index`
- `$.extend`
- `$.each`
- `$.inArray`
- `$.removeInArray`
- `$.toHumpString`
- `$.param`
- `$.isNumeric`
- `$.isEmptyObject`
- `$.noop`
- `$.Event`
- `$.proxy`
- `$.tapSetup`
- `$.tapholdSetup`
- `$.swipeSetup`


