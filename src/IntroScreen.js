var RadmarsScreen = me.ScreenObject.extend({
	onResetEvent: function() {
		this.radmars = new RadmarsRenderable();
		me.game.world.addChild( this.radmars );
		me.game.world.addChild( new BGColor() );
		this.z = 4;

		this.subscription = me.event.subscribe( me.event.KEYDOWN, this.keyHandler.bind(this));

		me.audio.playTrack( "radmarslogo" );
	},

	keyHandler: function (action, keyCode, edge) {
		if( keyCode === me.input.KEY.ENTER ) {
			me.state.change( me.state.MENU);
		}
	},

	onDestroyEvent: function() {
		me.input.unbindKey(me.input.KEY.ENTER);
		me.audio.stopTrack();
		me.game.world.removeChild( this.radmars );
		me.event.unsubscribe( this.subscription );
	}
});

var RadmarsRenderable = me.Renderable.extend({
	init: function() {
		this._super( me.Renderable, "init", [0, 0, window.app.screenWidth, window.app.screenWidth] );
		this.counter = 0;
		this.floating = true;
		var cx = this.width / 2;
		var cy = this.height / 2;
		this.cx = cx;
		this.cy = cy;
		this.bg = new me.Sprite(0, 0, {image: "intro_bg"});
		var bgx = cx - this.bg.width / 2;
		var bgy = cy - this.bg.height / 2;
		this.bg.pos.x = bgx
		this.bg.pos.y = bgy;


		// Positions are relative to the size of the BG image.
		this.glasses1 = new me.Sprite(bgx + 408, 0, {image: "intro_glasses1"}); // 249 229
		new me.Tween(this.glasses1.pos).to({
			x: bgx + 408,
			y: bgy + 269,
		}, 1600).start();

		this.glasses2 = new me.Sprite(bgx + 408, bgy + 269, {image: "intro_glasses2"}); // 249 229
		this.glasses3 = new me.Sprite(bgx + 408, bgy + 269, {image: "intro_glasses3"}); // 249 229
		this.glasses4 = new me.Sprite(bgx + 408, bgy + 269, {image: "intro_glasses4"}); // 249 229

		this.text_mars     = new me.Sprite(bgx + 425, bgy + 357, {image: "intro_mars"}); // 266 317
		this.text_radmars1 = new me.Sprite(bgx + 383, bgy + 357, {image: "intro_radmars1"}); // 224 317
		this.text_radmars2 = new me.Sprite(bgx + 383, bgy + 357, {image: "intro_radmars2"});

		me.input.bindKey( me.input.KEY.ENTER, "enter", true );
	},

	getMarsText: function() {
		if( this.counter < 130) return this.text_mars;
		else if( this.counter < 135) return this.text_radmars2;
		else if( this.counter < 140) return this.text_radmars1;
		else if( this.counter < 145) return this.text_radmars2;
		else if( this.counter < 150) return this.text_radmars1;
		else if( this.counter < 155) return this.text_radmars2;
		else if( this.counter < 160) return this.text_radmars1;
		else if( this.counter < 165) return this.text_radmars2;
		else return this.text_radmars1;
	},

	getGlasses: function() {
		if( this.counter < 100) return this.glasses1;
		else if( this.counter < 105) return this.glasses2;
		else if( this.counter < 110) return this.glasses3;
		else if( this.counter < 115) return this.glasses4;
		else return this.glasses1;
	},

	draw: function(context) {
		this.bg.draw(context);
		this.getMarsText().draw(context);
		this.getGlasses().draw(context);
	},

	update: function( dt ) {
		if ( this.counter < 350 ) {
			this.counter++;
		}
		else{
			me.state.change(me.state.MENU);
		}
		// have to force redraw :(
		me.game.repaint();
	}
});
