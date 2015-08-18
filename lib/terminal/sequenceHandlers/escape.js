"use strict";

// Handles C1 escape sequences
// https://en.wikipedia.org/wiki/C0_and_C1_control_codes
function EscapeSequenceHandler (terminal, csiHandler) {
	this.terminal = terminal;
	this.csiHandler = csiHandler;
}

EscapeSequenceHandler.prototype.interpret = function (character) {
	switch (character) {
		// all codes ESC [code]<br>

		case 'c': // full reset TODO
			return 2;
		case 'D': // move cursor down 1 (index) (deprecated)
			this.terminal.state.moveCursorRelative(0, 1);
			return 2;
		case 'E': // move cursor down one and return
			this.terminal.state.moveCursorRelative(0, 1).carriageReturn();
			return 2;
		case 'H': // tabset TODO: what does this mean?
			return 2;
		case 'K': // subscript TODO?
			return 2;
		case 'L': // superscript TODO?
			return 2;
		case 'M': // move cursor up 1 (reverse index)
			this.terminal.state.moveCursorRelative(0, -1);
			return 2;
		case 'P': // Device Control String (dcs) TODO: learn about this
			return 2;
		case 'T': // ignore previous character (disamiguated backspace?)
			this.terminal.state.backspace();
			return 2;
		case 'U': // message waiting, show indicator (this could be fun) TODO
			return 2;
		case '7': // save cursor TODO
			return 2;
		case '8': // restore cursor TODO
			return 2;
		case '[': // CSI, control sequence introducer
			var csi = this.csiHandler.parse(chunk);
			if (!csi || csi.commandType === "") {
				return 0; // incomplete csi, perhaps next time?
			}
			else if (csi.length !== chunk.length && csi.commandType === "") {
				return 1; // invalid csi, TODO: error handling
			}

			this.csiHandler.interpret(csi);

			return csi.length;
		case ']': // OSC, operating system command TODO
			return 2;
		case '(': // graphics? TODO
			return 2;
		case ')':
		case '*':
		case '+':
		case '-':
		case '.': // more graphics, possibly terminate graphics TODO
			return 2;
		case '#': // line height/width TODO
			return 2;
		case 'g': // visual bell
			this.bell();
			return 2;
		case '>': // normal keypad TODO
			return 2;
		case '=': // app keypad TODO
			return 2;
	}
};