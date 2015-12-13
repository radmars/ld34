"use strict";
var BGColor = me.Renderable.extend({
	init: function() {
		this._super(me.Renderable, 'init', [0, 0, window.app.screenWidth, window.app.screenHeight]);
		this.z = -10
	},
	draw: function(context) {
		context.setColor('#000');
		context.fillRect(0, 0, window.app.screenWidth, window.app.screenHeight);
	},
});
