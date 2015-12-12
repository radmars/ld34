/** The game play state... */
var PlayScreen = me.ScreenObject.extend({
	init: function() {
		this.story = new Story();
		this.currentNodes = [];
		this.currentNodeSprites = [];
		this.startNode = 'start'
	},

	endGame: function(){
		me.state.change( me.state.GAMEOVER );
	},

	// this will be called on state change -> this
	onResetEvent: function(newLevel) {
		var self = this;
		me.game.reset();

		// TODO: Hacks
		this.currentNodes = [this.story.getNode(this.startNode)];
		this.currentNodeSprites = this.currentNodes.map(function(e){
			return new StoryRenderable(e);
		});

		me.game.reset();

		this.currentNodeSprites.forEach(function(e){
			me.game.world.addChild(e);
		})
	},

	onDestroyEvent: function() {

	},
});
