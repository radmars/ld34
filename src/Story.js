
/**
 * Nodes in a story have a left and right choice, a background... maybe some
 * other things?
 * @class
 */
function Node(settings) {
	this.bg = settings.bg;
	/** @type Node */
	this.right = null;
	/** @type Node */
	this.left = null;
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
		},
		screen1: {
			bg: 'screen1',
		},
		screen2: {
			bg: 'screen2',
		},
		screen3: {
			bg: 'screen3',
		},
	};

	Object.keys(data).forEach(function(e) {
		this.nodes[e] = new Node(data[e]);
	}.bind(this));

	// Bind nodes together
	this.join('start', 'screen1', 'screen2');
	this.join('screen1', 'start', 'screen3');
	this.join('screen2', 'start', 'screen3');
	this.join('screen3', 'screen1', 'screen2');
}

/**
 * @param {Node} from.
 * @param {Node} left.
 * @param {Node} right.
 */
Story.prototype.join = function (from, left, right) {
	if(left == null  || !this.nodes[left]) {
		throw "Left is null or missing!";
	}

	if(right == null || !this.nodes[right]) {
		throw "Right is null or missing!";
	}

	if(from == null  || !this.nodes[from]) {
		throw "From is missing!";
	}

	this.nodes[from].left  = this.getNode(left);
	this.nodes[from].right = this.getNode(right);
};

/** @return Node */
Story.prototype.getNode = function(name) {
	return this.nodes[name];
};
