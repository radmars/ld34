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

		// audio tracks
		//_Audio( "ld34-full-v1"),

		// title screen
		_Image("splash"),
		_Image("introcta"),
		_Image("game_over"),
		_Image("win"),


		// game screens
		_Image("red_dead"),

		_Image("start"),
		_Image("screen1"),
		_Image("screen2"),
		_Image("screen3"),
		_Image("beaker_hole"),
		_Image("bridge_door"),
		_Image("bridge_no_shield"),
		_Image("bridge_shield"),
		_Image("bridge_stairs"),
		_Image("cargo_bay_monster_dead"),
		_Image("cargo_bay_monster"),
		_Image("cargo_bay"),
		_Image("console_bridge_1_flushed"),
		_Image("console_bridge_1_launched"),
		_Image("console_bridge_1"),
		_Image("console_bridge_2"),
		_Image("engine_room_active"),
		_Image("engine_room_computer"),
		_Image("engine_room_computer_on"),
		_Image("engine_room_core"),
		_Image("engine_room"),
		_Image("escape_pod_or_door"),
		_Image("escape_pod"),
		_Image("hallway_branch"),
		_Image("hallway"),
		_Image("start_no_rubble"),
		_Image("start_rubble"),
		_Image("tube_dude_dead"),
		_Image("tube_dudes"),
		_Image("tube_dudes_attack"),
		_Image("tube_grem_attack"),
		_Image("tube_grem_dead"),
		_Image("tube_grem"),
		_Image("tube_split"),
		_Image("tube_straight"),
		
		// ui
		//_Image("8x8_font"),
		_Image("16x16_font"),
		//_Image("32x32_font"),

		_Audio("ld34-1"),
		_Audio("ld34-2"),
		_Audio("ld34-3"),
		_Audio("ld34-4"),
		_Audio("ld34-5"),

		_Audio("button"),
		_Audio("cargobayflush"),
		_Audio("footsteps-L"),
		_Audio("footsteps-R"),
		_Audio("gameover"),
		_Audio("gremlin-approach"),
		_Audio("gremlin-death"),
		_Audio("large-explosion"),
		_Audio("lazer"),
		_Audio("merge"),
		_Audio("monster-approach"),
		_Audio("monster-death"),
		_Audio("ogre-approach"),
		_Audio("ogre-death"),
		_Audio("ogre-smash"),
		_Audio("radmarslogo"),
		_Audio("select-L"),
		_Audio("select-R"),
		_Audio("split"),
		_Audio("vacuum"),
		_Audio("alarm"),
	];

	/*
	_AddAudioArray("hit", 3, GameResources);
	*/

	return GameResources;
})();
