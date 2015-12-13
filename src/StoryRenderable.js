"use strict";
var StoryRenderable = me.Sprite.extend({
	/**
	 * @param {Node} node
	 */
	init: function(node, font) {
		this._super(me.Sprite, 'init', [0, 0, {
			image: node.bg,
		}]);
		this.node = node;
		this.anchorPoint = new me.Vector2d(0, 0);
		this.font = font;
	},

	setPosition: function(index, current) {
		this._current = index == current;
		this._localScale;

		if(this._current) {
			this._localScale = .8;
			this.z = 5;
		}
		else {
			this._localScale = .4;
			this.z = 4;
		}

		this.scale(this._localScale, this._localScale);
		this.pos.y = window.app.screenHeight/2 - (
			(current - index) * (40 + this.image.height * this._localScale)
			 + this.image.height / 2 * this._localScale
		 );

		this.pos.x = window.app.screenWidth/2 - this.image.width / 2 * this._localScale;
	},

	draw: function(ctx) {
		this._super(me.Sprite, 'draw', [ctx]);

		if(this.node.left && this._current) {
			var w = this.image.width * this._localScale;
			var h = this.image.height * this._localScale;
			var lp = this.node.left.pos;
			var rp = this.node.right.pos;
			this.font.draw(ctx, this.node.left.str.toUpperCase(), this.pos.x + lp.x *w, this.pos.y + lp.y * h);
			this.font.draw(ctx, this.node.right.str.toUpperCase(), this.pos.x + rp.x *w, this.pos.y + rp.y * h);
		}
	},
});
