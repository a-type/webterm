"use strict";

var $        = require("jquery");
var Terminal = require("terminal.js");
var Shell    = require("./lib/shell");
var _        = require("lodash");

window.$ = $;

$(function () {
	var promptTpl = _.template($("#promptTemplate").text().trim());
	var outputTpl = _.template($("#outputTemplate").text().trim());
	var errorTpl = _.template($("#errorTemplate").text().trim());

	var $mainDisplay = $(".main-display").get(0);

	var term = new Terminal({ rows: 24, columns: 80 });
	var shell = new Shell();

	var termInput = term.dom($mainDisplay);
	termInput.on("data", function (data) {
		console.log(data);
		shell.acceptInput(data);
	});

	shell.on("data", function (data) {
		term.write(data);
	});
});
