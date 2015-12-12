var GameResources = (function() {
	function _Image( name, path ) {
		return { name: name, type: "image", src: "data/" + name + ".png" };
	}

	function _Audio( name ) {
		return { name: name, type: "audio", src: "data/audio/" , channels: 2 };
	}

	function _AddAudioArray( name, num, parent ) {
		for(var i = 1; i <= num; i++) {
			parent.push(_Audio(name + "-" + i));
		}
	}

	function GetRandomIndexString(max) {
		var index = Math.floor(Math.random() * max) + 1;
		return "-" + index;
	}

	function _Level( name ) {
		return { name: name, type: "tmx", src: "data/" + name + ".tmx" };
	}


	var GameResources = [
		/* Radmars Logo */
		_Image( "intro_bg" ),
		_Image( "intro_glasses1" ),
		_Image( "intro_glasses2" ),
		_Image( "intro_glasses3" ),
		_Image( "intro_glasses4" ),
		_Image( "intro_mars" ),
		_Image( "intro_radmars1" ),
		_Image( "intro_radmars2" ),
		_Audio( "radmarslogo" ),

		// ui
		_Image("16x16_font"),
		_Image("32x32_font"),
	];

	/*
	_AddAudioArray("hit", 3, GameResources);
	*/

	return GameResources;
})();
