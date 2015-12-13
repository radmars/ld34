"use strict";
var Notification = me.Renderable.extend({
	/**
	 * @param {Node} node
	 */
	init: function() {
		this._super(me.Renderable, 'init', [0, 0, window.app.screenWidth, window.app.screenHeight]);
		this.anchorPoint = new me.Vector2d(0, 0);
		this.z = 5;
		this.font = new me.BitmapFont("16x16_font", 16);
	},

	setText: function(text) {
		this.clear = false;
		this.text = text;
		// invalidate metrics cache
		this.metrics = null;
		this.font.alpha = 1.0;
		var fader = new me.Tween(this.font);
		fader.to({
			alpha : 0,
		}, 1500).onComplete((function () {
			this.text = null;
		}).bind(this)).start();
	},

	draw: function(ctx) {
		if(this.text) {
			this.metrics = this.metrics || this.font.measureText(ctx, this.text);
			var x = window.app.screenWidth/2 - this.metrics.width / 2;
			var y = 30;
			this.font.draw(ctx, this.text.toUpperCase(), x, y);
		}
	},

	update: function(dt) {
	}
});
