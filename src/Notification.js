"use strict";
var Notification = me.Renderable.extend({
	/**
	 * @param {Node} node
	 */
	init: function() {
		this._super(me.Renderable, 'init', [0, 0, window.app.screenWidth, window.app.screenHeight]);
		this.anchorPoint = new me.Vector2d(0, 0);
		this.z = 50;
		this.font = new me.BitmapFont("16x16_font", 16);
	},

	setText: function(text) {
		this.clear = false;
		this.text = text;
		// invalidate metrics cache
		this.metrics = null;
		this.font.alpha = 1.0;
		if(this.fader) {
			this.fader.stop();
		}
		this.fader = new me.Tween(this.font);
		this.fader.to({ alpha : 0, }, 4500);
		this.fader.onComplete(() => { this.text = null; }).start();
	},

	draw: function(ctx) {
		if(this.text) {
			this.metrics = this.metrics || this.font.measureText(ctx, this.text);
			var x = window.app.screenWidth/2 - this.metrics.width / 2;
			var y = 100;
			this.font.draw(ctx, this.text.toUpperCase(), x, y);
		}
	},

	update: function(dt) {
	}
});
