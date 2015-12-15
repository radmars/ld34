"use strict";

var DeathClock = me.Renderable.extend({
	init: function(x, y, font) {
		this._super(me.Renderable, 'init', [x, y, window.app.screenWidth, window.app.screenHeight]);
		this.anchorPoint = new me.Vector2d(0, 0);
		this.remainingTime = 119;
		this.font = font;
		this.tween = new me.Tween(this).to({
			remainingTime: 0,
		}, this.remainingTime * 1000).onComplete(() => {
			//throw "GG BRO";

			me.state.change( me.state.GAMEOVER );
			}).start()
		this.z = 5;
		this.font = new me.BitmapFont("16x16_font", 16);
	},

	draw: function(ctx) {


		var divisor_for_minutes = this.remainingTime % (60 * 60);
		var minutes = Math.floor(divisor_for_minutes / 60);

		var divisor_for_seconds = divisor_for_minutes % 60;
		var seconds = Math.ceil(divisor_for_seconds);

		this.font.draw(ctx, "PORTAL CONTACT: " + minutes + ":" + seconds, this.pos.x, this.pos.y);
		//this.font.draw(ctx, `DEATHCLOCK: ${Math.floor(this.remainingTime)}`, this.pos.x, this.pos.y);
	}
});

function Timeline(n, font, state, story){
	this.node = n;
	this.state = state;
	this.story = story;
	this.sprite = new StoryRenderable({
		node: n,
		font: font,
		state: state,
		screenWidth: window.app.screenWidth,
		screenHeight: window.app.screenHeight,

	});
};

Timeline.prototype.choose = function(direction) {
	var node = this.story.getNode(this.node.select(direction, this.state));
	if (node.callback) {
		node.callback(this.state);
	}
	return node;
}

Timeline.prototype.progress = function(next) {
	this.node = next;
	this.sprite.setNode(next);
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

		/* Nodes manipulate this. */
		this.state = {};
	},

	endGame: function(){
		me.audio.play("gameover");
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
		me.game.world.addChild(new DeathClock(window.app.screenWidth*0.5 -175, 10, this.font));

		this.audioFadeVolume = 0.8;
		this.audioFadeMS = 1000;
		this.audioTotalTracks = 5;

		for (var i = 1; i <= this.audioTotalTracks; i++) {
			me.audio.play("ld34-" + i, true, null, 0.0);
		}

		this.addTimeline(this.story.getNode(this.startNode));
		this.relayout();
		this.clearButtons();
	},

	relayout: function() {
		this.timelines.forEach((t, i) => {
			t.sprite.setPosition(i, this.currentTimeline, this.timelines.length);
		});
	},

	/**
	 * @param {Node} node
	 * @param {me.Vector2d} [position]
	 */
	addTimeline: function(node, position) {
		position = position || 0;
		var timeline = new Timeline(node, this.font, this.state, this.story);
		this.timelines.splice(position, 0, timeline);
		timeline.activate();

		var audioIndex = this.timelines.length;
		if (audioIndex <= this.audioTotalTracks) {
			me.audio.fade("ld34-" + audioIndex, 0.0, this.audioFadeVolume, this.audioFadeMS);
		}

		if(node.name == "death"){
			this.death(node);
		}
	},

	mergeTimelines: function() {
		var seen = {};
		var removed = [];
		this.timelines = this.timelines.filter((e) => {
			if(!seen[e.node.name]) {
				seen[e.node.name] = 1;
				return true;
			}
			removed.push(e);
			return false;
		});

		removed.forEach((e) => {
			e._current = false;
			new me.Tween(e.sprite)
				.to({alpha: 0}, 1000)
				.onComplete(() => {
					e.destroy();
				})
				.start();
		});

		// fade out tracks that correspond to removed timelines
		var curLength = this.timelines.length;
		for (var audioIndex = curLength + 1; audioIndex < curLength + removed.length + 1; audioIndex++) {
			if (audioIndex <= this.audioTotalTracks) {
				me.audio.fade("ld34-" + audioIndex, this.audioFadeVolume, 0.0, this.audioFadeMS);
			}
		}

		return removed.length > 0;
	},

	makeChoice: function() {
		var maxTimelines = this.timelines.length >= 7;
		var startinTimelines = this.timelines.length;
		var tryToSplit = this.actionA && this.actionB;

		var focused = this.timelines[this.currentTimeline];
		var newNodes = [];
		if(this.actionA) {
			newNodes.push(focused.choose('left'));
		}
		if(this.actionB) {
			newNodes.push(focused.choose('right'));
		}

		if(this.actionA && !this.actionB) {
			me.audio.play("select-L");
			me.audio.play("footsteps-L");
		}
		else if(this.actionB && !this.actionA) {
			me.audio.play("select-R");
			me.audio.play("footsteps-R");
		}

		// TODO: Should it pick a random node for each timeline in a split?
		this.advanceTimeline(this.currentTimeline, newNodes[0]);
		if(newNodes.length > 1 && !maxTimelines){
			this.addTimeline(newNodes[1], this.currentTimeline + 1);
		}

		// Now that we've added/updated timelines, merge dupes to lowest index variant
		var merged = this.mergeTimelines();

		if(merged) {
			this.notification.setText("THINGS ARE COMING TOGETHER...");
			me.audio.play("select-L");
			me.audio.play("select-R");
			me.audio.play("merge");
		}
		else {
			if(tryToSplit && maxTimelines) {
				this.notification.setText("TIME SEEMS TO MOVE IN ONE DIRECTION");
			}
			else if(tryToSplit) {
				this.notification.setText("OMG YOU SPLIT THE TIMELINE");
				me.audio.play("split");
			}
		}

		me.game.world.sort(true);

		this.currentTimeline = ((this.currentTimeline + 1) % this.timelines.length);
		this.relayout();

		this.clearButtons();
	},

	death: function(node){

		this.timelines.forEach((e) => {

			new me.Tween(e.sprite)
				.to({alpha: 0}, 500)
				.onComplete(() => {
				e.destroy();
				}).start();

		});

		me.audio.play("gameover");

		this.timelines = [];
		this.currentTimeline = 0;
		this.addTimeline(this.story.getNode(this.startNode));
		this.relayout();
		this.clearButtons();

	},

	advanceTimeline: function(index, selection) {
		this.timelines[index].progress(selection);

		if(selection.name == "death"){
			this.death(selection);
		}
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

		this.timelines.forEach((e) => {
			e.destroy();
		});

		this.timelines = [];
		this.currentTimeline = 0;

		for (var i = 1; i <= this.audioTotalTracks; i++) {
			me.audio.stop("ld34-" + i);
		}
	},
});
