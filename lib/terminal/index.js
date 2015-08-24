"use strict";
var Transform        = require("stream").Transform;
var SequenceHandlers = require("./sequenceHandlers");
var TerminalState    = require("./state");
var util             = require("util");

var MODE_NORMAL = 0;
var MODE_ESC = 1;
var MODE_CSI = 2;
var MODE_OSC = 3;

function Terminal () {
	Transform.call(this, arguments);
	var self = this;

	this.state = new TerminalState(/* TODO: set default attributes */);
	this._sequenceHandlers = new SequenceHandlers(this);
}
util.inherits(Terminal, Transform);

var proto = Terminal.prototype;

proto.signalChild = function (signal) {};
proto.sendCommandLine = function (line) {};

proto.bell = function () {};

proto.getLineLength = function (row) {
	return this.state.lines[row].text.length;
};

// TODO: does our terminal ever really need to know selection state? probably yes.
proto.setSelection = function (startX, startY, endX, endY) {};

proto._transform = function (data, encoding, next) {
	// interpret escape sequences.
	// this will take care of writing anything to output as well
	var printedText = this._sequenceHandlers.interpret(data);
	// send the resulting text to the shell
	next(null, printedText);
};

// writes final output from shell without
// feeding back through the stream
proto.writeOutput = function (data) {
	this._sequenceHandlers.interpret(data);
};

module.exports = Terminal;
