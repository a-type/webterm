"use strict";
var _ = require("lodash");

function LineAttributes (opts) {
	// defaults
	this.fg = 10;
	this.bg = 0;
	this.bold = false;
	this.underline = false;
	this.italic = false;
	this.blink = false; // and please stay that way
	this.inverse = false;

	// apply passed values
	_.assign(this, _.pick(opts, [ "fg", "bg", "bold", "underline", "italic", "blink", "inverse" ]));
}

module.exports = LineAttributes;