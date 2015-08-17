"use strict";
var EventEmitter = require("events").EventEmitter;
var SequenceHandlers = require("./sequenceHandlers");
var TerminalRenderer = require("./renderer");
var TerminalState = require("./state");
var util = require("util");

var MODE_NORMAL = 0;
var MODE_ESC = 1;
var MODE_CSI = 2;
var MODE_OSC = 3;

function Terminal () {
	var self = this;

	this.state = new TerminalState();
	this._renderer = new TerminalRenderer();
	this._sequenceHandlers = new SequenceHandlers(this);

	// render loop integration. it seems a bit backwards,
	// but I'd like to keep browser logic out of this file
	this._renderer.on("requestRender", function () {
		self._renderer.renderState(self.state);
	});
}

util.inherits(Terminal, EventEmitter);

var proto = Terminal.prototype;

proto.signalChild = function (signal) {};
proto.sendCommandLine = function (line) {};

proto.bell = function () {};

proto.getLineLength = function (row) {
	return this.state.lines[row].text.length;
};

// TODO: does our terminal ever really need to know selection state? probably yes.
proto.setSelection = function (startX, startY, endX, endY) {};

proto.putChar = function (character) {
	return this.state.putChar(character);
};

proto.userInput = function (data) {
	// write data as usual
	this.writeOutput(data);
	// interpret line delimiters as send command
};

proto.writeOutput = function (data) {
	// interpret escape sequences.
	// this will take care of writing anything to output as well
	this._sequenceHandlers.interpret(data);
};

module.exports = Terminal;
