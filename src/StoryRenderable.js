"use strict";
var StoryRenderable = me.Renderable.extend({
	init: function(settings) {
		var font = settings.font;
		var state = settings.state;
		var node = settings.node;
		var cw = settings.screenWidth;
		var ch = settings.screenHeight;
		this._super(me.Renderable, 'init', [0, 0, cw, ch]);
		this.state = state;
		this._node = node;
		this.font = font;
		this.imageCache = {};
		this._localScale = 0;

		if( this._node.death == true ){
			this.death = true;
		}else{
			this.death = false;
		}

		var image = this.getImage();
		this.pos.x = cw / 2;
		this.pos.y = ch / 2;
		this.rescale(.8);
		this.reposition(0, 0, 0, 1);
		this.alpha = 0;
		new me.Tween(this).to({alpha: 1 }, 200).start();
	},

	/**
	 * Change what node we're lookin at.
	 */
	setNode: function(node) {
		this._node = node;

		if( this._node.death == true ){
			this.death = true;
		}else{
			this.death = false;
		}
		console.log("node name " + this._node.name);
	},

	getImage: function() {
		var bg = this._node.bg;
		var cache = this.imageCache;
		if(!cache[bg]) {
			var image = new me.Sprite(0, 0, {
				image: bg,
			});
			image.anchorPoint = new me.Vector2d(0, 0);
			image.pos = this.pos;
			cache[bg] = image;
		}
		return cache[bg];
	},

	rescale: function(newScale) {
		if(this.scaleTween) { this.scaleTween.stop() }
		this.scaleTween = new me.Tween(this)
			.to({_localScale: newScale}, 1)
			.onUpdate(() => { this.getImage().scale(this._localScale, this._localScale); })
			.start();
	},

	/** Offset in layout list (hacks sigh) */
	reposition: function(current, index, length, newScale) {
		var image = this.getImage();

		var screenW = window.app.screenWidth;
		var screenH = window.app.screenHeight;
		var w = image.width;
		var h = image.height;
		var padding = 10;
		var nPerRow = 4;
		var nRows = Math.ceil(length / nPerRow);
		var row = Math.floor(index / nPerRow);
		var rowOffset = 0;
		var colOffset = 0;
		var yPad = 0;
		if(nRows > 1) {
			if(row == 0) {
				rowOffset = .5;
				yPad = -5;
			}
			else {
				yPad = 5;
				rowOffset = -.5;
				colOffset = nPerRow;
			}
		}
		var onRow = length > 4 ? 4 : length;

		this.pos.y = screenH/2 - (h * (rowOffset + .5) * newScale) + yPad;
		this.pos.x = ( screenW*0.5
			- onRow*0.5*w*newScale
			- (padding*0.5 * onRow*0.5)
		)  +  (index - colOffset) * w * newScale
			+ padding * (index-colOffset);

		if(this._current){
			new me.Tween(this).to({alpha: 1 }, 200).start();
		}else{
			new me.Tween(this).to({alpha: 0.5 }, 200).start();
		}

		/*
		var offset = current - index;

		 if(this.positionTween) { this.positionTween.stop() }
		this.positionTween = new me.Tween(this.pos)
			.to({
				y: window.app.screenHeight/2 - (
					offset * (40 + image.height * newScale)
					+ image.height / 2 * newScale
				),
				x: window.app.screenWidth/2 - image.width / 2 * newScale,
			}, 1)
			.start();
		*/
	},

	setPosition: function(index, current, length) {
		this._current = index == current;
		var depth = Math.abs(current - index);

		var newScale = 1;

		switch(length){
			case 1:
				newScale = 1;
				break;
			case 2:
				newScale = 0.85;
				break;
			case 3:
				newScale = 0.55;
				break;
			default:
				newScale = 0.42;
				break;
		}


		this.z = 5 - depth;

		this.reposition(current, index, length, newScale);
		this.rescale(newScale);
	},

	draw: function(ctx) {
		var image = this.getImage();
		image.alpha = this.alpha;
		image.draw(ctx);

		var w = image.width * this._localScale;
		var h = image.height * this._localScale;

		/* Sprites is name => Vector2d of normalized position */
		var sprites = this._node.sprites(this.state);
		Object.keys(sprites).forEach((name) => {
			var sprite = me.loader.getImage(name);
			var sp = sprites[name];
			ctx.drawImage( sprite,
				this.pos.x + sp.x * w - sprite.width / 2,
				this.pos.y + sp.y * h - sprite.height / 2,
				sprite.width * this._localScale,
				sprite.height * this._localScale
			);
		});

		/* These are the results of the left/right callback functions.
			{
			 str: "text",
			 pos: Vector2d
			 select: function()
			 node: "dest node name"
			}
		*/

		if( this._node.left != null ){
			var left = this._node.left(this.state);
			var right = this._node.right(this.state);
			if(this._current) {
				var lp = left.pos;
				var rp = right.pos;
				this.font.draw(ctx, left.str.toUpperCase(), this.pos.x + lp.x *w, this.pos.y + lp.y * h);
				this.font.draw(ctx, right.str.toUpperCase(), this.pos.x + rp.x *w, this.pos.y + rp.y * h);
			}
		}


	},
});
