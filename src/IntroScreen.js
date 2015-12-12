var RadmarsScreen = me.ScreenObject.extend({
    onResetEvent: function() {
        this.radmars = new RadmarsRenderable();
        me.game.world.addChild( this.radmars );

        this.subscription = me.event.subscribe( me.event.KEYDOWN, function (action, keyCode, edge) {
            if( keyCode === me.input.KEY.ENTER ) {
                me.state.change( me.state.MENU);
            }
        });

        me.audio.playTrack( "radmarslogo" );
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
        this._super( me.Renderable, "init", [0, 0, screenHeight, screenWidth] );
        this.counter = 0;

        this.floating = true;

        if( !this.title ) {
            this.bg= me.loader.getImage("intro_bg");
            this.glasses1 = me.loader.getImage("intro_glasses1"); // 249 229
            this.glasses2 = me.loader.getImage("intro_glasses2"); // 249 229
            this.glasses3 = me.loader.getImage("intro_glasses3"); // 249 229
            this.glasses4 = me.loader.getImage("intro_glasses4"); // 249 229
            this.text_mars = me.loader.getImage("intro_mars"); // 266 317
            this.text_radmars1 = me.loader.getImage("intro_radmars1"); // 224 317
            this.text_radmars2 = me.loader.getImage("intro_radmars2");
        }

        me.input.bindKey( me.input.KEY.ENTER, "enter", true );
    },

    draw: function(context) {
        context.drawImage( this.bg, 0, 0 );
        if( this.counter < 130) context.drawImage( this.text_mars, 266+80+79, 317+60-20 );
        else if( this.counter < 135) context.drawImage( this.text_radmars2, 224+80+79, 317+60-20 );
        else if( this.counter < 140) context.drawImage( this.text_radmars1, 224+80+79, 317+60-20 );
        else if( this.counter < 145) context.drawImage( this.text_radmars2, 224+80+79, 317+60-20 );
        else if( this.counter < 150) context.drawImage( this.text_radmars1, 224+80+79, 317+60-20 );
        else if( this.counter < 155) context.drawImage( this.text_radmars2, 224+80+79, 317+60-20 );
        else if( this.counter < 160) context.drawImage( this.text_radmars1, 224+80+79, 317+60-20 );
        else if( this.counter < 165) context.drawImage( this.text_radmars2, 224+80+79, 317+60-20 );
        else context.drawImage( this.text_radmars1, 224+80+79, 317+60-20 );

        if( this.counter < 100) context.drawImage( this.glasses1, 249+80+79, 229*(this.counter/100)+60-20 );
        else if( this.counter < 105) context.drawImage( this.glasses2, 249+80+79, 229+60-20 );
        else if( this.counter < 110) context.drawImage( this.glasses3, 249+80+79, 229+60-20 );
        else if( this.counter < 115) context.drawImage( this.glasses4, 249+80+79, 229+60-20 );
        else context.drawImage( this.glasses1, 249+80+79, 229+60-20 );
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
