"use strict";

var BGColor = me.Renderable.extend({
	init: function() {
		this._super(me.Renderable, 'init', [0, 0, window.app.screenWidth, window.app.screenHeight]);
	},
	draw: function(context) {
		context.setColor('#000');
		context.fillRect(0, 0, window.app.screenWidth, window.app.screenHeight);
	},
});

/** The game play state... */
var PlayScreen = me.ScreenObject.extend({
	init: function() {
		this.story = new Story();
		this.currentNodes = [];
		this.currentNodeSprites = [];
		this.startNode = 'start';
		// number of MS to wait for two button press
		this.twoButtonTimeout = 100;
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
		this.focusedNodeIndex = 0;
		this.clearButtons();

		me.game.reset();

		me.game.world.addChild(new BGColor());

		this.addSprites();

		me.input.bindKey(me.input.KEY.A, "A");
		me.input.bindKey(me.input.KEY.LEFT, "A");
		me.input.bindKey(me.input.KEY.D, "B");
		me.input.bindKey(me.input.KEY.RIGHT, "B");

		this.keySub = me.event.subscribe(me.event.KEYDOWN, this.keyDown.bind(this));
	},

	addSprites: function() {
		var scale = 1/this.currentNodes.length;
		this.currentNodeSprites = this.currentNodes.map(function(e, i){
			var s = new StoryRenderable(e);
			s.scale(scale, scale);
			s.pos.x = i * s.image.width * scale;
			return s;
		});
		this.currentNodeSprites.forEach(function(e){
			me.game.world.addChild(e);
		});
	},

	clearSprites: function() {
		this.currentNodeSprites.map(function(e){
			me.game.world.removeChild(e);
		});
	},

	makeChoice: function() {
		this.clearSprites();
		var newNodes = [];
		if(this.actionA) {
			newNodes.push(this.currentNodes[this.focusedNodeIndex].left);
		}
		if(this.actionB) {
			newNodes.push(this.currentNodes[this.focusedNodeIndex].right);
		}
		this.currentNodes.shift();
		// insert new nodes at the start
		// TODO figure out scaling here
		this.currentNodes.splice.apply(this.currentNodes, [0, 0].concat(newNodes));
		this.addSprites();
		me.game.world.sort(true);
		this.clearButtons();
		console.log("Hi?");
	},

	/** Clear button timers */
	clearButtons: function() {
		this.actionA = undefined;
		this.actionB = undefined;
		me.timer.clearTimeout(this.actionTimer);
		this.actionTimer = undefined;
	},

	keyDown: function(action, code) {
		// track which buttons we set
		var a = action == "A";
		var b = action == "B";
		if(a || b) {
			this.actionA = this.actionA || a;
			this.actionB = this.actionB || b;
			// start a timer if there isn't one already
			this.actionTimer = this.actionTimer || me.timer.setTimeout(this.makeChoice.bind(this), this.twoButtonTimeout);
		}
	},

	onDestroyEvent: function() {
		console.log("Destroy?");
	},
});
