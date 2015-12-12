
function LD34() {
	this.screenHeight = 600;
	this.screenWidth = 600;
	this.data = {};
};

LD34.prototype.onload = function() {
	if ( !me.video.init( this.screenWidth, this.screenHeight, { wrapper: 'canvas', scale : 1.0 })) {
		alert ("Yer browser be not workin");
		return;
	}

	this.options = {};

	window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		this.options[key] = value;
	}.bind(this));

	// add "?debug" to the URL to enable the debug Panel
	if (this.options.debug) {
		window.onReady(function() {
			me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.key.V);
		})
	}

	if (this.options.mute) {
		me.audio.muteAll();
	}

	/*
	me.pool.register( "player", Player );
	me.pool.register( "baddie", Mage);
	me.pool.register( "musketeer", Musketeer );
	me.pool.register( "mage", Mage );
	me.pool.register( "skeleton", Skeleton );
	me.pool.register( "civilian", Civilian );
	me.pool.register( "corpse", Corpse );
	me.pool.register( "grave", Grave );
	me.pool.register( "knight", Knight );
	me.pool.register( "pickup", Pickup );
	me.pool.register( "levelchanger", LevelChanger );
	me.pool.register( "gameender", GameEnder );
	*/

	me.input.preventDefault = true;

	me.audio.init ("m4a,ogg" );

	// Sync up post loading stuff.
	me.loader.onload = this.loaded.bind( this );

	me.loader.preload( GameResources );

	me.state.change( me.state.LOADING );

	// Disable right click.
	document.getElementById("canvas").addEventListener(
		'contextmenu',
		this.rightClickProxy.bind(this),
		false
	);

};

LD34.prototype.rightClickProxy = function(e){
	if (e.button === 2) {
		e.preventDefault();
		return false;
	}
}

/**
* Do stuff post-resource-load.
*/
LD34.prototype.loaded = function() {
	me.state.set( me.state.INTRO, new RadmarsScreen() );
	me.state.set( me.state.MENU, new TitleScreen() );
	me.state.set( me.state.PLAY, new PlayScreen() );
	//me.state.set( me.state.GAMEOVER, new GameOverScreen() );

	me.state.change(this.options.skipIntro ? me.state.PLAY : me.state.INTRO);
};

/** The game play state... */
var PlayScreen = me.ScreenObject.extend({
	endGame: function(){
		me.state.change( me.state.GAMEOVER );
	},

	goToLevel: function( level ) {
		var self = this;
		me.game.reset();
		me.game.onLevelLoaded = function(l) {
			self.HUD.startGame();
			me.game.viewport.fadeOut( '#000000', 1000, function() {
			});
		};
		me.levelDirector.loadLevel( level );

		if (level === "level1") {
			me.audio.play("rise");
			me.audio.stopTrack();
			me.audio.playTrack("ld33-1", 0.5);
		}
		else if (level === "level6") {
			me.audio.stopTrack();
			me.audio.playTrack("ld33-2", 0.5);
		}
		else if (level === "level10") {
			me.audio.stopTrack();
			me.audio.playTrack("ld33-3", 0.5);
		}

		window.app.data.currentLevel=level;
	},

	getLevel: function() {
		return this.parseLevel( me.levelDirector.getCurrentLevelId() );
	},

	parseLevel: function( input ) {
		var re = /level(\d+)/;
		var results = re.exec( input );
		return results[1];
	},

	reloadLevel: function() {
		console.log("reloadLevel ");
		this.cleanTheShitUp();
		me.levelDirector.loadLevel( me.levelDirector.getCurrentLevelId() );
	},

	// this will be called on state change -> this
	onResetEvent: function(newLevel) {
		console.log("onResetEvent " + newLevel );
		var self = this;
		me.game.reset();

		var lev = window.app.data.currentLevel;
		if(lev == ""){
			lev = "level1";
		}

		var level =  newLevel || location.hash.substr(1) || lev ;

		this.goToLevel(level);
	},

	onDestroyEvent: function() {
		this.HUD.endGame();
	},
});

window.onReady(function() {
	window.app = new LD34();
	window.app.onload();
});
