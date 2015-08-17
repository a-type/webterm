"use strict";
var EventEmitter = require("events").EventEmitter;
var TerminalRenderer = require("./renderer");
var TerminalState = require("./state");
var util = require("util");

var MODE_NORMAL = 0;
var MODE_ESC = 1;
var MODE_CSI = 2;
var MODE_OSC = 3;

var CSI_PATTERN = /^\x1b\[([?!>]?)([0-9;]*)([@A-Za-z`]?)/;
var DCS_PATTERN = /^\x1bP([0-9;@A-Za-z`]*)\x1b\\/;
var OSC_PATTERN = /^\x1b\]([0-9]*);([^\x07]*)(\x07?)/;

function Terminal () {
	var self = this;

	this._state = new TerminalState();
	this._renderer = new TerminalRenderer();

	this._escapeMode = MODE_NORMAL;
	this._escapeBuffer = "";

	// render loop integration. it seems a bit backwards,
	// but I'd like to keep browser logic out of this file
	this._renderer.on("requestRender", function () {
		self._renderer.renderState(self._state);
	});
}

util.inherits(Terminal, EventEmitter);

var proto = Terminal.prototype;

proto.signalChild = function (signal) {};
proto.sendCommandLine = function (line) {};

proto.bell = function () {};

proto.beginEsc = function () {
	this._escapeMode = MODE_ESC;
};
proto.endEsc = function () {
	this._escapeMode = MODE_NORMAL;
	this._escapeBuffer = "";
};

proto.beginCsi = function () {
	this._escapeMode = MODE_CSI;
};
proto.endCsi = proto.endEsc;

proto.parseCsi = function (chunk) {
	var i;
	var match = CSI_PATTERN.exec(chunk);
	if(match === null)
		return null;
	var args = match[2] === '' ? [] : match[2].split(';');
	for(i = 0; i < args.length; i++)
		args[i] = +args[i];
	return {
		args: args,
		mod: match[1],
		cmd: match[3],
		length: match[0].length
	};
};

proto.handleCsi = function (character) {
	switch (character) {
		case '@': // insert blank characters
			break;
		case 'A': // cursor up n times (def. 1)
			break;
		case 'B': // cursor down n times (def. 1)
			break;
		case 'C': // cursor forward n times (def. 1)
			break;
		case 'D': // cursor backward n times (def. 1)
			break;
		case 'E': // cursor down n rows, to first column (def. 1)
			break;
		case 'F': // cursor 'preceeding line n times' ? (def. 1)
			break;
		case 'G':
	}
};
proto.handleEsc = function (character) {
	switch (character) {
		// all codes ESC [code]<br>

		case 'c': // full reset TODO
			break;
		case 'D': // move cursor down 1 (index)
			this._state.moveLine(1);
			break;
		case 'E': // move cursor down one and return
			this._state.moveLine(1).carriageReturn();
			break;
		case 'H': // tabset TODO: what does this mean?
			break;
		case 'K': // subscript TODO?
			break;
		case 'L': // superscript TODO?
			break;
		case 'M': // move cursor up 1 (reverse index)
			this._state.moveLine(-1);
			break;
		case 'P': // Device Control String (dcs) TODO: learn about this
			break;
		case 'T': // ignore previous character TODO
			break;
		case 'U': // message waiting, show indicator (this could be fun) TODO
			break;
		case '7': // save cursor TODO
			break;
		case '8': // restore cursor TODO
			break;
		case '[': // CSI, control sequence introducer
			this.beginCsi();
			break;
		case ']': // OSC, operating system command TODO
			break;
		case '(': // graphics? TODO
			break;
		case ')':
		case '*':
		case '+':
		case '-':
		case '.': // more graphics, possibly terminate graphics TODO
			break;
		case '#': // line height/width TODO
			break;
		case 'g': // visual bell
			this.bell();
			break;
		case '>': // normal keypad TODO
			break;
		case '=': // app keypad TODO
			break;
	}
};
proto.handleStr = function (character) {
	switch (character) {
		case '\x07': // bell
			this.bell();
			break;
		case '\x08': // backspace
			this._state.backspace();
			break;
		case '\x09': // tab
			this._state.tab();
			break;
		case '\x7f': // delete
			this.state.delete();
			break;
		case '\x88': // tabset TODO: what does this mean?
			break;
		case '\x1b': // escape
			this.beginEsc();
			break;
		case '\r': // carriage return
			this.state.carriageReturn();
			break;
	}
};

proto.getLineLength = function (row) {
	return this._state.lines[row].text.length;
};

// TODO: does our terminal ever really need to know selection state? probably yes.
proto.setSelection = function (startX, startY, endX, endY) {};

proto.putChar = function (character) {
	return this.state.putChar(character);
};

proto.read = function (data) {
	var i = 0;
	for (i = 0; i < data.length; i++) {
		// interpret escape sequences

		this.putChar(data[i]);
	}
};

module.exports = Terminal;
