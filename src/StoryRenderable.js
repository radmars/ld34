"use strict";
var StoryRenderable = me.Renderable.extend({
	init: function(node, font) {
		this._super(me.Renderable, 'init', [0, 0, window.app.screenWidth, window.app.screenHeight]);
		this.node = node;
		this.font = font;
		this.imageCache = {};
		this._localScale = .8;
	},

	getImage: function() {
		var bg = this.node.bg;
		var cache = this.imageCache;
		if(!cache[bg]) {
			var image = new me.Sprite(0, 0, {
				image: bg,
			});
			image.anchorPoint = new me.Vector2d(0, 0);
			image.pos = this.pos;
			cache[bg] = image;
		}
		return cache[bg];
	},

	setPosition: function(index, current) {
		this._current = index == current;
		var depth = Math.abs(current - index);
		var newScale;

		if(this._current) {
			newScale = .8;
		}
		else {
			newScale = .4;
		}
		this.z = 5 - depth;

		if(this.scaleTween) { this.scaleTween.stop() }
		this.scaleTween = new me.Tween(this)
			.to({_localScale: newScale}, 1000)
			.onUpdate(() => { this.getImage().scale(this._localScale, this._localScale); })
			.start();

		var image = this.getImage();

		if(this.positionTween) { this.positionTween.stop() }
		this.positionTween = new me.Tween(this.pos)
			.to({
				y: window.app.screenHeight/2 - (
					(current - index) * (40 + image.height * newScale)
					+ image.height / 2 * newScale
				),
				x: window.app.screenWidth/2 - image.width / 2 * newScale,
			})
			.start();
	},

	draw: function(ctx) {
		var image = this.getImage();
		image.draw(ctx);

		if(this.node.left && this._current) {
			var w = image.width * this._localScale;
			var h = image.height * this._localScale;
			var lp = this.node.left.pos;
			var rp = this.node.right.pos;
			this.font.draw(ctx, this.node.left.str.toUpperCase(), this.pos.x + lp.x *w, this.pos.y + lp.y * h);
			this.font.draw(ctx, this.node.right.str.toUpperCase(), this.pos.x + rp.x *w, this.pos.y + rp.y * h);
		}
	},
});
