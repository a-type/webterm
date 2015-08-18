"use strict";
var Cursor = require("./cursor");
var Line = require("./line");
var LineAttributes = require("./lineAttributes");
var _ = require("lodash");

var MODE_INSERT = 0;
var MODE_OVERWRITE = 1;

function TerminalState (defaultAttributes) {
	this.rows = 0;
	this.cols = 0;

	this._defaultAttributes = defaultAttributes || new LineAttributes();
	this._currentAttributes = _.clone(defaultAttributes);

	this.lines = [];
	this.altLines = [];
	this.dirtyLines = [];
	this.removedLines = []; // using dirty lines for removed lines is really
									// inefficient, since all lines must shift after

	this.cursor = new Cursor();

	// theoretically we would have scroll limits, but I'd like to try to avoid that

	this.mode = 0; // TODO: modes

	this.charset = "utf-8";

	// create first line
	this.newLine();
}

TerminalState.prototype.setAllDirty = function () {
	var i;
	for (i = 0; i < this.lines.length; i++) {
		this.dirtyLines.push(i);
	}
};

TerminalState.prototype.resetDirtyMarkers = function () {
	this.dirtyLines = [];
};

TerminalState.prototype.resetRemovedMarkers = function () {
	this.removedLines = [];
};

// simply creates a line with current attributes
TerminalState.prototype._createLine = function () {
	return new Line("", { 0 : this._currentAttributes });
};

// directly sets a line in the buffer. does not affect cursor position.
TerminalState.prototype.setLine = function (index, lineData) {
	this.lines[index] = lineData;
	this.dirtyLines.push(index);

	return this;
};

// shortcut: pushes a new line onto the lines list without affecting cursor position
TerminalState.prototype.pushLine = function (lineData) {
	this.lines.push(lineData);
	this.dirtyLines.push(this.lines.length - 1);

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

TerminalState.prototype.removeLine = function (index) {
	this.lines.splice(index, 1);
	this.removedLines.push(index);
	// now we must shift all dirty lines to account for removal... not ideal but cheaper
	// than re-rendering everything
	var i;
	for (i = 0; i < this.dirtyLines.length; i++) {
		if (this.dirtyLines[i] > index) {
			this.dirtyLines[i] -= 1; // shifting downwards 1
		}
	}
};

// puts a printed char at the current cursor position. behavior is according to current mode.
// NOTE: this terminal does not consider line delimiters printed, as lines are distinct objects
TerminalState.prototype.putChar = function (character) {
	var cursorRow = this.cursor.y;
	var cursorColumn = this.cursor.x;
	var currentLine = this.lines[cursorRow];

	switch (this.mode) {
		case MODE_INSERT:
			currentLine.text = currentLine.text.slice(0, cursorColumn) +
				character + currentLine.text.slice(cursorColumn);
			break;
		case MODE_OVERWRITE:
			currentLine.text[cursorColumn] = character;
			break;
	}

	// any way you write the character, the cursor will move over 1
	this.moveCursorRelative(1, 0, true);
	// mark the effected line as dirty
	this.dirtyLines.push(cursorRow);

	return this;
};

// returns cursor to the beginning of the current line
TerminalState.prototype.carriageReturn = function () {
	this.cursor.x = 0;

	return this;
};

TerminalState.prototype.backspace = function (numChars) {
	numChars = numChars || 1;

	var currentLine = this.lines[this.cursor.y];
	var posX = this.cursor.x;
	currentLine.text = currentLine.text.slice(posX - numChars, posX);
	this.dirtyLines.push(this.cursor.y);

	return this;
};

TerminalState.prototype.delete = function (numChars) {
	numChars = numChars || 1;

	var currentLine = this.lines[this.cursor.y];
	var posX = this.cursor.x;
	currentLine.text = currentLine.text.slice(posX, posX + numChars);
	this.dirtyLines.push(this.cursor.y);

	return this;
};

// deletes all of the buffer after the cursor
TerminalState.prototype.deleteTextAfterCursor = function () {
	var cursorLine = this.lines[this.cursor.y];
	cursorLine.text = cursorLine.text.split(this.cursor.x);
	this.dirtyLines.push(this.cursor.y);

	// now delete remaining lines
	while (this.lines.length > this.cursor.y - 1) {
		this.removeLine(this.lines.length - 1);
	}

	return this;
};

TerminalState.prototype.deleteTextBeforeCursor = function () {
	var cursorLine = this.lines[this.cursor.y];
	cursorLine.text = cursorLine.text.split(0, this.cursor.x - 1);
	this.dirtyLines.push(this.cursor.y);

	while (this.lines.length > this.cursor.y - 1) {
		this.removeLine(0);
	}

	return this;
};

TerminalState.prototype.moveCursor = function (row, col, padSpace) {
	this.cursor.x = row;
	this.cursor.y = col;

	this._enforceCursorBounds(padSpace);

	return this;
};

TerminalState.prototype.moveCursorRelative = function (numRows, numCols, padSpace) {
	this.cursor.x += numRows;
	this.cursor.y += numCols;

	this._enforceCursorBounds(padSpace);

	return this;
};

TerminalState.prototype._enforceCursorBounds = function (padSpace) {
	// TODO: verify correct behavior
	if (this.cursor.y >= this.lines.length) {
		if (padSpace) {
			while (this.lines.length < this.cursor.y - 1) {
				this.pushLine(this._createLine());
			}
		}
		this.cursor.y = this.lines.length - 1;
	}

	// TODO: verify correct behavior
	if (this.cursor.x >= this.lines[this.cursor.y].text.length) {
		if (padSpace) {
			while (this.lines[this.cursor.y].text.length < this.cursor.x + 1) {
				this.lines[this.cursor.y].text += " ";
			}
		}
		else {
			this.cursor.x = this.lines[this.cursor.y].text.length - 1;
		}
	}
};

module.exports = TerminalState;
