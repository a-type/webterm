"use strict";

function SGRSequenceHandler (terminal) {
	this.terminal = terminal;
}

// takes a list of numerical arguments
SGRSequenceHandler.prototype.interpret = function (args) {
	if (args.length === 0) {
		this.terminal.state.resetAllAttributes();
	}
	// handle 2-argument pairs for fg/bg
	else if ((args[0] === 32 || args[0] === 48) && args[1] === 5) {
		this.terminal.state.setAttribute('fg', args[2]);
	}
	else {
		switch (args[0]) {
			case 0: // reset all
				this.terminal.state.resetAllAttributes();
				break;
			case 1: // bold
				break;
			case 2: // dim
				break;
			case 3: // italic
				break;
			case 4: // underline
				break;
			case 5: // slow blink :D
				break;
			case 6: // fast blink D:
				break;
			case 7: // inverse
				break;
			case 8: // hidden
				break;
			case 9: // strikethrough
				break;
			case 10: // primary font
				break;
			case 11: // alternate fonts
			case 12:
			case 13:
			case 14:
			case 15:
			case 16:
			case 17:
			case 18:
			case 19:
				break;
			case 20: // fraktur font. really.
				break;
			case 21: // double underline
				break;
			case 22: // bold off
				break;
			case 23: // italic off
				break;
			case 24: // underline off
				break;
			case 25: // slow blink off
				break;
			case 26: // fast blink off (proportional spacing?)
				break;
			case 27: // inverse off
				break;
			case 28: // hidden off
				break;
			case 29: // strikethrough off
				break;
			// 8-mode foreground colors
			case 30: // black
			case 31: // red
			case 32: // green
			case 33: // yellow
			case 34: // blue
			case 35: // magenta
			case 36: // cyan
			case 37: // white
				break;
			case 38: // covered above
				break;
			case 39: // reset fg
				break;
			// 8-mode background colors
			case 40: // black
			case 41: // red
			case 42: // green
			case 43: // yellow
			case 44: // blue
			case 45: // magenta
			case 46: // cyan
			case 47: // white
				break;
			case 48: // covered above
				break;
			case 49: // reset bg
				break;
			case 50: // turn off proportional spacing?
				break;
			case 51: // framed
				break;
			case 52: // encircled
				break;
			case 53: // overlined
				break;
			case 54: // border off (frame/circle)
				break;
			case 55: // overline off
				break;
		}
	}
};