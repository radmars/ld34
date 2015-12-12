var TitleScreen = me.ScreenObject.extend({
    onResetEvent: function() {
        this.bg = new me.ImageLayer( "title", screenWidth, screenHeight, "splash", 1 );

        this.hitenter = new HitEnter( 320, 400 );

        me.game.world.addChild( this.bg );
        me.game.world.addChild( this.hitenter);

        me.audio.stopTrack();
        //me.audio.playTrack( "ld34-title", 0.7 );
        //me.audio.play("micromancer");

        this.subscription = me.event.subscribe( me.event.KEYDOWN, function (action, keyCode, edge) {
            if( keyCode === me.input.KEY.ENTER ) {
                me.state.change( me.state.PLAY );
            }
        });
    },

    onDestroyEvent: function() {
        me.game.world.removeChild( this.bg );
        me.game.world.removeChild( this.hitenter );
        me.event.unsubscribe( this.subscription );
        me.audio.stopTrack();
    }
});
