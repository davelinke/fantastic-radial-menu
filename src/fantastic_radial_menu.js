(function ($) {
	//this function is a shortcut for $(self).data();
	$.d = function(key,val){
		if (typeof(val)=='undefined'){
			return $(self).data(key);
		} else {
			$(self).data(key,val);
		}
	};
	// this function makes unique ids dynamically
	$.makeId = function(){
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for( var i=0; i < 5; i++ ) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	};
	// this function creates DOM elements
	$.ce = function(t){
		return $(document.createElement(t));
	};
	// this function pops a layer that covers the entire screen and triggers a function on callback. Pretty handy to create a Click Outside behavior.
	$.fn.popHider = function(a){
		var t = this;
		var args = $.extend({
			callback:function(){},
			hideEvent:'click',
			hiderClass:'hider',
			appendTo:'body'
		}, a);
		var h = $.ce('div').addClass(args.hiderClass).css({
			'position':'fixed',
			'width':'100%',
			'height':'100%',
			'top':'0',
			'left':'0',
			'z-index':'1'
		});
		h.on(args.hideEvent,args.callback);
		$(args.appendTo).prepend(h);
	};
	// this function creates a fantastic radial menu
	$.fn.fantasticRadialMenu = function(a){
		// these are the defaults
		var args = $.extend({
			hyp:100,					// length in pixels of the hypotenuse (or how distant the sub-menu items should be)
			trig:'h2',					// selector string for the element triggering the animation
			firingEvent:'click',		// event that will fire the menu transition (click, hover)
			wrap:'ul',					// selector string of the wrapper of the menu items
			item:'li',					// selector string of the menu items
			span:360,					// span in degrees on the menu items to go across
			duration:300,				// duration of the animation
			delay:75,					// delay between each sub-item transition
			angStart:0,					// at what angle in degrees is the starting element?
			direction:'anticlockwise',	// what direction should we render the following element?
			offClassName:'off',			// name of the class for when the menu is off
			reposition:false			// use this argument to reposition the menu items once the menu is in display
		},a);
		
		this.each(function(){
			var t = $(this);
			var trig = t.find(args.trig);
			var items = t.find(args.item);
			
			if (!args.reposition){
				var hc = $.makeId();
				var killMenu = function(){
					t.find(args.item).addClass(args.offClassName);
					t.find(args.trig).addClass(args.offClassName);
					$('.'+hc).remove();
				};
				t.find(args.trig).addClass(args.offClassName).on(args.firingEvent,function(){
					var th = $(this);
					if (th.hasClass(args.offClassName)){
						t.find(args.item).removeClass(args.offClassName);
						t.find(args.trig).removeClass(args.offClassName);
						t.popHider({
							hiderClass:hc + ' fantasticRadialMenuHider',
							callback:function(){
								killMenu();
							}
						});
					}else{
						killMenu();
					}
				});
			}
			var il = items.length;
			var steps = args.span/(il-1);
			for (var i=0;i<items.length;i++){
				var dirVar = (args.direction=='anticlockwise')?1:-1;
				var sumSteps = (steps*i) * dirVar;
				var degAng = args.angStart + sumSteps;//(steps*i);
				var ang = Math.PI * (degAng/180); // converted to radians
				var sang = Math.sin(ang);
				var cang = Math.cos(ang);
				var co = Math.round(args.hyp * sang);
				var ca = Math.round(args.hyp * cang);
				var td = args.delay*(i+1);
				t.find(args.item+':eq('+i+')').addClass((args.reposition?'':args.offClassName)).css({
					'left':ca+'px',
					'top':(-1*co)+'px',
					'transition':'all '+args.duration+'ms ease',
					'-moz-transition-delay':(args.delay*i)+'ms',
					'-webkit-transition-delay':(args.delay*i)+'ms',
					'-moz-transition-delay':(args.delay*i)+'ms',
					'-o-transition-delay':(args.delay*i)+'ms',
					'transition-delay':(args.delay*i)+'ms'
				});
			}
		});
	};
	// this function determines if the device has touch-screen capabilities
	$.isTouchable = function(){
		return 'ontouchstart' in document.documentElement;
	};
})(jQuery);