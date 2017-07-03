var dropRefresh = function(el, option){

	//初始化参数
	var defaults = {
		trigger: $('body'),
		maxY: 40,
		onReload: function(){}
	}

	//合并参数
	var params = $.extend({}, defaults, option || '');

	var data = {} //对象集合

	var self = this;

	//初始化样式
	self.el = el.css('borderBottom','0px solid transparent');

	self.callback = function(){
		reload: params.onReload
	}

	var maxY = params.maxY;

	params.trigger.on({
		touchstart: function(event){
			var events = event.touches[0];
			data.scrollY = $(window).scrollTop();//获取window距离顶部的高度
			data.posY = events.pageY;//获取触点y轴位置
			data.posX = events.pageX;//获取触点x轴位置
			data.touching = true;//开关
			data.markY = -1; //判断是否为正常下拉刷新状态
		},
		touchmove: function(event){
			if (data.touching !== true){
				return false
			}
			var events = event.touches[0];
			data.newPosY = events.pageY;
			data.newPosX = events.pageX;
			data.distanceY = data.newPosY - data.posY;
			data.distanceX = data.newPosX - data.posX;
			if(data.scrollY == 0){
				//阻止滚动时默认的滚动条行为
				if(data.distanceY > 0 || data.markY > 0){
					event.preventDefault();
				}
				//当前状态是否为下拉刷新状态
				if(data.distanceY > 0 && data.markY == -1){
					data.markY = data.distanceY;
				}
				//下拉刷新时操作
				if(data.markY > 0 && el.data('loading') != true){
					var heightVal = Math.min(maxY, data.distanceY);
					var borderBottomWidth = 0;
					if(heightVal == maxY){
						borderBottomWidth = data.distanceY - maxY;
					}
					el.css({
						'height': heightVal,
						'borderBottomWidth': borderBottomWidth,
						'transition': ''
					}).data('loading', false);
				}
			}
		},
		touchend: function(){
			if (data.touching !== true){
				return false
			}
			//是否在下拉刷新状态
			if(data.markY > 0){
				if(data.distanceY > maxY){
					el.css({
						'borderBottomWidth': '0',
						'transition': ''
					}).data('loading', true);
					params.onReload.call(self)
				}else{
					self.origin();
				}
			}
			data.touching = false;
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
	}).data('loading', false)
}