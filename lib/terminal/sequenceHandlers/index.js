"use strict";
var CSISequenceHandler    = require("./csi");
var EscapeSequenceHandler = require("./escape");
var SGRSequenceHandler    = require("./sgr");
var StringSequenceHandler = require("./string");

function SequenceHandler (terminal) {
	this.terminal = terminal;
	this.sgr = new SGRSequenceHandler(terminal);
	this.csi = new CSISequenceHandler(terminal, this.sgr);
	this.esc = new EscapeSequenceHandler(terminal, this.csi);
	this.str = new StringSequenceHandler(terminal, this.esc);

	this._backbuffer = "";
}

// runs a chunk of text through our interpretation chain,
// which really just means passing it to the string interpreter,
// which will call the others
SequenceHandler.prototype._interpretationChainProcess = function (chunk) {
	return this.str.interpret(chunk[0], chunk);
};

// runs a chunk of text through escape sequence interpreters.
// writes out any printed input
// returns all printed text (not escaped)
SequenceHandler.prototype.interpret = function (chunk) {
	// append to existing unprocessed text
	chunk = this._backbuffer + chunk;
	this._backbuffer = "";

	// any uninterpreted (printed) text
	var printedText = "";

	// the length of the last interpreted sequence
	var interpretedLength = 1;

	while (chunk.length > 0 && interpretedLength > 0) {
		interpretedLength = this._interpretationChainProcess(chunk);
		// the chunk does not start with an escape sequence
		if (interpretedLength === -1) {
			// write out the first character as display text
			this.terminal.state.putChar(chunk[0]);
			// record the character as printed
			printedText += chunk[0];
			// indicate we have 'interpreted' one character
			interpretedLength = 1;
		}

		// remove interpreted characters from start of string
		chunk = chunk.slice(interpretedLength);
	}

	// an escape sequence was recognized, but more input is required
	// so save the buffer
	if (chunk.length > 0) {
		this._backbuffer = chunk;
	}

	return printedText;
};

module.exports = SequenceHandler;
