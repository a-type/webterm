"use strict";

var $       = require("jquery");
var Command = require("./lib/command");
var Shell   = require("./lib/shell");

$(function () {
	var shell = new Shell();

	var $stdin = $("#stdin");
	var $stdout = $("#stdout");
	$stdin.keydown(function (event) {
		if(event.keyCode == 13) {
			var commandString = $stdin.val();
			shell.runCommand(new Command(commandString));
			$stdin.val("");
		}
	});

	shell.on("out", function (data) {
		$stdout.append("<div>" + data + "</div>");
	});

	shell.on("err", function (data) {
		$stdout.append("[ERROR] " + data);
	});
});
