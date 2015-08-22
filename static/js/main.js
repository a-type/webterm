"use strict";

var Terminal         = require("./lib/terminal");
var TerminalDomInput = require("./lib/domInput");
var TerminalRenderer = require("./lib/terminal/renderer");
var Shell            = require("jsh");
var stream           = require("stream");
var _                = require("lodash");

document.addEventListener("DOMContentLoaded", function () {
	var mainDisplay = document.getElementsByClassName("main-display")[0];

	var shellInputStream = new TerminalDomInput();
	shellInputStream.attach(mainDisplay);

	var shell = new Shell();

	shellInputStream.pipe(shell);

	var term = new Terminal(shell);
	var termOutput = new TerminalRenderer(mainDisplay, term);

	setTimeout(mainDisplay.focus(), 10);
});
