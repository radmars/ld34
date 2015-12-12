var StoryRenderable = me.Sprite.extend({
	/**
	 * @param {Node} node
	 */
	init: function(node) {
		this._super(me.Sprite, 'init', [0, 0, {
			image: node.bg,
		}]);
		this.z = 5;
	},

	update: function(dt) {
	}
});
