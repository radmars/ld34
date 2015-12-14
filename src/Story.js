"use strict";
/**
 * Nodes in a story have a left and right choice, a background... maybe some
 * other things?
 * @class
 */
function Node(settings) {
	this.bg = settings.bg;
	this.name = settings.name;
	this.right = settings.right;
	this.left = settings.left;
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
	 this.addNode('start', {
		bg: 'start',
		left: function(state) {
			return {
				node: 'screen1',
				str: "ogre",
				select: function() {
					state.pickedOgre = true;
				},
				pos: new me.Vector2d(0.1, 0.75),
			};
		},
		right: function(state) {
			return {
				node: 'screen2',
				str: "cat",
				select: function() {
					state.pickedCat = true;
				},
				pos: new me.Vector2d(0.8, 0.75),
			};
		},
	});

	 this.addNode('screen1', {
		bg: 'screen1',
		left: function(state) {
			if(state.pickedOgre) {
				return {
					node: 'screen3',
					str: "ogrebattle",
					select: function(){
						state.killedOgre = true;
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
}

Story.prototype.addNode = function(name, def) {
	def.name = name;
	this.nodes[name] = new Node(def);
};

/** @return Node */
Story.prototype.getNode = function(name) {
	return this.nodes[name];
};
