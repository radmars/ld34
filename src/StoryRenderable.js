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
		this.z = 5;
		this.font = font;
	},

	draw: function(ctx) {
		this._super(me.Sprite, 'draw', [ctx]);
		if(this.node.left) {
			var w = this.image.width * this._scale.x;
			var h = this.image.height * this._scale.y;
			var lp = this.node.left.pos;
			var rp = this.node.right.pos;
			this.font.draw(ctx, this.node.left.str.toUpperCase(), this.pos.x + lp.x *w, this.pos.y + lp.y * h);
			this.font.draw(ctx, this.node.right.str.toUpperCase(), this.pos.x + rp.x *w, this.pos.y + rp.y * h);
		}
	},

	update: function(dt) {
	}
});
