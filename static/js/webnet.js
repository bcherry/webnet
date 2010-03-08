/*jslint white: true, browser: true, devel: true, forin: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, strict: true, immed: true, newcap: false */
/*globals window: false, Raphael: false, jQuery: false */
"use strict";
(function (global, console, Raphael, $) {
	var W = 640,
		H = 480,
		R = 20,
		canvas,
		root;
	
	function log() {
		if (console) {
			console.log.apply(this, Array.prototype.slice.call(arguments));
		}
	}
	
	function node() {
		var that = {},
			children = [];
		
		that.extend = function (count) {
			var i;
			
			if (count == null) {
				count = 3;
			}
			
			for (i = 0; i < count; i += 1) {
				children.push(node());
			}
			
			return children;
		};
		
		that.children = function () {
			return children;
		};
		
		return that;
	}
	
	// returns SVG path format for a simple line
	function line(x1, y1, x2, y2) {
		return "M" + x1 + " " + y1 + "L" + x2 + " " + y2;
	}
	
	function draw(node, x, y, parentX, parentY) {
		var i,
			l,
			children,
			newX,
			newY,
			element,
			lineElement;
		
		element = canvas.circle(x, y, R);
		element.attr({
			fill: "#000"
		});
		
		if (parentX != null && parentY != null) {
			lineElement = canvas.path(line(parentX, parentY, x, y));
		}
		
		function clicked() {
			element.unclick(clicked);

			children = node.extend();
			for (i = 0, l = children.length; i < l; i += 1) {
				// Obviously, this is retarded, but I didn't feel like working out a neat
				// visual balancing algorithm at the time
				switch (i) {
					case 0:
						newX = x - 80;
						newY = y;
						break;
					case 1:
						newX = x - 60;
						newY = y - 60;
						break;
					case 2:
						newX = x;
						newY = y - 80;
						break;
				}
				draw(children[i], newX, newY, x, y);
			}
		}
		
		element.click(clicked);
	}
	
	function drawAll() {
		draw(root, W / 2, H / 2);
	}
	
	function go() {
		canvas = Raphael("target", W, H);
		root = node();
		drawAll();
	}
	
	$(function () {
		go();
	});
}(window, window.console, Raphael, jQuery));