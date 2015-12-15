"use strict";
/**
 * Nodes in a story have a left and right choice, a background... maybe some
 * other things?
 * @class
 */
function Node(settings) {
	this.bg = settings.bg;
	this.name = settings.name;
	this.sprites = settings.sprites || function() {return {}};
	this.right = settings.right;
	this.left = settings.left;
	this.callback = settings.callback;
}

/** Returns the name of the next node and runs the select handler for the direction provided */
Node.prototype.select = function(direction, state) {
	var choiceInfo = this[direction](state);
	choiceInfo.select();
	return choiceInfo.node;
};

/**
 * Story is a tree-like structure. Probably should just call it a graph.
 * Nodes have left and right and can reference other nodes to create merges,
 * loops, etc.
 * @class
 */
function Story() {
	this.nodes = {};

	/*
	 	State is the "state" of the playscreen object.
		positions are relative to the image on screen and scaled.
	 */

	this.addNode('death', {
		bg: 'red_dead',
		death: true,

		left: function(state) {
			return {
				node: 'start',
				str: "restart",
				select: function() {
				},
				pos: new me.Vector2d(0.1, 0.75),
			};
		},
		right: function(state) {
			return {
				node: 'start',
				str: "restart",
				select: function() {
				},
				pos: new me.Vector2d(0.8, 0.75),
			};
		},

	}); //dead

	//start
	
	this.addNode('start', {
		bg: 'start_rubble',
		left: function(state) {
			return {
				node: 'startL',
				str: "go left",
				select: function() {
				},
				pos: new me.Vector2d(0.1, 0.75),
			};
		},
		right: function(state) {
			return {
				node: 'startR',
				str: "go right",
				select: function() {
				},
				pos: new me.Vector2d(0.8, 0.75),
			};
		},
	}); //start

	this.addNode('startR', {
		bg: 'tube_dudes',
		left: function(state) {
			return {
				node: 'startNoRubble',
				str: "free",
				select: function(){
					// ogre smash & appear
					me.audio.play("ogre-approach");
					me.audio.play("ogre-smash");
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'tubeDudesAttack',
				str: "free",
				select: function(){
					// gremlin
					me.audio.play("gremlin-approach");
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //startR
	
	this.addNode('tubeDudesAttack', {
		bg: 'tube_dudes_attack',
		left: function(state) {
			return {
				node: 'death',
				str: "die painfully",
				select: function(){
					// ogre smash & appear
					me.audio.play("ogre-approach");
					me.audio.play("ogre-smash");
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'death',
				str: "die quickly",
				select: function(){
					// gremlin
					me.audio.play("gremlin-approach");
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	});	//tubeDudesAttack

	this.addNode('startNoRubble', {
		bg: 'start_no_rubble',
		left: function(state) {
			return {
				node: 'startL',
				str: "go left",
				select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'hallwayBranch',
				str: "door",
				select: function(){
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //startNoRubble
	
	this.addNode('startL', {
		bg: 'beaker_hole',
		left: function(state) {
			return {
				node: 'tunnel',
				str: "enter",
				select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'death',
				str: "drink",
				select: function(){
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //startL
	
	this.addNode('hallwayBranch', {
		bg: 'hallway_branch',
		left: function(state) {
			return {
				node: 'cargoMonster',
				str: "straight",
				select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'podOrDoor',
				str: "right",
				select: function(){
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //hallwayBranch
	
	this.addNode('podOrDoor', {
		bg: 'escape_pod_or_door',
		left: function(state) {
			return {
				node: 'pod1',
				str: "pod door",
				select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'bridgeDoor',
				str: "bridge door",
				select: function(){
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //podOrDoor
	
	this.addNode('cargoMonster', {
		bg: 'cargo_bay_monster',
		left: function(state) {
			return {
				node: 'death',
				str: "get mauled",
				select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'death',
				str: "get eaten",
				select: function(){
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
		callback: function(state) {
			// check state here if needed
			me.audio.play("monster-approach");
		}
	}); //cargoMonster
	
	this.addNode('pod1', {
		bg: 'escape_pod',
		left: function(state) {
			return {
				node: 'podOrDoor',
				str: "back",
				select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'space',
				str: "open",
				select: function(){
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //pod1
	
	this.addNode('space', {
		bg: 'space',
		left: function(state) {
			return {
				node: 'death',
				str: "suffocate",
				select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'death',
				str: "freeze",
				select: function(){
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
		callback: function(state) {
			me.audio.play("vacuum");
		}
	}); //pod1
	
	this.addNode('tunnel', {
		bg: 'tube_split',
		left: function(state) {
			return {
				node: 'cargoMonster',
				str: "straight",
				select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'tunnelToEngine',
				str: "right",
				select: function(){
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //tunnel
	
	this.addNode('tunnelToEngine', {
		bg: 'tube_dude_dead',
		left: function(state) {
			if(state.haveGun) {
				return {
					node: 'gremlinTunnelGun',
					str: "straight",
					select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
				};
			} else {
				return {
					node: 'gremlinTunnelNoGun',
					str: "straight",
					select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
				};
			}
		},
		right: function(state) {
			return {
				node: 'tunnelToEngine2',
				str: "take gun",
				select: function(){
					state.haveGun = true;
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //tunnelToEngine
	
	this.addNode('tunnelToEngine2', {
		bg: 'tube_dude_dead',
		left: function(state) {
			return {
				node: 'gremlinTunnelGun',
				str: "straight",
				select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'cargoWithGun',
				str: "go back",
				select: function(){
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //tunnelToEngine2
	
	this.addNode('gremlinTunnelNoGun', {
		bg: 'tube_grem',
		left: function(state) {
			return {
				node: 'gremlinTunnelAttack',
				str: "approach",
				select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'tunnelToEngine',
				str: "go back",
				select: function(){
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //gremlinTunnelNoGun
	
	this.addNode('gremlinTunnelGun', {
		bg: 'tube_grem',
		left: function(state) {
			return {
				node: 'gremlinTunnelDead',
				str: "shoot",
				select: function(){
					me.audio.play("lazer");
					me.audio.play("gremlin-death");
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'cargoWithGun',
				str: "go back",
				select: function(){
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //gremlinTunnelGun
	
	this.addNode('gremlinTunnelAttack', {
		bg: 'red_dead',
		left: function(state) {
			return {
				node: 'death',
				str: "die honorably",
				select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'death',
				str: "die dishonorably",
				select: function(){
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //gremlinTunnelAttack

	this.addNode('gremlinTunnelDead', {
		bg: 'tube_grem_dead',
		left: function(state) {
			return {
				node: 'engine',
				str: "forward",
				select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'cargoWithGun',
				str: "back",
				select: function(){
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //gremlinTunnelDead
	
	
	
	this.addNode('cargoWithGun', {
		bg: 'cargo_bay_monster',
		left: function(state) {
			return {
				node: 'cargoMonster',
				str: "shoot",
				select: function(){
					me.audio.play("lazer");
					me.audio.play("monster-death");
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'cargoMonsterDead',
				str: "shoot",
				select: function(){
					me.audio.play("lazer");
					me.audio.play("large-explosion");
					state.monsterDead = true;
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //cargoWithGun
	
	this.addNode('cargoMonsterDead', {
		bg: 'cargo_bay_monster_dead',
		left: function(state) {
			return {
				node: 'cargoMonsterDead',
				str: "chill here",
				select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'cargoWithCore',
				str: "take core",
				select: function(){
					state.haveCore = true;
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //cargoMonsterDead
	
	this.addNode('cargoWithCore', {
		bg: 'cargo_bay_monster_dead',
		left: function(state) {
			return {
				node: 'cargoWithCore',
				str: "chill here",
				select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'engine',
				str: "leave",
				select: function(){
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //cargoWithCore
	
	
	
	//bridge
	
	this.addNode('bridgeDoor', {
		bg: 'bridge_door',
		left: function(state) {
			return {
				node: 'bridgeNoShield',
				str: "red button?",
				select: function(){
					me.audio.play("button");
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'bridgeShield',
				str: "blue button?",
				select: function(){
					me.audio.play("button");
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //bridgeDoor
	
	this.addNode('bridgeNoShield', {
		bg: 'bridge_no_shield',
		left: function(state) {
			return {
				node: 'death',
				str: "suffocate",
				select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'death',
				str: "choke",
				select: function(){
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
		callback: function(state) {
			me.audio.play("vacuum");
		}
	}); //bridgeNoShield
	
	this.addNode('bridgeShield', {
		bg: 'bridge_shield',
		left: function(state) {
			return {
				node: 'stairs1',
				str: "stairs",
				select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			if (state.engineOn) {
				return {
					node: 'helm',
					str: "helm",
					select: function(){
					},
					pos: new me.Vector2d(0.7, 0.55),
				};
			} else {
				return {
					node: 'helmOff',
					str: "helm",
					select: function(){
					},
					pos: new me.Vector2d(0.7, 0.55),
				};
			}
		},
	}); //bridgeShield
	
	this.addNode('helm', {
		bg: 'engine_room_computer_on',
		left: function(state) {
				return {
				node: 'flyAway',
				str: "drive",
				select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'bridgeShield',
				str: "back",
				select: function(){
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //helm
	
	this.addNode('helmOff', {
		bg: 'engine_room_computer',
		left: function(state) {
				return {
				node: 'stairs1',
				str: "stairs",
				select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'bridgeShield',
				str: "back",
				select: function(){
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //helmOff
	
	this.addNode('flyAway', {
		bg: 'space_streak',
		left: function(state) {
				return {
				node: 'flyAway',
				str: "fly away",
				select: function(){
					me.state.change(me.state.WIN)
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'flyAway',
				str: "escape",
				select: function(){
					me.state.change(me.state.WIN)
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //fly away
	
	
	this.addNode('stairs1', {
		bg: 'bridge_stairs',
		left: function(state) {
			return {
				node: 'engineering',
				str: "engineering",
				select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			if (state.haveGun) {
				return {
					node: 'weapons',
					str: "weapons",
					select: function(){
					},
					pos: new me.Vector2d(0.7, 0.55),
				};
			} else {
				return {
					node: 'weaponsNoGun',
					str: "weapons",
					select: function(){
					},
					pos: new me.Vector2d(0.7, 0.55),
				};
			}
		},
	}); //stairs1
	
	this.addNode('engineering', {
		bg: 'console_bridge_1',
		left: function(state) {
			return {
				node: 'podStatus',
				str: "press",
				select: function(){
					me.audio.play("button");
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'flush',
				str: "press",
				select: function(){
					state.flush = true;
					me.audio.play("button");
					me.audio.play("cargobayflush");
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //engineering
	
	this.addNode('weapons', {
		bg: 'console_bridge_2',
		left: function(state) {
			return {
				node: 'weaponsDead',
				str: "shoot",
				select: function(){
					me.audio.play("lazer");
					me.audio.play("large-explosion");
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'stairs3',
				str: "leave",
				select: function(){
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //weapons
	
	this.addNode('weaponsNoGun', {
		bg: 'console_bridge_2',
		left: function(state) {
			return {
				node: 'weaponsAttack',
				str: "boot",
				select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'stairs3',
				str: "leave",
				select: function(){
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //weaponsNoGun
	
	this.addNode('weaponsDead', {
		bg: 'console_bridge_2_dead',
		left: function(state) {
			return {
				node: 'explode',
				str: "use nuke",
				select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'laserWin',
				str: "use lasers",
				select: function(){
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //weaponsDead
	
	this.addNode('laserWin', {
		bg: 'space_ship_laser_win',
		left: function(state) {
			return {
				node: 'laserWin',
				str: "win",
				select: function(){
					me.state.change(me.state.WIN)
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'laserWin',
				str: "win and bm",
				select: function(){
					me.state.change(me.state.WIN)
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //weaponsDead
	
	this.addNode('weaponsAttack', {
		bg: 'console_bridge_attack',
		left: function(state) {
			return {
				node: 'death',
				str: "scream and die",
				select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'death',
				str: "just die",
				select: function(){
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //weaponsAttack
	
	this.addNode('podStatus', {
		bg: 'console_bridge_1_launched',
		left: function(state) {
			return {
				node: 'stairs2',
				str: "back",
				select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'flush',
				str: "press",
				select: function(){
					state.flush = true;
					me.audio.play("button");
					me.audio.play("cargobayflush");
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //podStatus
	
	this.addNode('flush', {
		bg: 'console_bridge_1_flushed',
		left: function(state) {
			return {
				node: 'podStatus',
				str: "press",
				select: function(){
					me.audio.play("button");
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'stairs3',
				str: "back",
				select: function(){
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //flush
	
	this.addNode('stairs2', {
		bg: 'bridge_stairs',
		left: function(state) {
			return {
				node: 'bridge2',
				str: "back",
				select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			if (state.haveGun) {
				return {
					node: 'weapons',
					str: "weapons",
					select: function(){
					},
					pos: new me.Vector2d(0.7, 0.55),
				};
			} else {
				return {
					node: 'weaponsNoGun',
					str: "weapons",
					select: function(){
					},
					pos: new me.Vector2d(0.7, 0.55),
				};
			}
		},
	}); //stairs2
	
	this.addNode('stairs3', {
		bg: 'bridge_stairs',
		left: function(state) {
			return {
				node: 'engineering',
				str: "engineering",
				select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'bridge2',
				str: "back",
				select: function(){
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //stairs3
	
	this.addNode('bridge2', {
		bg: 'bridge_shield',
		left: function(state) {
			if (state.engineOn) {
				return {
					node: 'helm',
					str: "helm",
					select: function(){
					},
					pos: new me.Vector2d(0.7, 0.55),
				};
			} else {
				return {
					node: 'helmOff',
					str: "helm",
					select: function(){
					},
					pos: new me.Vector2d(0.7, 0.55),
				};
			}
		},
		right: function(state) {
			return {
				node: 'hallToCargo',
				str: "Cargo bay",
				select: function(){
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //bridge2
	
	this.addNode('hallToCargo', {
		bg: 'hallway',
		left: function(state) {
			return {
				node: 'death',
				str: "go back",
				select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			if(state.flush) {
				return {
					node: 'bayFromBridge',
					str: "keep going",
					select: function(){
					},
					pos: new me.Vector2d(0.7, 0.55),
				};
			} else if (state.monsterDead) {
				return {
					node: 'bayFromBridgeDead',
					str: "keep going",
					select: function(){
					},
					pos: new me.Vector2d(0.7, 0.55),
				};
			} else if (state.haveGun) {
				return {
					node: 'bayFromBridgeGun',
					str: "keep going",
					select: function(){
					},
					pos: new me.Vector2d(0.7, 0.55),
				};
			} else {
				return {
					node: 'cargoMonster',
					str: "keep going",
					select: function(){
					},
					pos: new me.Vector2d(0.7, 0.55),
				};
			}
		},
	}); //hallToCargo
	
	//cargobay
	
	this.addNode('bayFromBridge', {
		bg: 'cargo_bay',
		left: function(state) {
			return {
				node: 'podWin',
				str: "enter pod",
				select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'bridgeShield',
				str: "back to bridge",
				select: function(){
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //bayFromBridge
	
	this.addNode('bayFromBridgeDead', {
		bg: 'cargo_bay_monster_dead',
		left: function(state) {
			return {
				node: 'bayFromBridgeDead',
				str: "chill here",
				select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'bridgeShield',
				str: "back to bridge",
				select: function(){
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); 
	
	this.addNode('bayFromBridgeGun', {
		bg: 'cargo_bay_monster',
		left: function(state) {
			return {
				node: 'cargoMonster',
				str: "shoot",
				select: function(){
					me.audio.play("lazer");
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'bayFromBridgeDead',
				str: "shoot",
				select: function(){
					me.audio.play("lazer");
					me.audio.play("large-explosion");
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); 
	
	this.addNode('podWin', {
		bg: 'space_ship_streak',
		left: function(state) {
			return {
				node: 'podWin',
				str: "flee",
				select: function(){
					me.state.change(me.state.WIN)
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'podWin',
				str: "escape",
				select: function() {
					me.state.change(me.state.WIN)
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	});
	
	//engine room
	
	this.addNode('engine', {
		bg: 'engine_room',
		left: function(state) {
			if(state.haveCore) {
				return {
					node: 'core',
					str: "core",
					select: function(){
					},
				pos: new me.Vector2d(0.2, 0.70),
				};
			} else {
				return {
					node: 'coreNoCore',
					str: "core",
					select: function(){
					},
				pos: new me.Vector2d(0.2, 0.70),
				};
			}
		},
		right: function(state) {
			return {
				node: 'bridgeDoor',
				str: "to bridge",
				select: function(){
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //engine
	
	this.addNode('core', {
		bg: 'engine_room_core',
		left: function(state) {
			return {
				node: 'engineOn',
				str: "replace",
				select: function(){
					state.engineOn = true;
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'engine',
				str: "back",
				select: function(){
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //core
	
	this.addNode('coreNoCore', {
		bg: 'engine_room_core',
		left: function(state) {
			return {
				node: 'explode',
				str: "shoot",
				select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'engine',
				str: "back",
				select: function(){
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //coreNoCore
	
	this.addNode('explode', {
		bg: 'space_ship_explode',
		left: function(state) {
			return {
				node: 'death',
				str: "explode",
				select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'death',
				str: "blow up",
				select: function(){
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //explode
	
	this.addNode('engineOn', {
		bg: 'engine_room_active',
		left: function(state) {
			return {
				node: 'engineOn',
				str: "core",
				select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: 'bridgeDoor',
				str: "to bridge",
				select: function(){
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	}); //engineOn
	
	/*
	this.addNode('', {
		bg: '',
		left: function(state) {
			return {
				node: '',
				str: "",
				select: function(){
				},
				pos: new me.Vector2d(0.2, 0.70),
			};
		},
		right: function(state) {
			return {
				node: '',
				str: "",
				select: function(){
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	});
	*/

	/*
	this.addNode('screen2', {
		bg: 'screen2',
		left: function(state) {
			if(state.pickedCat) {
				return {
					node: 'screen3',
					str: "catfight",
					select: function(){
						state.killedCat = true;
					},
					pos: new me.Vector2d(0.2, 0.70),
				};
			}
			else {
				throw "Shouldn't be possible";
			}
		},
		right: function(state) {
			return {
				node: 'start',
				str: "retreat",
				select: function(){
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	});

	this.addNode('screen3', {
		bg: 'screen3',
		left: function(state) {
			if(state.killedCat) {
				return {
					node: 'start',
					str: "cathat",
					select: function(){
						Object.keys(state).forEach((k) => { delete state[k]; })
						me.state.current().notification.setText("GG CATMAN");
					},
					pos: new me.Vector2d(0.2, 0.70),
				};
			}
			else if(state.killedOgre) {
				return {
					node: 'start',
					str: "ogrecorpse",
					select: function(){
						Object.keys(state).forEach((k) => { delete state[k]; })
						me.state.current().notification.setText("EEE GAH");
					},
					pos: new me.Vector2d(0.2, 0.70),
				};
			}
			else {
				throw "Shouldn't be possible";
			}
		},
		right: function(state) {
			return {
				node: 'start',
				str: "naptime",
				select: function(){
					Object.keys(state).forEach((k) => { delete state[k]; })
					me.state.current().notification.setText("reset!");
				},
				pos: new me.Vector2d(0.7, 0.55),
			};
		},
	})
	*/
}

Story.prototype.addNode = function(name, def) {
	def.name = name;
	this.nodes[name] = new Node(def);
};

/** @return Node */
Story.prototype.getNode = function(name) {
	return this.nodes[name];
};
