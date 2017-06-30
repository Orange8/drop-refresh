var dropRefresh = function(el, option){

	var defaults = {
		trigger: $('body'),
		maxY: 40,
		onReload: function(){}
	}

	var params = $.extend({}, defaults, option || '');

	var data = {} //对象集合

	var self = this;

	self.el = el.css('borderBottom','0px solid transparent');

	self.callback = function(){
		reload: params.onReload
	}

	var maxY = params.maxY;

	params.trigger.on({
		touchstart: function(event){
			var events = event.touches[0];
			data.scrollY = $(window).scrollTop();
			data.posY = events.pageY;
			data.posX = events.pageX;
			//获取window距离顶部的高度
			//获取触点y轴位置
			//获取触点x轴位置
		},
		touchmove: function(event){
			var events = event.touches[0];
			data.newPosY = events.pageY;
			data.newPosX = events.pageX;
			data.distanceY = data.newPosY - data.posY;
			data.distanceX = data.newPosX - data.posX;
			if(data.distanceX > data.distanceY){
				return false
			}
			var heightVal = Math.min(maxY, data.newPosY)
			var borderBottomWidth = data.newPosY;
			if(data.scrollY == 0){
				el.css({
					'height': heightVal,
					'borderBottomWidth': (data.newPosY)/2,
					'transition': ''
				})
			}
			//获取触点y轴位置
			//计算y轴移动距离
			//计算x轴移动距离
			//x轴移动距离大于y轴移动距离判断为横屏滑动
			//判断window距离顶部的位置是否为0，不为0则为正常滚动，为0则执行加载动效
			//y轴移动距离为loading的border-bottom值，maxY为loading的height值
			//将移动距离暴露给touchEnd
		},
		touchend: function(){
			if(data.newPosY > maxY){
				el.css({
					'borderBottomWidth': '0',
					'transition': ''
				});
				params.onReload.call(self)
			}else{
				self.origin();
			}
			//判断y轴移动距离是否大于maxY
			//大于则border-bottom值置为0,小于则回归顶部
			//执行刷新数据操作
			//执行origin方法
		}
	})
}

//返回原始状态
dropRefresh.prototype.origin = function(){
	var self = this;
	var el = self.el;
	el.css({
		'borderBottomWidth':'0',
		'height': '0',
		'transition': ''
	})
}