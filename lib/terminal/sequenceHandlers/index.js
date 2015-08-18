"use strict";
var CSISequenceHandler    = require("./csi");
var EscapeSequenceHandler = require("./escape");
var StringSequenceHandler = require("./string");

function SequenceHandler (terminal) {
	this.csi = new CSISequenceHandler(terminal);
	this.esc = new EscapeSequenceHandler(terminal, csi);
	this.str = new StringSequenceHandler(terminal, esc);

	this._backbuffer = "";
}

SequenceHandler.prototype._interpretationChainProcess = function (chunk) {

};

SequenceHandler.prototype.interpret = function (chunk) {
	// append to existing unprocessed text
	chunk = this._backbuffer + chunk;
	this._backbuffer = "";

	// the length of the last interpreted sequence
	var interpretedLength = 1;

	while (chunk.length > 0 && interpretedLength > 0) {
		interpretedLength
	}
};