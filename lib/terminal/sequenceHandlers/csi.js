"use strict";
var CSI_PATTERN = /^\x1b\[([?!>]?)([0-9;]*)([@A-Za-z`]?)/;

function CSISequenceHandler (terminal, sgr) {
	this.terminal = terminal;
	this.sgrHandler = sgr;
}

/*
	Based off work on terminal.js, currently maintained by @Gottox
	https://github.com/Gottox/terminal.js/blob/master/lib/terminal.js#L132
*/
CSISequenceHandler.prototype.parse = function (chunk) {
	var i;
	var match = CSI_PATTERN.exec(chunk);

	if(match === null)
		return null;

	var args = match[2] === '' ? [] : match[2].split(';');
	for(i = 0; i < args.length; i++) {
		args[i] = Number(args[i]);
	}

	return {
		args        : args,
		modifier    : match[1],
		commandType : match[3],
		length      : match[0].length
	};
};

/*
	param csiData takes the form seen in the `parse` function:
	{
		commandType : single-character command indicator
		args        : arguments to command, all numbers
		modifier    : ? ! > (modification characters)
		length      : length of the matched csi sequence
	}
*/
CSISequenceHandler.prototype.interpret = function (csiData) {
	switch (csiData.commandType) {
		case '@': // insert blank characters
			break;
		case 'A': // cursor up n times (def. 1)
			this.terminal.state.moveCursorRelative(0, -csiData.args[0]);
			break;
		case 'B': // cursor down n times (def. 1)
			this.terminal.state.moveCursorRelative(0, csiData.args[0]);
			break;
		case 'C': // cursor forward n times (def. 1)
			this.terminal.state.moveCursorRelative(csiData.args[0], 0);
			break;
		case 'D': // cursor backward n times (def. 1)
			this.terminal.state.moveCursorRelative(-csiData.args[0], 0);
			break;
		case 'E': // cursor down n rows, to first column (def. 1)
			this.terminal.state.moveCursorRelative(0, csiData.args[0]).carriageReturn();
			break;
		case 'F': // cursor up n rows, to first column (def. 1)
			this.terminal.state.moveCursorRelative(0, -csiData.args[0]).carriageReturn();
			break;
		case 'G': // cursor column absolute
			this.terminal.state.moveCursor(csiData.args[0]);
			break;
		case 'H': // cursor position absolute
			this.terminal.state.moveCursor(csiData.args[0], csiData.args[1]);
			break;
		case 'I': // cursor forward n tabs (def. 1)
			break;
		case 'J': // erase display ('': cursor->end, '0': cursor->end, '1': start->cursor, '2': whole display)
			switch (csiData.args[0]) {
				case 0:
				case 1:
				case 2:
			}
			break;
		case 'K': // erase line ('': cursor->end, '0': cursor->end, '1': start->cursor, '2': whole line)
			break;
		case 'L': // insert n lines (def. 1)
			break;
		case 'M': // delete n lines (def. 1)
			break;
		case 'P': // delete n characters (def. 1)
			break;
		case 'R': // report cursor position ? TODO
			break;
		case 'S': // scroll up n lines
			break;
		case 'T':
			// 1 param: scroll down n lines
			// 5 params: initiate highlight mouse tracking?
			// 2 params: > mode ?
			break;
		case 'X': // erase n characters (def. 1)
			break;
		case 'Z': // cursor tab backward n tabs
			break;
		case 'a': // cursor right n columns
			break;
		case 'b': // repeat preceeding graphic char n times
			break;
		case 'c': // send device attributes
			break;
		case 'd': // cursor row absolute
			break;
		case 'e': // cursor row relative
			break;
		case 'f': // cursor position (absolute?)
			break;
		case 'g': // tab clear ('0': clear tab at cursor, '3': clear all tabs)
			break;
		case 'h': // set mode
			break;
		case 'i': // media copy ? TODO
			break;
		case 'l': // reset mode
			break;
		case 'm': // char attributes!
			this.sgrHandler.interpret(csiData.args);
			break;
		case 'n': // device status report? TODO
			break;
		case 'p': // set pointer mode | soft term reset | ansi mode | private mode
			break;
		case 'q': // LEDs
			break;
		case 'r': // set scrolling region
			break;
		case 's': // save cursor
			break;
		case 't': // ???
			break;
		case 'u': // restore cursor
			break;
		case 'v': // DECCRA ?
			break;
		case 'w': // DECEFR ?
			break;
		case 'x': // request term parameters | select attribute change extent
			break;
		case 'y': // request checksum of rectangular area
			break;
		case 'z': // erase rectangular area
			break;
		case '{': // selectively erase rectangular area
			break;
		case '|': // request locator position
			break;
		case '}': // insert n columns
			break;
		case '~': // delete n columns
			break;
	}
};