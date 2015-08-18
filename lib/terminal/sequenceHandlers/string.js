"use strict";

// Handles C0 escape sequences
// https://en.wikipedia.org/wiki/C0_and_C1_control_codes
function StringSequenceHandler (terminal, escapeHandler) {
	this.terminal = terminal;
	this.escapeHandler = escapeHandler;
}

// interprets a chunk of text based on command type, returns number of characters processed
StringSequenceHandler.prototype.interpret = function (type, chunk) {
	switch (type) {
		case '\x07': // bell
			this.bell();
			return 0;
		case '\x08': // backspace
			this.terminal.state.backspace();
			return 0;
		case '\x09': // tab
			this.terminal.state.tab();
			return 0;
		case '\x0A': // line feed
			this.terminal.state.moveCursorRelative(0, 1, true);
			return 0;
		case '\x20': // space
			this.terminal.putChar(" ");
			return 0;
		case '\x7f': // delete
			this.terminal.state.delete();
			return 0;
		case '\x88': // tabset TODO: what does this mean?
			return 0;
		case '\x1b': // escape
			var escapeCommandType = chunk[1];
			if (!escapeCommandType) {
				return 0;
			}

			return this.escapeHandler.interpret(escapeCommandType, chunk);
		case '\r': // carriage return
			this.terminal.state.carriageReturn();
			return 0;
	}
};

module.exports.StringSequenceHandler = StringSequenceHandler;