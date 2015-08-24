"use strict";

var Terminal         = require("./lib/terminal");
var TerminalDomInput = require("./lib/domInput");
var TerminalRenderer = require("./lib/terminal/renderer");
var Shell            = require("jsh");
var _                = require("lodash");

document.addEventListener("DOMContentLoaded", function () {
	var mainDisplay = document.getElementsByClassName("main-display")[0];

	var inputStream = new TerminalDomInput();
	inputStream.attach(mainDisplay);

	var term = new Terminal();
	var shell = new Shell({ echoInput : false });

	inputStream.pipe(term);
	term.pipe(shell);
	shell.on("data", term.writeOutput.bind(term));

	var termOutput = new TerminalRenderer(mainDisplay, term);

	setTimeout(mainDisplay.focus(), 10);
});
