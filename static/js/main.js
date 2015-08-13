"use strict";

var $       = require("jquery");
var Command = require("./lib/command");
var Shell   = require("./lib/shell");
var _       = require("lodash");

window.$ = $;

$(function () {
	var shell = new Shell();

	var promptTpl = _.template($("#promptTemplate").text().trim());
	var outputTpl = _.template($("#outputTemplate").text().trim());
	var errorTpl = _.template($("#errorTemplate").text().trim());

	var $stdin = $("#stdin");
	var $stdout = $("#stdout");

	$(".main-display").click(function () { $stdin.focus(); });

	function resetInput () {
		$stdin.remove();
		$stdout.append($stdin);
		$stdin.keydown(function (event) {
			$stdin.attr("size", $stdin.val().length + 1);
			if(event.keyCode == 13) {
				var commandString = $stdin.val();
				shell.runCommand(new Command(commandString));
				$stdin.val("").attr("size", 1).remove();
			}
		});
		$stdin.focus();
	}
	resetInput();

	var lastWasPrompt = false;

	shell.on("out", function (data) {
		var $generated;

		switch(data.type) {
			case "prompt":
				lastWasPrompt = true;
				$generated = $(promptTpl(data));
				$stdout.append($generated);
				resetInput();
				break;
			default:
				$generated = $(outputTpl(data));
				if (lastWasPrompt) {
					$generated.addClass("command");
				}
				lastWasPrompt = false;
				$stdout.append($generated);
				break;
		}
	});

	shell.on("err", function (data) {
		$stdout.append($(errorTpl(data)));
		resetInput();
	});
});
