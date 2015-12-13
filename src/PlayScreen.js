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
		me.game.reset();

		me.input.bindKey(me.input.KEY.A, "A");
		me.input.bindKey(me.input.KEY.LEFT, "A");
		me.input.bindKey(me.input.KEY.D, "B");
		me.input.bindKey(me.input.KEY.RIGHT, "B");

		this.keySub = me.event.subscribe(me.event.KEYDOWN, this.keyDown.bind(this));
		this.currentTimeline = 0;

		me.game.world.addChild(new BGColor());
		me.game.world.addChild(this.notification);

		this.addTimeline(this.story.getNode(this.startNode));
		this.relayout();
		this.clearButtons();
	},

	relayout: function() {
		var focusedScale = .8;
		var outOfFocusScale = .6;
		var font = this.font;
		this.timelinesprites.forEach((s, i) => {
			s.setPosition(i, this.currentTimeline);
			return s;
		});
	},

	addTimeline: function(node, position) {
		position = position || 0;
		this.timelines.splice(position, 0, node);
		var sprite = new StoryRenderable(node, this.font);
		this.timelinesprites.splice(position, 0,sprite);
		me.game.world.addChild(sprite)
	},

	makeChoice: function() {
		var maxTimelines = this.timelines.length >= 7;
		if(this.actionA && this.actionB) {
			if(maxTimelines) {
				this.notification.setText("TIME SEEMS TO MOVE IN ONE DIRECTION");
			}
			else {
				this.notification.setText("OMG YOU SPLIT THE TIMELINE");
			}
		}

		var newNodes = [];
		if(this.actionA) {
			newNodes.push(this.timelines[this.currentTimeline].left.node);
		}
		if(this.actionB) {
			newNodes.push(this.timelines[this.currentTimeline].right.node);
		}

		// TODO: Should it pick a random node for each timeline in a split?
		this.advanceTimeline(this.currentTimeline, newNodes[0]);
		if(newNodes.length > 1 && !maxTimelines){
			this.addTimeline(newNodes[1], this.currentTimeline + 1);
		}
		me.game.world.sort(true);

		this.currentTimeline = ((this.currentTimeline + 1) % this.timelines.length);
		this.relayout();

		this.clearButtons();
	},

	advanceTimeline: function(index, selection) {
		this.timelines[index] = selection;
		var sprite = new StoryRenderable(selection, this.font);
		var removed = this.timelinesprites.splice(index, 1, sprite);
		me.game.world.removeChild(removed[0]);
		me.game.world.addChild(sprite);
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
