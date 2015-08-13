"use strict";

var Bluebird     = require("bluebird");
var childProcess = require("child_process");
var EventEmitter = require("events").EventEmitter;
var path         = require("path");
var util         = require("util");
var _            = require("lodash");

var DEBUG = process.env.DEBUG === "true";

// string starts with non-space characters, ends with >
// TODO: user-configurable
var PROMPT_MATCH = /^(\S+)>$/;

function Shell () {
	var self = this;
	var cwd = path.resolve(process.cwd());
	var env = _.clone(process.env);

	function escapeData (data) {
		return data.replace(/\t/g, "&#9;").replace("	", "&#9;")
			.replace(/\n/g, "")
			.replace(/\r/g, ""); // todo: better handling of return carriage
	}

	function processData (dataInput, eventType) {
		var dataLines = dataInput.split("\n");

		_.each(dataLines, function (data) {
			if (/^\s*$/.test(data)) {
				return;
			}

			data = escapeData(data);

			if (DEBUG) {
				console.log("DATA>" + data);
			}

			var prompt = PROMPT_MATCH.exec(data);
			if (prompt) {
				self.emit(eventType, {
					type      : "prompt",
					cwd       : prompt[1],
					separator : ">",
					text      : data
				});
			}
			else {
				self.emit(eventType, {
					type : "output",
					text : data
				});
			}
		});
	}

	// todo: cross-platform
	var child = childProcess.spawn("cmd.exe", { cwd : cwd, env : env, stdio : "pipe" });
	child.stdin.setEncoding("utf-8");

	child.stdout.on("data", function (data) {
		processData(data + "", "out");
	});

	child.stderr.on("data", function (data) {
		processData(data + "", "err");
	});

	child.on("close", function () {
		console.log("SHELL CLOSED");
	});

	child.on("disconnect", function () {
		console.log("SHELL DISCONNECT");
	});

	child.on("exit", function () {
		console.log("SHELL EXIT");
	});

	this.runCommand = function (command) {
		child.stdin.write(command.sourceString + "\n");
	};
}

util.inherits(Shell, EventEmitter);

module.exports = Shell;
