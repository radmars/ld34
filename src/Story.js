"use strict";
/**
 * Nodes in a story have a left and right choice, a background... maybe some
 * other things?
 * @class
 */
function Node(settings) {
	this.bg = settings.bg;
	this.right = settings.right;
	this.left = settings.left;
}

/**
 * Story is a tree-like structure. Probably should just call it a graph.
 * Nodes have left and right and can reference other nodes to create merges,
 * loops, etc.
 * @class
 */
function Story() {
	this.nodes = { };
	var data = {
		start: {
			bg: 'start',
			left: {
				node: 'screen1',
				str: "one",
				pos: new me.Vector2d(0.1, 0.75),
			},
			right: {
				node: 'screen2',
				str: "two",
				pos: new me.Vector2d(0.8, 0.75),
			},
		},
		screen1: {
			bg: 'screen1',
			left: {
				node: 'screen3',
				str: "run",
				pos: new me.Vector2d(0.2, 0.70),
			},
			right: {
				node: 'screen2',
				str: "open",
				pos: new me.Vector2d(0.7, 0.55),
			},
		},
		screen2: {
			bg: 'screen2',
			left: {
				node: 'screen1',
				str: "activate",
				pos: new me.Vector2d(0.35, 0.65),
			},
			right: {
				node: 'screen3',
				str: "unplug",
				pos: new me.Vector2d(0.66, 0.60),
			},
		},
		screen3: {
			bg: 'screen3',
			left: {
				node: 'start',
				str: "one",
				pos: new me.Vector2d(0.1, 0.75),
			},
			right: {
				node: 'screen2',
				str: "two",
				pos: new me.Vector2d(0.8, 0.75),
			},
		},
		radmars: {
			bg: 'intro_mars.png',
		}
	};

	// First past creates nodes.
	Object.keys(data).forEach(function(e) {
		this.nodes[e] = new Node(data[e]);
		this.nodes[e].name = e;
	}.bind(this));

	// Second pass replace node name with reference.
	Object.keys(data).forEach(function(e) {
		var n = this.nodes[e];
		['left','right'].forEach(function(side){
			if(n[side]) {
				n[side].node = this.nodes[n[side].node];
			}
		}.bind(this));
	}.bind(this));
}

/** @return Node */
Story.prototype.getNode = function(name) {
	return this.nodes[name];
};
