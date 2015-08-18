"use strict";

var Terminal         = require("./lib/terminal");
var TerminalDomInput = require("./lib/domInput");
var TerminalRenderer = require("./lib/terminal/renderer");
var Shell            = require("./lib/shell");
var _                = require("lodash");

document.addEventListener("DOMContentLoaded", function () {
	var mainDisplay = document.getElementsByClassName("main-display")[0];

	var shell = new Shell();

	var term = new Terminal({ rows: 24, columns: 80 });
	var shellInput = new TerminalDomInput(mainDisplay, shell);
	var termOutput = new TerminalRenderer(mainDisplay, term);

	shell.on("data", function (data) {
		term.write(data);
	});

	setTimeout(mainDisplay.focus(), 10);
});
