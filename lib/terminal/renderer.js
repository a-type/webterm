"use strict";
var EventEmitter = require("events").EventEmitter;
var fs = require("fs");
var util = require("util");

// some helper functions
function getElementOffset (element) {
	var rect = element.getBoundingClientRect();

	return {
		top : rect.top + window.pageYOffset - document.documentElement.clientTop,
		left : rect.left + window.pageXOffset - document.documentElement.clientLeft
	};
}

function createFragment (html) {
	var container = document.createElement("div");
	container.innerHTML = html;
	return container;
}

// DOM renderer for terminal. Uses CSS classes instead of styling for easy customization.
function TerminalRenderer (target, terminal) {
	var self = this;

	this.terminal = terminal;

	this.element = target;

	_.templateSettings.variable = "context";
	this.lineTemplate = _.template(fs.readFileSync("./templates/line.html"));
	this.cursorTemplate = _.template(fs.readFileSync("./templates/cursor.html"));

	this.cursorGlyph = "#";
	this.cursorElement;

	// render loop
	(function renderLoop () {
		self.renderState(terminal.state);
		requestAnimationFrame(renderLoop);
	})();
}
util.inherits(TerminalRenderer, EventEmitter);

TerminalRenderer.prototype.renderLine = function (index, lineData) {
	var lineHtml = this.lineTemplate(lineData);
	if (this.element.children[index]) {
		var currentLine = this.element.children[index];
		currentLine.parentElement.insertBefore(createFragment(lineHtml), currentLine);
		currentLine.remove();
	}
	else {
		this.element.appendChild(createFragment(lineHtml));
	}
};

TerminalRenderer.prototype.renderCursor = function (cursor) {
	// populate non-breaking spaces to move the cursor laterally
	var spaces = _.pad("", cursor.x, "&nbsp;");
	var cursorLine = this.renderedLines[cursor.y];
	var cursorY = getElementOffset(cursorLine).top;

	var cursorHtml = this.cursorTemplate({ spaces : spaces, glyph: this.cursorGlyph, renderY : cursorY });

	if (this.cursorElement) {
		this.cursorElement.remove();
	}

	this.cursorElement = createFragment(cursorHtml);
	this.element.appendChild(this.cursorElement);
};

// Primary render, draws only dirty lines
TerminalRenderer.prototype.renderState = function (terminalState) {
	var self = this;
	_.each(terminalState.removedLines, function (lineIndex) {
		var line = this.element.children[lineIndex];
		line.remove();
	});
	terminalState.resetRemovedMarkers();

	_.each(terminalState.dirtyLines, function (lineIndex) {
		self.renderLine(lineIndex, terminalState.lines[lineIndex]);
	});
	terminalState.resetDirtyMarkers();
};

module.exports = TerminalRenderer;
