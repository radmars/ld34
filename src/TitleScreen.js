var HitEnter = me.Renderable.extend({
	init: function( x, y ) {
		this.cta = me.loader.getImage("introcta");
		this._super( me.Renderable, 'init', [
			x - this.cta.width / 2, y - this.cta.height / 2,
			this.cta.width, this.cta.height
		]);
		this.floating = true;
		this.z = 5;
		this.ctaFlicker = 0;
	},
	draw: function(context) {
		this.ctaFlicker++;
		if( this.ctaFlicker > 20 )
		{
			context.drawImage( this.cta, this.pos.x, this.pos.y );
			if( this.ctaFlicker > 40 ) this.ctaFlicker = 0;
		}
	},

	update: function(dt) {
		me.game.repaint();
	}
});

var TitleScreen = me.ScreenObject.extend({
	onResetEvent: function() {
		this.bg = new me.Sprite( 0, 0, {
			image: "splash",
		});
		var cx = window.app.screenWidth / 2;
		var cy = window.app.screenHeight / 2;

		this.bg.pos.x = cx - this.bg.width / 2;
		this.bg.pos.y = cy - this.bg.height / 2;

		this.hitenter = new HitEnter(window.app.screenWidth/2, window.app.screenHeight/2 + 150);

		me.game.world.addChild(new BGColor() );
		me.game.world.addChild(this.bg );
		me.game.world.addChild(this.hitenter);

		me.audio.stopTrack();
		me.audio.play("select-L");
		me.audio.play("select-R");
		me.audio.play("split");
		me.audio.play("merge");
		//me.audio.playTrack( "ld34-title", 0.7 );
		//me.audio.play("micromancer");

		this.subscription = me.event.subscribe( me.event.KEYDOWN, this.keyHandler.bind(this));
	},

	keyHandler: function (action, keyCode, edge) {
		if( keyCode === me.input.KEY.ENTER ) {
			me.state.change( me.state.PLAY );
		}
	},

	onDestroyEvent: function() {
		me.game.world.removeChild( this.bg );
		me.game.world.removeChild( this.hitenter );
		me.event.unsubscribe( this.subscription );
		me.audio.stopTrack();
	}
});


var GameOverScreen = me.ScreenObject.extend({
	onResetEvent: function() {
		this.bg = new me.Sprite( 0, 0, {
			image: "game_over",
		});
		var cx = window.app.screenWidth / 2;
		var cy = window.app.screenHeight / 2;

		this.bg.pos.x = cx - this.bg.width / 2;
		this.bg.pos.y = cy - this.bg.height / 2;

		this.hitenter = new HitEnter(window.app.screenWidth/2, window.app.screenHeight/2 + 150);

		me.game.world.addChild(new BGColor() );
		me.game.world.addChild(this.bg );
		me.game.world.addChild(this.hitenter);

		me.audio.stopTrack();
		//me.audio.playTrack( "ld34-title", 0.7 );
		//me.audio.play("micromancer");

		this.subscription = me.event.subscribe( me.event.KEYDOWN, this.keyHandler.bind(this));
	},

	keyHandler: function (action, keyCode, edge) {
		if( keyCode === me.input.KEY.ENTER ) {
			me.state.change( me.state.PLAY );
		}
	},

	onDestroyEvent: function() {
		me.game.world.removeChild( this.bg );
		me.game.world.removeChild( this.hitenter );
		me.event.unsubscribe( this.subscription );
		me.audio.stopTrack();
	}
});

var WinScreen = me.ScreenObject.extend({
	onResetEvent: function() {
		this.bg = new me.Sprite( 0, 0, {
			image: "win",
		});
		var cx = window.app.screenWidth / 2;
		var cy = window.app.screenHeight / 2;

		this.bg.pos.x = cx - this.bg.width / 2;
		this.bg.pos.y = cy - this.bg.height / 2;

		this.hitenter = new HitEnter(window.app.screenWidth/2, window.app.screenHeight/2 + 150);

		me.game.world.addChild(new BGColor() );
		me.game.world.addChild(this.bg );
		me.game.world.addChild(this.hitenter);

		me.audio.stopTrack();
		//me.audio.playTrack( "ld34-title", 0.7 );
		//me.audio.play("micromancer");
		me.audio.play("select-L");
		me.audio.play("select-R");
		me.audio.play("merge");

		this.subscription = me.event.subscribe( me.event.KEYDOWN, this.keyHandler.bind(this));
	},

	keyHandler: function (action, keyCode, edge) {
		if( keyCode === me.input.KEY.ENTER ) {
			me.state.change( me.state.PLAY );
		}
	},

	onDestroyEvent: function() {
		me.game.world.removeChild( this.bg );
		me.game.world.removeChild( this.hitenter );
		me.event.unsubscribe( this.subscription );
		me.audio.stopTrack();
	}
});
