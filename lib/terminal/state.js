"use strict";
var Cursor = require("./cursor");
var Line = require("./line");

var MODE_INSERT = 0;
var MODE_OVERWRITE = 1;

function TerminalState {
	this.rows = 0;
	this.cols = 0;

	this.lines = [];
	this.altLines = [];
	this.dirtyLines = [];

	this.cursor = new Cursor();

	// theoretically we would have scroll limits, but I'd like to try to avoid that

	this.mode = 0; // TODO: modes
	this.escapeFlags = 0; // TODO: escape state

	this.charset = "utf-8";
}

TerminalState.prototype.setAllDirty = function () {
	var i;
	for (i = 0; i < this.lines.length; i++) {
		this.dirtyLines.push(i);
	}
};

// directly sets a line in the buffer. does not affect cursor position.
TerminalState.prototype.setLine = function (index, lineData) {
	this.lines[index] = lineData;
	this.dirtyLines.push(index);

	return this;
};

// moves the cursor to a new line at the end of the buffer.
TerminalState.prototype.newLine = function () {
	var newLine = new Line();
	this.lines.push(newLine);
	this.dirtyLines.push(this.lines.length - 1);
	this.cursor.y = this.lines.length - 1;

	return this;
};

TerminalState.prototype.addLine = function (line) {
	this.lines.push(line);
	this.dirtyLines.push(this.lines.length - 1);

	return this;
};

// moves cursor up or down a certain number of lines
TerminalState.prototype.moveLine = function (lines) {
	this.cursor.y += lines;

	// TODO verify correct behavior
	if (this.cursor.y >= this.lines.length) {
		this.cursor.y = this.lines.length - 1;
	}

	return this;
}

// returns cursor to the beginning of the current line
TerminalState.prototype.carriageReturn = function () {
	cursor.x = 0;

	return this;
};

// puts a printed char at the current cursor position. behavior is according to current mode.
// NOTE: this terminal does not consider line delimiters printed, as lines are distinct objects
TerminalState.prototype.putChar = function (character) {
	var cursorRow = this.cursor.y;
	var cursorColumn = this.cursor.x;
	var currentLine = this.lines[cursorRow];

	switch (this.mode) {
		case MODE_INSERT:
			currentLine.text = currentLine.slice(0, cursorColumn) +
				character + currentLine.slice(cursorColumn);
			break;
		case MODE_OVERWRITE:
			currentLine.text[cursorColumn] = character;
			break;
	}

	// any way you write the character, the cursor will move over 1
	this.moveCursorRelative(1, 0);
	// mark the effected line as dirty
	this.dirtyLines.push(cursorRow);

	return this;
};

TerminalState.prototype.backspace = function () {
	var currentLine = this.lines[this.cursor.y];
	var posX = this.cursor.x;
	currentLine.text = currentLine.text.slice(posX - 1, posX);
	this.dirtyLines.push(this.cursor.y);

	return this;
};

TerminalState.prototype.delete = function () {
	var currentLine = this.lines[this.cursor.y];
	var posX = this.cursor.x;
	currentLine.text = currentLine.text.slice(posX, posX + 1);
	this.dirtyLines.push(this.cursor.y);

	return this;
};

TerminalState.prototype.moveCursor = function (row, col) {
	this.cursor.x = row;
	this.cursor.y = col;

	return this;
};

TerminalState.prototype.moveCursorRelative = function (numRows, numCols) {
	this.cursor.x += numRows;
	this.cursor.y += numCols;

	return this;
};
