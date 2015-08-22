"use strict";
var SequenceHandlers = require("./sequenceHandlers");
var TerminalState = require("./state");

var MODE_NORMAL = 0;
var MODE_ESC = 1;
var MODE_CSI = 2;
var MODE_OSC = 3;

function Terminal (inputStream) {
	var self = this;

	this.state = new TerminalState(/* TODO: set default attributes */);
	this._sequenceHandlers = new SequenceHandlers(this);

	inputStream.on("data", this.write.bind(this));
}

var proto = Terminal.prototype;

proto.signalChild = function (signal) {};
proto.sendCommandLine = function (line) {};

proto.bell = function () {};

proto.getLineLength = function (row) {
	return this.state.lines[row].text.length;
};

// TODO: does our terminal ever really need to know selection state? probably yes.
proto.setSelection = function (startX, startY, endX, endY) {};

proto.write = function (data) {
	// interpret escape sequences.
	// this will take care of writing anything to output as well
	this._sequenceHandlers.interpret(data);
};

module.exports = Terminal;
