"use strict";

function Timeline(n, font){
	this.node = n;
	this.sprite = new StoryRenderable(n, font);
};

Timeline.prototype.right = function() {
	return this.node.right.node;
}

Timeline.prototype.left = function() {
	return this.node.left.node;
}

Timeline.prototype.progress = function(next) {
	this.node = next;
	this.sprite.node = next;
}

Timeline.prototype.activate = function() {
	me.game.world.addChild(this.sprite);
}

Timeline.prototype.destroy = function() {
	me.game.world.removeChild(this.sprite);
}

/** The game play state... */
var PlayScreen = me.ScreenObject.extend({
	init: function() {
		this.story = new Story();
		this.timelines = [];
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
		this.timelines.forEach((t, i) => {
			t.sprite.setPosition(i, this.currentTimeline);
		});
	},

	/**
	 * @param {Node} node
	 * @param {me.Vector2d} [position]
	 */
	addTimeline: function(node, position) {
		position = position || 0;
		var timeline = new Timeline(node, this.font)
		this.timelines.splice(position, 0, timeline);
		timeline.activate();
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
			newNodes.push(this.timelines[this.currentTimeline].left());
		}
		if(this.actionB) {
			newNodes.push(this.timelines[this.currentTimeline].right());
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
		this.timelines[index].progress(selection);
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
			this.actionTimer = this.actionTimer || me.timer.setTimeout(this.makeChoice.bind(this), this.twoButtonTimeout);
		}
	},

	onDestroyEvent: function() {
		me.audio.stopTrack();
	},
});
