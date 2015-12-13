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
		this.timelines = [];
		this.timelinesprites = [];
		this.startNode = 'start';
		// number of MS to wait for two button press
		this.twoButtonTimeout = 100;
		this.font = new me.BitmapFont("16x16_font", 16);
		this.font.set("center");
		this.notification = new Notification();
	},

	endGame: function(){
		me.state.change( me.state.GAMEOVER );
	},

	// this will be called on state change -> this
	onResetEvent: function(newLevel) {
		var self = this;
		me.game.reset();

		// TODO: Hacks
		this.timelines = [this.story.getNode(this.startNode)];
		this.focusedNodeIndex = 0;
		this.clearButtons();

		me.game.reset();

		me.game.world.addChild(new BGColor());
		me.game.world.addChild(this.notification);

		this.addSprites();

		me.input.bindKey(me.input.KEY.A, "A");
		me.input.bindKey(me.input.KEY.LEFT, "A");
		me.input.bindKey(me.input.KEY.D, "B");
		me.input.bindKey(me.input.KEY.RIGHT, "B");

		this.keySub = me.event.subscribe(me.event.KEYDOWN, this.keyDown.bind(this));
	},

	addSprites: function() {
		var scale = 1/this.timelines.length;
		var font = this.font;
		this.timelinesprites = this.timelines.map(function(e, i){
			var s = new StoryRenderable(e, font);
			s.scale(scale, scale);
			s.pos.y = window.app.screenHeight/2 - s.image.height * .5 * scale;
			s.pos.x = i * s.image.width * scale + 10 * i;
			return s;
		});
		this.timelinesprites.forEach(function(e){
			me.game.world.addChild(e);
		});
	},

	clearSprites: function() {
		this.timelinesprites.map(function(e){
			me.game.world.removeChild(e);
		});
	},

	makeChoice: function() {
		this.clearSprites();
		var newNodes = [];
		var maxTimelines = this.timelines.length >= 7;
		if(this.actionA && this.actionB) {
			if(maxTimelines) {
				this.notification.setText("TIME SEEMS TO MOVE IN ONE DIRECTION");
			}
			else {
				this.notification.setText("OMG YOU SPLIT THE TIMELINE");
			}
		}

		if(this.actionA) {
			newNodes.push(this.timelines[this.focusedNodeIndex].left.node);
		}
		// TODO? SHOULD IT BE RANDOM WHICH WAY IT GOES IF YOU PICK TWO
		if(this.actionB && (!this.actionA || !maxTimelines)) {
			newNodes.push(this.timelines[this.focusedNodeIndex].right.node);
		}
		this.timelines.shift();
		// insert new nodes at the start
		// TODO figure out scaling here
		this.timelines.splice.apply(this.timelines, [0, 0].concat(newNodes));
		this.addSprites();
		me.game.world.sort(true);
		this.clearButtons();
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
