
function LD34() {
	this.screenWidth = 900;
	this.screenHeight = 600;
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
	me.state.set( me.state.GAMEOVER, new GameOverScreen() );

	me.state.change(this.options.skipIntro ? me.state.PLAY : me.state.INTRO);
};


window.onReady(function() {
	window.app = new LD34();
	window.app.onload();
});
