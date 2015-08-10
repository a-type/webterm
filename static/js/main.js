"use strict";

var $        = require("jquery");
var terminal = require("./lib/terminal.js");

$(function () {
	var $stdin = $("#stdin");
	var $stdout = $("#stdout");
	$stdin.keydown(function (event) {
		if(event.keyCode == 13) {
			var command = $stdin.val();
			terminal.runCommand(command)
			.then(function (result) {
				$stdout.append(result.output);
			});
		}
	});
});
